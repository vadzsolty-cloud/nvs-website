import test,{after} from 'node:test';import assert from 'node:assert/strict';import nodemailer from 'nodemailer';
const previousSender=process.env.NVS_MAIL_SENDER;process.env.NVS_MAIL_SENDER='synthetic-sender@gmail.com';
after(()=>{if(previousSender===undefined)delete process.env.NVS_MAIL_SENDER;else process.env.NVS_MAIL_SENDER=previousSender;});
test('SMTP app-password validation and concurrent readiness coalescing',async()=>{
 const {mailTransport,validatePassword}=await import('./mail.mjs?coalescing');
 assert.equal(validatePassword('abcd efgh ijkl mnop'),'abcdefghijklmnop');assert.throws(()=>validatePassword('normal-password-is-not-an-app-password'),/MAIL_NOT_CONFIGURED/);
 const originalFetch=globalThis.fetch,originalTransport=nodemailer.createTransport;let reads=0,verifies=0;
 const transport={verify:async()=>{verifies++;}};
 try{globalThis.fetch=async()=>{reads++;return {ok:true,json:async()=>({payload:{data:Buffer.from('abcdefghijklmnop').toString('base64')}})}};nodemailer.createTransport=options=>{assert.equal(options.auth.user,'synthetic-sender@gmail.com');assert.equal(options.port,465);assert.equal(options.tls.rejectUnauthorized,true);return transport;};const app={options:{credential:{getAccessToken:async()=>({access_token:'synthetic-only'})}}};const all=await Promise.all(Array.from({length:30},()=>mailTransport(app)));assert.ok(all.every(x=>x===transport));assert.equal(reads,1);assert.equal(verifies,1);await mailTransport(app);assert.equal(reads,1);}finally{globalThis.fetch=originalFetch;nodemailer.createTransport=originalTransport;}
});
test('notification uses the personal sender but keeps company recipient and reply address',async()=>{
 const {deliverNotification,SENDER,MAILBOX}=await import('./mail.mjs');const id='synthetic-sender-test';
 const records=new Map([['nvsWebsiteMailOutbox/'+id,{appointmentId:id,to:MAILBOX,status:'pending',attempts:0}],['appointments/'+id,{source:'web',shopId:'QB2fsNCT32ReZ5fiGcaHM7BjoNw2',date:'2099-12-01',time:'10:00',serviceId:'adas'}]]);
 const db={doc(path){return {path,async get(){return {exists:records.has(path),data:()=>records.get(path)};},async update(data){Object.assign(records.get(path),data);}};},async runTransaction(fn){return fn({get:ref=>ref.get(),update:(ref,data)=>Object.assign(records.get(ref.path),data)});}};
 let message;await deliverNotification(db,id,{async sendMail(m){message=m;}});
 assert.equal(message.from.address,SENDER);assert.equal(message.to,MAILBOX);assert.equal(message.replyTo,MAILBOX);assert.notEqual(SENDER,MAILBOX);assert.equal(records.get('nvsWebsiteMailOutbox/'+id).status,'sent');
 records.set('nvsWebsiteMailOutbox/forged',{appointmentId:'forged',to:'other@example.invalid',status:'pending',attempts:0});
 await assert.rejects(()=>deliverNotification(db,'forged',{sendMail(){throw Error('must not send');}}),/INVALID_EVENT/);
});
test('missing secret fails closed and backs off instead of repeatedly attempting SMTP',async()=>{
 const {mailTransport}=await import('./mail.mjs?failure');const originalFetch=globalThis.fetch;let reads=0;
 try{globalThis.fetch=async()=>{reads++;return {ok:false,status:404}};const app={options:{credential:{getAccessToken:async()=>({access_token:'synthetic-only'})}}};await assert.rejects(()=>mailTransport(app),/MAIL_NOT_CONFIGURED/);await assert.rejects(()=>mailTransport(app),/MAIL_NOT_CONFIGURED/);assert.equal(reads,1);}finally{globalThis.fetch=originalFetch;}
});
