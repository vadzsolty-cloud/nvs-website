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
test('notification includes callback details and recorded vehicle fields, with safe HTML',async()=>{
 const {buildNotification}=await import('./notification.mjs');
 const details={contact:{name:'Synthetic Customer',phone:'+40 700 111 222',email:'customer@example.invalid'},companyName:'Synthetic Fleet',vehicle:{plate:'TEST-001',make:'Fixture',model:'Vehicle',year:'2021',vin:'SYNTHETICVIN000001',mileage:'123456',fuelType:'Hybrid',engineCapacity:'1998',powerKw:'110',transmission:'Automatic',color:'Grey',history:'PRIVATE_HISTORY_MUST_NOT_LEAK'}};
 const message=buildNotification({date:'2099-12-01',time:'10:00',serviceId:'other',note:'Olajcsere\n<script>not executable</script>'},details,'internal-only-id');
 for(const value of ['Synthetic Customer','+40 700 111 222','customer@example.invalid','TEST-001','Fixture','2021','SYNTHETICVIN000001','123456','Hybrid','1998','110','Automatic','Grey','Olajcsere','Egyéb szervizmunka'])assert.ok(message.text.includes(value),value);
 assert.ok(message.html.includes('href="tel:+40700111222"'));assert.ok(message.html.includes('&lt;script&gt;'));assert.ok(!message.html.includes('<script>'));assert.ok(!message.text.includes('PRIVATE_HISTORY_MUST_NOT_LEAK'));assert.ok(message.subject.includes('TEST-001'));
});
test('snapshots contain vehicle data only and contact validation requires a callable phone',async()=>{
 const {notificationDetails,contactDetails}=await import('./request-details.mjs');
 const profile={name:'Synthetic Person',phone:'+40 700 111 222'},user={email:'verified@example.invalid'};
 assert.deepEqual(contactDetails({},profile,user),{name:'Synthetic Person',phone:'+40 700 111 222',email:user.email});
 for(const bad of ['', 'abc', '+1', '000000000000000000000', '+40\nBcc:other@example.invalid'])assert.throws(()=>contactDetails({contactPhone:bad},profile,user),/CONTACT_REQUIRED/);
 const snapshot=notificationDetails({plate:'TEST-002',vin:'SYNTHETICVIN',history:[{private:'secret'}],photos:['private-url'],accessToken:'secret'},contactDetails({},profile,user),profile);
 assert.equal(snapshot.vehicle.plate,'TEST-002');assert.equal(snapshot.vehicle.vin,'SYNTHETICVIN');assert.ok(!JSON.stringify(snapshot).includes('secret'));assert.ok(!JSON.stringify(snapshot).includes('private-url'));
});

