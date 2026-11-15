import {createBookingService as productionService} from '../../backend/functions/booking.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {initializeApp,deleteApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {emulatorConfig,PROJECT} from './guard.mjs';
import {DEMO_SHOP,registryId} from './booking.mjs';
import {processOutbox} from './outbox.mjs';
import {createPreviewServer} from '../../scripts/preview-server.mjs';
const app=initializeApp(emulatorConfig()),db=getFirestore(app),auth=getAuth(app);
const authUrl='http://'+process.env.FIREBASE_AUTH_EMULATOR_HOST;
const api='http://127.0.0.1:5001/'+PROJECT+'/europe-west1/websiteApi';
async function post(url,body,token){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};}
const authPost=(route,body)=>post(authUrl+'/identitytoolkit.googleapis.com/v1/accounts:'+route+'?key=emulator-only',body);
async function login(email){const r=await authPost('signInWithPassword',{email,password:'Nvs-test-only-123!',returnSecureToken:true});assert.equal(r.status,200,JSON.stringify(r.body));return r.body.idToken;}
async function user(prefix,verified=true){const uid=prefix+'-'+randomUUID().slice(0,12),email=uid+'@example.invalid';await auth.createUser({uid,email,password:'Nvs-test-only-123!',emailVerified:verified});return {uid,email,token:await login(email)};}
async function request(token,input){return post(api+'/request',input,token);}
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.now()+2*86400000));
async function eventually(fn){let last;for(let n=0;n<60;n++){try{return await fn();}catch(e){last=e;await new Promise(r=>setTimeout(r,250));}}throw last;}
test('isolated Firebase Auth, Functions, Firestore and mail sink integration',async t=>{
 const customer=await user('customer'),other=await user('other');
 await auth.createUser({uid:DEMO_SHOP,email:'workshop@example.invalid',password:'Nvs-test-only-123!',emailVerified:true});
 const shopToken=await login('workshop@example.invalid');
 // App workshop listener is scoped by shopId == workshop Auth uid.
 await db.doc('shops/'+DEMO_SHOP).set({name:'Synthetic NVS',status:'approved'});
 const carId='car-'+customer.uid;await db.doc('cars/'+carId).set({id:carId,ownerUid:customer.uid,shopId:DEMO_SHOP,plate:'TEST-'+customer.uid,make:'Synthetic',model:'Fixture'});
 const payload={carId,serviceId:'adas',date,time:'10:00',note:'Synthetic test only',lang:'hu',idempotencyKey:randomUUID()};
 let saved;
 await t.test('production request service rejects forged access and deduplicates pending requests in the isolated emulator',async()=>{
 const svc=productionService({db,auth,shopId:DEMO_SHOP});const p={...payload,time:'16:30',acceptNotice:true,idempotencyKey:randomUUID()};
 await assert.rejects(()=>svc.request(customer.token,{...p,acceptNotice:false}),/NOTICE_REQUIRED/);await assert.rejects(()=>svc.request(other.token,p),/FORBIDDEN/);await assert.rejects(()=>svc.request(customer.token,{...p,status:'confirmed'}),/INVALID_INPUT/);const results=await Promise.all([svc.request(customer.token,p),svc.request(customer.token,p)]);assert.equal(results[0].id,results[1].id);const a=(await db.doc('appointments/'+results[0].id).get()).data();assert.equal(a.status,'pending');assert.equal(a.capacityGuaranteed,false);assert.equal(a.shopId,DEMO_SHOP);assert.equal(a.privacyNoticeVersion,'2026-11-15');assert.equal((await db.doc('nvsWebsiteMailOutbox/'+results[0].id).get()).data().status,'pending');await assert.rejects(()=>svc.request(customer.token,{...p,idempotencyKey:randomUUID()}),/DUPLICATE_REQUEST/);
 });
 await t.test('local-only web lab serves module/translations with restricted emulator CSP',async()=>{
  const server=createPreviewServer({output:'../artifacts/emulator-ui',basePath:'/nvs-website',emulatorUi:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const host='http://127.0.0.1:'+server.address().port;
  try{
   for(const l of ['hu','ro','en']){const r=await fetch(host+'/nvs-website/'+l+'/lab/');assert.equal(r.status,200);assert.ok(r.headers.get('content-security-policy').includes('127.0.0.1:9099'));assert.ok((await r.text()).includes('lab-request'));}
   const script=await fetch(host+'/nvs-website/assets/emulator-lab.js');assert.equal(script.status,200);assert.match(script.headers.get('content-type'),/javascript/);
   const copy=await (await fetch(host+'/nvs-website/assets/lab-copy.json')).json();for(const l of ['hu','ro','en'])assert.ok(copy[l].states.pending);
   const home=await fetch(host+'/nvs-website/hu/');assert.ok(!home.headers.get('content-security-policy').includes('127.0.0.1:9099'));assert.ok(!(await home.text()).includes('emulator-lab.js'));
  }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
 });
 await t.test('verified identity, ownership, workshop and forged fields are enforced',async()=>{
  assert.equal((await request(null,payload)).status,401);
  const unverified=await user('unverified',false);assert.equal((await request(unverified.token,payload)).body.error,'EMAIL_NOT_VERIFIED');
  assert.equal((await request(other.token,payload)).body.error,'FORBIDDEN');
  assert.equal((await request(customer.token,{...payload,shopId:'forged'})).body.error,'INVALID_INPUT');
  assert.equal((await request(customer.token,{...payload,status:'confirmed'})).status,400);
  assert.equal((await request(customer.token,{...payload,date:null})).status,400);
  assert.equal((await request(customer.token,{...payload,note:'x'.repeat(9000)})).status,413);
  const badOrigin=await fetch(api+'/request',{method:'POST',headers:{Origin:'https://example.invalid','Content-Type':'application/json'},body:JSON.stringify(payload)});assert.equal(badOrigin.status,403);
  await db.doc('cars/'+carId).update({shopId:'unapproved-other-shop'});assert.equal((await request(customer.token,payload)).status,403);
  await db.doc('cars/'+carId).update({shopId:DEMO_SHOP});
 });
 await t.test('parallel retries produce one pending app-compatible appointment and outbox',async()=>{
  const results=await Promise.all(Array.from({length:4},()=>request(customer.token,payload)));
  for(const r of results)assert.equal(r.status,200,JSON.stringify(r.body));
  assert.equal(new Set(results.map(r=>r.body.id)).size,1);saved=results[0].body.id;
  const a=(await db.doc('appointments/'+saved).get()).data();
  assert.equal(a.source,'web');assert.equal(a.status,'pending');assert.equal(a.ownerUid,customer.uid);assert.equal(a.shopId,DEMO_SHOP);assert.equal(a.capacityGuaranteed,false);assert.equal(a.timeZone,'Europe/Bucharest');
  for(const field of ['id','carId','date','time','note','techId','photoUrl','companyId','createdAt','declineReason','proposedDate','proposedTime'])assert.ok(field in a,field);
  const appView=await db.collection('appointments').where('shopId','==',DEMO_SHOP).get();assert.ok(appView.docs.some(d=>d.id===saved));
  const mine=await fetch(api+'/requests',{headers:{Authorization:'Bearer '+customer.token}});assert.ok((await mine.json()).some(a=>a.id===saved));
  const theirs=await fetch(api+'/requests',{headers:{Authorization:'Bearer '+other.token}});assert.equal((await theirs.json()).length,0);
  assert.equal((await request(customer.token,{...payload,note:'different'})).body.error,'IDEMPOTENCY_CONFLICT');
  assert.equal((await request(customer.token,{...payload,idempotencyKey:randomUUID()})).body.error,'DUPLICATE_REQUEST');
 });
 await t.test('Firestore Rules deny direct client writes and unrelated reads',async()=>{
  const url='http://'+process.env.FIRESTORE_EMULATOR_HOST+'/v1/projects/'+PROJECT+'/databases/(default)/documents/appointments/'+saved;
  assert.equal((await fetch(url,{headers:{Authorization:'Bearer '+customer.token}})).status,200);
  assert.equal((await fetch(url,{headers:{Authorization:'Bearer '+shopToken}})).status,200);
  assert.equal((await fetch(url,{headers:{Authorization:'Bearer '+other.token}})).status,403);
  assert.equal((await fetch(url,{method:'PATCH',headers:{Authorization:'Bearer '+customer.token,'Content-Type':'application/json'},body:JSON.stringify({fields:{status:{stringValue:'confirmed'}}})})).status,403);
 });
 await t.test('Firestore-triggered notification goes only to a deduplicated emulator sink',async()=>{
  await eventually(async()=>assert.ok((await db.doc('emulatedMail/'+saved).get()).exists));
  const sink=(await db.doc('emulatedMail/'+saved).get()).data();assert.equal(sink.to,'nightvisionservice2025@gmail.com');assert.equal(sink.transport,'emulator-sink');
  assert.equal(await processOutbox(db,saved),'deduplicated');
  // Exercise backoff/dead-letter without racing the create trigger: reuse delivered event with a separate existing test record.
  const retryId='retry-'+randomUUID();await db.doc('webMailOutbox/'+retryId).set({appointmentId:saved,to:sink.to,status:'dead',attempts:0,nextAttemptAt:0});
  await db.doc('webMailOutbox/'+retryId).update({status:'retry'});
  const now=Date.now()+10000;
  assert.equal(await processOutbox(db,retryId,{now:()=>now,failDelivery:true}),'retry');
  assert.equal(await processOutbox(db,retryId,{now:()=>now}),'deferred');
  assert.equal(await processOutbox(db,retryId,{now:()=>now+5000}),'sent');
  assert.equal(await processOutbox(db,retryId,{now:()=>now+5000}),'deduplicated');
  const deadId='dead-'+randomUUID();await db.doc('webMailOutbox/'+deadId).set({appointmentId:saved,to:sink.to,status:'dead',attempts:0,nextAttemptAt:0});await db.doc('webMailOutbox/'+deadId).update({status:'retry'});
  for(let i=0;i<5;i++)assert.equal(await processOutbox(db,deadId,{now:()=>now+(i+1)*100000,failDelivery:true}),'retry');
  assert.equal((await db.doc('webMailOutbox/'+deadId).get()).data().status,'dead');assert.equal((await db.doc('emulatedMail/'+deadId).get()).exists,false);
  await db.doc('appointments/'+saved).update({status:'confirmed'});
  const replay=await request(customer.token,payload);assert.equal(replay.body.status,'confirmed');
 });
 await t.test('email verification, voluntary profile and registry collision never claim another car',async()=>{
  const newUser=await user('new-user',false);
  const profile={name:'Synthetic Person',phone:'+40000000000',plate:'TEST-'+newUser.uid.slice(-12),make:'Synthetic',model:'Fixture',lang:'ro',acceptNotice:true,marketing:false};
  assert.equal((await post(api+'/register-profile',profile,newUser.token)).status,403);
  assert.equal((await authPost('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:newUser.token})).status,200);
  const oob=await (await fetch(authUrl+'/emulator/v1/projects/'+PROJECT+'/oobCodes')).json();const code=oob.oobCodes.find(c=>c.email===newUser.email&&c.requestType==='VERIFY_EMAIL');assert.ok(code);
  assert.equal((await authPost('update',{oobCode:code.oobCode})).status,200);
  newUser.token=await login(newUser.email);
  assert.equal((await post(api+'/register-profile',{...profile,acceptNotice:false},newUser.token)).status,400);
  const registered=await post(api+'/register-profile',profile,newUser.token);assert.equal(registered.status,200,JSON.stringify(registered.body));
  assert.equal((await post(api+'/register-profile',profile,newUser.token)).body.carId,registered.body.carId);
  const car=(await db.doc('cars/'+registered.body.carId).get()).data();assert.equal(car.ownerUid,newUser.uid);assert.equal(car.shopId,undefined);
  assert.equal((await request(newUser.token,{...payload,carId:registered.body.carId})).status,403);
  assert.equal((await db.doc('webMarketingConsents/'+newUser.uid).get()).exists,false);
  const duplicate=await user('duplicate');const collision=await post(api+'/register-profile',{...profile,marketing:true},duplicate.token);assert.equal(collision.body.error,'VEHICLE_REQUIRES_APP');
  assert.equal((await db.doc('vehicleRegistry/'+registryId('plate',profile.plate)).get()).data().ownerUid,newUser.uid);
  assert.equal((await db.doc('customerRegistrations/'+duplicate.uid).get()).exists,false);
  const opted=await user('opted');const optResult=await post(api+'/register-profile',{...profile,plate:'TEST-'+opted.uid.slice(-12),marketing:true},opted.token);assert.equal(optResult.status,200);
  assert.equal((await db.doc('webMarketingConsents/'+opted.uid).get()).data().granted,true);
 });
 await t.test('company access is scoped by active role and driver assignment',async()=>{
  const fleet=await user('fleet'),car='fleet-'+fleet.uid;
  await db.doc('cars/'+car).set({ownerUid:'another-primary',companyId:'synthetic-company',shopId:DEMO_SHOP});
  await db.doc('companyMembers/'+fleet.uid).set({companyId:'synthetic-company',status:'active',role:'viewer'});
  const p={...payload,carId:car,idempotencyKey:randomUUID()};assert.equal((await request(fleet.token,p)).status,403);
  await db.doc('companyMembers/'+fleet.uid).update({role:'driver',assignedCarIds:[]});assert.equal((await request(fleet.token,p)).status,403);
  await db.doc('companyMembers/'+fleet.uid).update({assignedCarIds:[car]});assert.equal((await request(fleet.token,p)).status,200);
  const fleetCars=await (await fetch(api+'/cars',{headers:{Authorization:'Bearer '+fleet.token}})).json();assert.ok(fleetCars.some(c=>c.id===car));
 });
 await t.test('rate limiting applies server-side to new distinct requests',async()=>{
  for(const time of ['11:00','12:00','13:00','14:00'])assert.equal((await request(customer.token,{...payload,time,idempotencyKey:randomUUID()})).status,200);
  assert.equal((await request(customer.token,{...payload,time:'15:00',idempotencyKey:randomUUID()})).status,429);
 });
 await deleteApp(app);
});
