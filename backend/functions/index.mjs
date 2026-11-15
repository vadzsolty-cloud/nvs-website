import {onRequest} from 'firebase-functions/v2/https';
import {onDocumentCreated} from 'firebase-functions/v2/firestore';
import {initializeApp,applicationDefault} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {createBookingService} from './booking.mjs';
import {mailTransport,deliverNotification} from './mail.mjs';
const projectId='night-vision-service',shopId='QB2fsNCT32ReZ5fiGcaHM7BjoNw2';
const app=initializeApp({projectId,credential:applicationDefault()});
const options={region:'europe-west1',serviceAccount:'nvs-website@night-vision-service.iam.gserviceaccount.com',maxInstances:2,memory:'256MiB',timeoutSeconds:45};
const codes={UNAUTHENTICATED:401,EMAIL_NOT_VERIFIED:403,FORBIDDEN:403,NOTICE_REQUIRED:400,INVALID_INPUT:400,INVALID_TIME:400,NONEXISTENT_TIME:400,AMBIGUOUS_TIME:400,RATE_LIMITED:429,DUPLICATE_REQUEST:409,IDEMPOTENCY_CONFLICT:409,MAIL_NOT_CONFIGURED:503};
function guard(){if(process.env.GCLOUD_PROJECT!==projectId||process.env.FIRESTORE_EMULATOR_HOST||process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('WRONG_ENVIRONMENT');}
export const nvsWebsiteApi=onRequest(options,async(req,res)=>{
 res.set('Cache-Control','no-store');const origin=req.get('origin');
 if(origin&&origin!=='https://vadzsolty-cloud.github.io'){res.status(403).json({error:'FORBIDDEN'});return;}
 if(origin){res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');}
 res.set('Access-Control-Allow-Headers','Authorization, Content-Type');res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 if(req.method==='OPTIONS'){res.status(204).end();return;}
 try{
  guard();const route=req.path.replace(/\/$/,'');
  if(req.method==='GET'&&route==='/health'){try{await mailTransport(app);res.json({bookingEnabled:true,mailConfigured:true,mode:'pending-request'});}catch{res.status(503).json({bookingEnabled:false,mailConfigured:false,error:'MAIL_NOT_CONFIGURED'});}return;}
  if((req.rawBody?.length||0)>8192){res.status(413).json({error:'INVALID_INPUT'});return;}
  const token=/^Bearer (.+)$/.exec(req.get('authorization')||'')?.[1];
  if(!token)throw Error('UNAUTHENTICATED');
  const db=getFirestore(app),service=createBookingService({db,auth:getAuth(app),shopId});
  if(req.method==='GET'&&route==='/cars'){res.json(await service.cars(token));return;}
  if(req.method==='GET'&&route==='/requests'){res.json(await service.requests(token));return;}
  if(req.method==='POST'&&route==='/request'){
   // Verify account/ownership before checking mail; reject when notifications cannot be delivered.
   await service.cars(token);await mailTransport(app);
   const result=await service.request(token,req.body||{});res.json(result);return;
  }
  res.status(404).json({error:'NOT_FOUND'});
 }catch(e){const code=codes[e.message]?e.message:'SERVICE_UNAVAILABLE';res.status(codes[code]||503).json({error:code});}
});
export const nvsWebsiteMail=onDocumentCreated({...options,document:'nvsWebsiteMailOutbox/{eventId}',retry:true},async event=>{
 guard();const db=getFirestore(app),ref=db.doc('nvsWebsiteMailOutbox/'+event.params.eventId);
 const current=(await ref.get()).data();if(!current||['dead','sent'].includes(current.status))return;
 let transport;
 try{transport=await mailTransport(app);}catch{
  const retry=await db.runTransaction(async tx=>{const snap=await tx.get(ref),e=snap.data();if(!e||['dead','sent'].includes(e.status))return false;const attempts=(e.attempts||0)+1;tx.update(ref,{attempts,status:attempts>=5?'dead':'retry',lastError:'MAIL_NOT_CONFIGURED'});return attempts<5;});
  if(retry)throw Error('MAIL_NOT_CONFIGURED');return;
 }
 await deliverNotification(db,event.params.eventId,transport);
});
