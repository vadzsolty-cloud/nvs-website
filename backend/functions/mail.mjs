import nodemailer from 'nodemailer';
export const MAILBOX='nightvisionservice2025@gmail.com';
export function validatePassword(value){const pass=String(value||'').replace(/\s/g,'');if(!/^[A-Za-z0-9]{16}$/.test(pass))throw Error('MAIL_NOT_CONFIGURED');return pass;}
let cached=null,until=0;
export async function mailTransport(app){
 if(cached&&Date.now()<until)return cached;
 const token=await app.options.credential.getAccessToken();
 const r=await fetch('https://secretmanager.googleapis.com/v1/projects/night-vision-service/secrets/NVS_GMAIL_APP_PASSWORD/versions/latest:access',{headers:{Authorization:'Bearer '+token.access_token},signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('MAIL_NOT_CONFIGURED');
 const body=await r.json();const pass=validatePassword(Buffer.from(body.payload?.data||'','base64').toString('utf8'));
 const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user:MAILBOX,pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,tls:{minVersion:'TLSv1.2',rejectUnauthorized:true}});
 try{await transport.verify();}catch{throw Error('MAIL_NOT_CONFIGURED');}
 cached=transport;until=Date.now()+60000;return transport;
}
export async function deliverNotification(db,id,transport){
 if(!/^[A-Za-z0-9_-]{1,150}$/.test(id))throw Error('INVALID_EVENT');
 const ref=db.doc('nvsWebsiteMailOutbox/'+id);
 const event=await db.runTransaction(async tx=>{const s=await tx.get(ref);if(!s.exists)return null;const e=s.data();if(e.status==='sent'||e.status==='dead')return null;if(e.status==='sending'&&e.leaseUntil>Date.now())throw Error('MAIL_BUSY');if(e.to!==MAILBOX||e.appointmentId!==id)throw Error('INVALID_EVENT');tx.update(ref,{status:'sending',attempts:(e.attempts||0)+1,leaseUntil:Date.now()+120000});return e;});
 if(!event)return;
 try{
  const a=(await db.doc('appointments/'+id).get()).data();
  if(!a||a.source!=='web'||a.shopId!=='QB2fsNCT32ReZ5fiGcaHM7BjoNw2')throw Error('INVALID_EVENT');
  await transport.sendMail({from:{name:'Night Vision Service',address:MAILBOX},to:MAILBOX,messageId:'<'+id+'@night-vision-service.web.app>',subject:'NVS: új időpontkérés / solicitare nouă',text:['Új, műhelyi visszaigazolásra váró időpontkérés.','Solicitare nouă, în așteptarea confirmării atelierului.','Dátum / Data: '+a.date,'Idő / Ora: '+a.time,'Szolgáltatás / Serviciu: '+a.serviceId,'Azonosító / ID: '+id,'A kérés nem garantált, visszaigazolt időpont.','https://vadzsolty-cloud.github.io/nvs-app-letoltes/app/'].join('\n')});
  await ref.update({status:'sent',sentAt:Date.now(),leaseUntil:0,lastError:null});
 }catch{
  await ref.update({status:(event.attempts||0)+1>=5?'dead':'retry',leaseUntil:0,lastError:'MAIL_DELIVERY_FAILED'});
  if((event.attempts||0)+1<5)throw Error('MAIL_DELIVERY_FAILED');
 }
}
