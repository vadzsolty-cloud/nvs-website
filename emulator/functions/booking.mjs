import {createHash} from 'node:crypto';
import {bucharestInstant} from './time.mjs';
export const DEMO_SHOP='nvs-demo-shop'; // synthetic fixture, never a production shopId
export const SERVICES=['acc','adas','hunter-3d','camera','led-matrix','diagnostics'];
export const hash=s=>createHash('sha256').update(s).digest('hex');
export const identity=s=>String(s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'');
export const registryId=(kind,value)=>kind+'_'+hash(kind+':'+identity(value));
const fail=code=>{throw new Error(code);};
const text=(s,max)=>typeof s==='string'&&s.trim().length<=max?s.trim():fail('INVALID_INPUT');
const id=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,128}$/.test(s)?s:fail('INVALID_INPUT');
export function createBookingService({db,auth,now=Date.now}){
 async function principal(token){
  if(typeof token!=='string'||token.length>10000)fail('UNAUTHENTICATED');
  let decoded,user;
  try{decoded=await auth.verifyIdToken(token,true);user=await auth.getUser(decoded.uid);}catch{fail('UNAUTHENTICATED');}
  if(user.disabled||!decoded.email_verified||!user.emailVerified)fail('EMAIL_NOT_VERIFIED');
  return {uid:decoded.uid,email:user.email};
 }
 const limit=(tx,ref,snap)=>{
  const old=snap.data()||{},at=now(),same=at-(old.windowAt||0)<60000;
  if(same&&old.count>=5)fail('RATE_LIMITED');
  tx.set(ref,{windowAt:same?old.windowAt:at,count:same?(old.count||0)+1:1});
 };
 async function registerProfile(token,input){
  const u=await principal(token);
  if(input.acceptNotice!==true||input.accountType&&input.accountType!=='personal'||input.companyId||input.shopId||input.ownerUid)fail('INVALID_INPUT');
  const name=text(input.name,100),phone=text(input.phone,30),plate=text(input.plate||'',25),make=text(input.make||'',60),model=text(input.model||'',60);
  if(!name||!phone||!identity(plate)&&!(make&&model)||!['hu','ro','en'].includes(input.lang)||typeof input.marketing!=='boolean')fail('INVALID_INPUT');
  const carId='car_web_'+hash(u.uid).slice(0,32),ownerId='owner_web_'+hash(u.uid).slice(0,32);
  const reg=db.doc('customerRegistrations/'+u.uid),car=db.doc('cars/'+carId),rate=db.doc('webRateLimits/'+u.uid);
  const registry=identity(plate)?db.doc('vehicleRegistry/'+registryId('plate',plate)):null;
  return db.runTransaction(async tx=>{
   const [existing,carSnap,rateSnap,identitySnap]=await Promise.all([tx.get(reg),tx.get(car),tx.get(rate),registry?tx.get(registry):Promise.resolve(null)]);
   if(existing.exists){if(!carSnap.exists||carSnap.data().ownerUid!==u.uid)fail('PROFILE_REQUIRES_APP');return {carId,existing:true};}
   // Existing identity is never claimed or overwritten; app ownership-transfer workflow remains required.
   if(carSnap.exists||identitySnap?.exists)fail('VEHICLE_REQUIRES_APP');
   const at=now(),registration={uid:u.uid,accountType:'personal',companyId:'',company:null,name,contactName:name,phone,email:u.email,plate:plate.toUpperCase(),make,model,createdAt:at,seenByShopIds:[],duplicateTransferPending:false};
   limit(tx,rate,rateSnap);tx.create(reg,registration);
   tx.create(car,{id:carId,ownerId,ownerUid:u.uid,plate:plate.toUpperCase()||'—',make,model,owner:{name,phone,email:u.email,accountType:'personal'},companyId:'',seenByShopIds:[],createdAt:at,history:[]});
   if(registry)tx.create(registry,{carId,ownerUid:u.uid,shopId:'',label:(make+' '+model).trim()||'Jármű',identityType:'plate',createdAt:at,updatedAt:at});
   if(input.marketing)tx.create(db.doc('webMarketingConsents/'+u.uid),{uid:u.uid,purpose:'marketing',granted:true,noticeVersion:'emulator-1',language:input.lang,at});
   // No automatic shop assignment: the workshop must approve/link the vehicle independently.
   return {carId,existing:false,requiresWorkshopLink:true};
  });
 }
 async function request(token,input){
  const u=await principal(token);
  if(input.shopId||input.ownerUid||input.status||input.email)fail('INVALID_INPUT');
  const carId=id(input.carId),key=id(input.idempotencyKey),serviceId=input.serviceId;
  if(!SERVICES.includes(serviceId)||!['hu','ro','en'].includes(input.lang))fail('INVALID_INPUT');
  const note=text(input.note||'',500),startAt=bucharestInstant(input.date,input.time),at=now();
  if(startAt<=at||startAt>at+180*86400000)fail('INVALID_TIME');
  const payload={carId,date:input.date,time:input.time,serviceId,note,lang:input.lang};
  const digest=hash(JSON.stringify(payload)),apptId='apreq_web_'+hash([u.uid,carId,input.date,input.time].join('|'));
  const dedupe=db.doc('webRequestKeys/'+hash(u.uid+'|'+key)),appt=db.doc('appointments/'+apptId),carRef=db.doc('cars/'+carId),shopRef=db.doc('shops/'+DEMO_SHOP),rate=db.doc('webRateLimits/'+u.uid),guard=db.doc('webRequestGuards/'+hash(carId+'|'+input.date));
  return db.runTransaction(async tx=>{
   const [prior,carSnap,shop,rateSnap,guardSnap]=await Promise.all([tx.get(dedupe),tx.get(carRef),tx.get(shopRef),tx.get(rate),tx.get(guard)]);
   if(!carSnap.exists||carSnap.data().deletedAt)fail('FORBIDDEN');
   const car=carSnap.data();
   let allowed=car.ownerUid===u.uid;
   if(!allowed&&car.companyId){
    const member=(await tx.get(db.doc('companyMembers/'+u.uid))).data();
    allowed=member?.status==='active'&&member.companyId===car.companyId&&(['company_admin','fleet_manager'].includes(member.role)||member.role==='driver'&&Array.isArray(member.assignedCarIds)&&member.assignedCarIds.includes(carId));
   }
   if(!allowed||car.shopId!==DEMO_SHOP||!shop.exists||shop.data().status!=='approved')fail('FORBIDDEN');
   if(prior.exists){
    if(prior.data().digest!==digest)fail('IDEMPOTENCY_CONFLICT');
    const saved=await tx.get(db.doc('appointments/'+prior.data().appointmentId));if(!saved.exists)fail('IDEMPOTENCY_CONFLICT');
    return {id:saved.id,status:saved.data().status,replayed:true};
   }
   const same=await tx.get(db.collection('appointments').where('carId','==',carId).where('date','==',input.date));
   const active=same.docs.find(d=>d.data().time===input.time&&!['declined','customer_cancelled','customer_deleted'].includes(d.data().status));
   if(active)fail('DUPLICATE_REQUEST');
   // Do not overwrite even an inactive legacy request. Reopening requires a separate reviewed transition.
   const previous=await tx.get(appt);if(previous.exists)fail('DUPLICATE_REQUEST');
   const record={id:apptId,...payload,techId:null,status:'pending',photoUrl:'',ownerUid:u.uid,companyId:car.companyId||'',shopId:DEMO_SHOP,createdAt:at,declineReason:null,proposedDate:null,proposedTime:null,source:'web',timeZone:'Europe/Bucharest',startAt,capacityGuaranteed:false};
   limit(tx,rate,rateSnap);tx.set(guard,{version:(guardSnap.data()?.version||0)+1,updatedAt:at});
   tx.create(appt,record);tx.create(dedupe,{uid:u.uid,digest,appointmentId:apptId,createdAt:at});
   tx.create(db.doc('webMailOutbox/'+apptId),{appointmentId:apptId,to:'nightvisionservice2025@gmail.com',kind:'appointment_requested',status:'pending',attempts:0,nextAttemptAt:at,createdAt:at});
   return {id:apptId,status:'pending',replayed:false};
  });
 }
 async function cars(token){const u=await principal(token);return (await db.collection('cars').where('ownerUid','==',u.uid).get()).docs.filter(d=>!d.data().deletedAt).map(d=>({id:d.id,plate:d.data().plate,make:d.data().make,model:d.data().model,linked:d.data().shopId===DEMO_SHOP}));}
 async function requests(token){const u=await principal(token);return (await db.collection('appointments').where('ownerUid','==',u.uid).get()).docs.map(d=>({id:d.id,status:d.data().status,date:d.data().date,time:d.data().time}));}
 return {request,registerProfile,cars,requests};
}
