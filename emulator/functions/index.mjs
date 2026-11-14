import {onRequest} from 'firebase-functions/v2/https';
import {onDocumentCreated} from 'firebase-functions/v2/firestore';
import {initializeApp,getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {emulatorConfig} from './guard.mjs';
import {createBookingService} from './booking.mjs';
import {processOutbox} from './outbox.mjs';
function services(){const config=emulatorConfig();const app=getApps()[0]||initializeApp(config);const db=getFirestore(app);return {db,service:createBookingService({db,auth:getAuth(app)})};}
const errors={UNAUTHENTICATED:401,EMAIL_NOT_VERIFIED:403,FORBIDDEN:403,RATE_LIMITED:429,DUPLICATE_REQUEST:409,IDEMPOTENCY_CONFLICT:409,VEHICLE_REQUIRES_APP:409,PROFILE_REQUIRES_APP:409,INVALID_INPUT:400,INVALID_TIME:400,NONEXISTENT_TIME:400,AMBIGUOUS_TIME:400};
export const websiteApi=onRequest({region:'europe-west1',maxInstances:1},async(req,res)=>{
 res.set('Cache-Control','no-store');
 const origin=req.get('origin');
 if(origin&&!/^http:\/\/(localhost|127\.0\.0\.1):4180$/.test(origin)){res.status(403).json({error:'FORBIDDEN'});return;}
 if(origin){res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');}
 res.set('Access-Control-Allow-Headers','Authorization, Content-Type');res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 if(req.method==='OPTIONS'){res.status(204).end();return;}
 try{
  const {service}=services();
  if(req.get('content-length')&&Number(req.get('content-length'))>8192){res.status(413).json({error:'INVALID_INPUT'});return;}
  const token=/^Bearer (.+)$/.exec(req.get('authorization')||'')?.[1],route=req.path.replace(/\/$/,'');
  let result;
  if(req.method==='POST'&&route==='/request')result=await service.request(token,req.body||{});
  else if(req.method==='POST'&&route==='/register-profile')result=await service.registerProfile(token,req.body||{});
  else if(req.method==='GET'&&route==='/cars')result=await service.cars(token);
  else if(req.method==='GET'&&route==='/requests')result=await service.requests(token);
  else{res.status(404).json({error:'NOT_FOUND'});return;}
  res.json(result);
 }catch(e){const code=e.message;res.status(errors[code]||503).json({error:errors[code]?code:'EMULATOR_UNAVAILABLE'});}
});
export const websiteRequestMail=onDocumentCreated({document:'webMailOutbox/{eventId}',region:'europe-west1',retry:true},async event=>{
 const {db}=services();await processOutbox(db,event.params.eventId);
});
