import {createHash} from 'node:crypto';
import {bucharestInstant} from './time.mjs';
import {contactDetails,notificationDetails,savedContact} from './request-details.mjs';
export const SERVICES=['acc','adas','hunter-3d','camera','led-matrix','diagnostics','other'];
export const hash=s=>createHash('sha256').update(s).digest('hex');
export const identity=s=>String(s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'');
export const registryId=(kind,value)=>kind+'_'+hash(kind+':'+identity(value));
const fail=code=>{throw new Error(code);};
const text=(s,max)=>typeof s==='string'&&s.trim().length<=max?s.trim():fail('INVALID_INPUT');
const id=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,128}$/.test(s)?s:fail('INVALID_INPUT');
export function createBookingService({db,auth,shopId,now=Date.now}){
 async function principal(token){
  if(typeof token!=='string'||token.length>10000)fail('UNAUTHENTICATED');
  let decoded,user;
  try{decoded=await auth.verifyIdToken(token,true);user=await auth.getUser(decoded.uid);}catch{fail('UNAUTHENTICATED');}
  if(user.disabled||!decoded.email_verified||!user.emailVerified)fail('EMAIL_NOT_VERIFIED');
  return {uid:decoded.uid,email:user.email,name:user.displayName||'',phone:user.phoneNumber||''};
 }
 const limit=(tx,ref,snap)=>{
  const old=snap.data()||{},at=now(),same=at-(old.windowAt||0)<60000;
  if(same&&old.count>=5)fail('RATE_LIMITED');
  tx.set(ref,{windowAt:same?old.windowAt:at,count:same?(old.count||0)+1:1});
 };
 async function request(token,input){
  const u=await principal(token);
  if(input.acceptNotice!==true)fail('NOTICE_REQUIRED');
  if(input.noticeVersion!==undefined&&!['2026-11-15','2026-11-16'].includes(input.noticeVersion))fail('INVALID_INPUT');
  if(input.shopId||input.ownerUid||input.status||input.email||input.contactEmail||input.details||input.vehicle)fail('INVALID_INPUT');
  const carId=id(input.carId),key=id(input.idempotencyKey),serviceId=input.serviceId;
  if(!SERVICES.includes(serviceId)||!['hu','ro','en'].includes(input.lang))fail('INVALID_INPUT');
  const note=text(input.note||'',1500),startAt=bucharestInstant(input.date,input.time),at=now();
  if(serviceId==='other'&&!note)fail('SERVICE_DETAILS_REQUIRED');
  const apptId='apreq_web_'+hash([u.uid,carId,input.date,input.time].join('|'));
  const dedupe=db.doc('nvsWebsiteRequestKeys/'+hash(u.uid+'|'+key)),appt=db.doc('appointments/'+apptId),carRef=db.doc('cars/'+carId),shopRef=db.doc('shops/'+shopId),rate=db.doc('nvsWebsiteRateLimits/'+u.uid),guard=db.doc('nvsWebsiteRequestGuards/'+hash(carId+'|'+input.date));
  return db.runTransaction(async tx=>{
   const [prior,carSnap,shop,rateSnap,guardSnap,profileSnap]=await Promise.all([tx.get(dedupe),tx.get(carRef),tx.get(shopRef),tx.get(rate),tx.get(guard),tx.get(db.doc('customerRegistrations/'+u.uid))]);
   if(!carSnap.exists||carSnap.data().deletedAt)fail('FORBIDDEN');
   const car=carSnap.data();
   let allowed=car.ownerUid===u.uid;
   if(!allowed&&car.companyId){
    const member=(await tx.get(db.doc('companyMembers/'+u.uid))).data();
    allowed=member?.status==='active'&&member.companyId===car.companyId&&(['company_admin','fleet_manager'].includes(member.role)||member.role==='driver'&&Array.isArray(member.assignedCarIds)&&member.assignedCarIds.includes(carId));
   }
   if(!allowed||car.shopId!==shopId||!shop.exists||shop.data().status!=='approved')fail('FORBIDDEN');
   // Existing open clients may retry an older request without contact fields.
   // Reuse the already saved result without sending a second notification.
   const oldPayload={carId,date:input.date,time:input.time,serviceId,note,lang:input.lang};
   if(prior.exists&&input.contactName===undefined&&input.contactPhone===undefined&&prior.data().digest===hash(JSON.stringify(oldPayload))){
    const saved=await tx.get(db.doc('appointments/'+prior.data().appointmentId));if(!saved.exists)fail('IDEMPOTENCY_CONFLICT');
    return {id:saved.id,status:saved.data().status,replayed:true};
   }
   const profile=profileSnap.data()||{},contact=contactDetails(input,profile,u);
   const payload={carId,date:input.date,time:input.time,serviceId,note,lang:input.lang,contactName:contact.name,contactPhone:contact.phone};
   const digest=hash(JSON.stringify(payload));
   if(prior.exists){
    if(prior.data().digest!==digest)fail('IDEMPOTENCY_CONFLICT');
    const saved=await tx.get(db.doc('appointments/'+prior.data().appointmentId));if(!saved.exists)fail('IDEMPOTENCY_CONFLICT');
    return {id:saved.id,status:saved.data().status,replayed:true};
   }
   if(startAt<=at||startAt>at+180*86400000)fail('INVALID_TIME');
   const same=await tx.get(db.collection('appointments').where('carId','==',carId).where('date','==',input.date));
   const active=same.docs.find(d=>d.data().time===input.time&&!['declined','customer_cancelled','customer_deleted'].includes(d.data().status));
   if(active)fail('DUPLICATE_REQUEST');
   // Do not overwrite even an inactive legacy request. Reopening requires a separate reviewed transition.
   const previous=await tx.get(appt);if(previous.exists)fail('DUPLICATE_REQUEST');
   const record={id:apptId,...payload,contactEmail:contact.email,techId:null,status:'pending',photoUrl:'',ownerUid:u.uid,companyId:car.companyId||'',shopId:shopId,createdAt:at,declineReason:null,proposedDate:null,proposedTime:null,source:'web',timeZone:'Europe/Bucharest',startAt,capacityGuaranteed:false,privacyNoticeVersion:input.noticeVersion||'2026-11-15',noticeAcknowledgedAt:at};
   limit(tx,rate,rateSnap);tx.set(guard,{version:(guardSnap.data()?.version||0)+1,updatedAt:at});
   tx.create(appt,record);tx.create(dedupe,{uid:u.uid,digest,appointmentId:apptId,createdAt:at});
   tx.create(db.doc('nvsWebsiteMailOutbox/'+apptId),{appointmentId:apptId,to:'nightvisionservice2025@gmail.com',details:notificationDetails(car,contact,profile),kind:'appointment_requested',status:'pending',attempts:0,nextAttemptAt:at,createdAt:at});
   return {id:apptId,status:'pending',replayed:false};
  });
 }
 async function cars(token){
  const u=await principal(token),own=(await db.collection('cars').where('ownerUid','==',u.uid).get()).docs;
  const member=(await db.doc('companyMembers/'+u.uid).get()).data();
  if(member?.status==='active'&&member.companyId&&['company_admin','fleet_manager','driver'].includes(member.role)){
   const fleet=(await db.collection('cars').where('companyId','==',member.companyId).get()).docs;
   own.push(...fleet.filter(d=>member.role!=='driver'||Array.isArray(member.assignedCarIds)&&member.assignedCarIds.includes(d.id)));
  }
  return [...new Map(own.map(d=>[d.id,d])).values()].filter(d=>!d.data().deletedAt).map(d=>({id:d.id,plate:d.data().plate||'',make:d.data().make||'',model:d.data().model||'',linked:d.data().shopId===shopId}));
 }
 async function requests(token){const u=await principal(token);return (await db.collection('appointments').where('ownerUid','==',u.uid).get()).docs.map(d=>({id:d.id,status:d.data().status,date:d.data().date,time:d.data().time}));}
 async function profile(token){const u=await principal(token);return savedContact((await db.doc('customerRegistrations/'+u.uid).get()).data()||{},u);}
 return {request,cars,requests,profile};
}

