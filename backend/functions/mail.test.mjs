import test from 'node:test';import assert from 'node:assert/strict';import nodemailer from 'nodemailer';
test('SMTP app-password validation and concurrent readiness coalescing',async()=>{
 const {mailTransport,validatePassword}=await import('./mail.mjs?coalescing');
 assert.equal(validatePassword('abcd efgh ijkl mnop'),'abcdefghijklmnop');assert.throws(()=>validatePassword('normal-password-is-not-an-app-password'),/MAIL_NOT_CONFIGURED/);
 const originalFetch=globalThis.fetch,originalTransport=nodemailer.createTransport;let reads=0,verifies=0;
 const transport={verify:async()=>{verifies++;}};
 try{globalThis.fetch=async()=>{reads++;return {ok:true,json:async()=>({payload:{data:Buffer.from('abcdefghijklmnop').toString('base64')}})}};nodemailer.createTransport=options=>{assert.equal(options.auth.user,'nightvisionservice2025@gmail.com');assert.equal(options.port,465);assert.equal(options.tls.rejectUnauthorized,true);return transport;};const app={options:{credential:{getAccessToken:async()=>({access_token:'synthetic-only'})}}};const all=await Promise.all(Array.from({length:30},()=>mailTransport(app)));assert.ok(all.every(x=>x===transport));assert.equal(reads,1);assert.equal(verifies,1);await mailTransport(app);assert.equal(reads,1);}finally{globalThis.fetch=originalFetch;nodemailer.createTransport=originalTransport;}
});
test('missing secret fails closed and backs off instead of repeatedly attempting SMTP',async()=>{
 const {mailTransport}=await import('./mail.mjs?failure');const originalFetch=globalThis.fetch;let reads=0;
 try{globalThis.fetch=async()=>{reads++;return {ok:false,status:404}};const app={options:{credential:{getAccessToken:async()=>({access_token:'synthetic-only'})}}};await assert.rejects(()=>mailTransport(app),/MAIL_NOT_CONFIGURED/);await assert.rejects(()=>mailTransport(app),/MAIL_NOT_CONFIGURED/);assert.equal(reads,1);}finally{globalThis.fetch=originalFetch;}
});
