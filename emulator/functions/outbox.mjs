// Emulator sink is transactional, deterministic and never invokes SMTP or an external provider.
// A production provider must support an idempotency key across send/ack crash boundaries.
export async function processOutbox(db,eventId,{now=Date.now,failDelivery=false}={}){
 if(!/^[A-Za-z0-9_-]{1,150}$/.test(eventId))throw new Error('INVALID_EVENT');
 const eventRef=db.doc('webMailOutbox/'+eventId),sink=db.doc('emulatedMail/'+eventId);
 return db.runTransaction(async tx=>{
  const [snap,delivered]=await Promise.all([tx.get(eventRef),tx.get(sink)]);
  if(!snap.exists)return 'missing';
  const event=snap.data();if(delivered.exists||event.status==='sent')return 'deduplicated';
  if(event.status==='dead'||event.nextAttemptAt>now())return 'deferred';
  const appointment=await tx.get(db.doc('appointments/'+event.appointmentId));
  if(!appointment.exists||appointment.data().source!=='web'||event.to!=='nightvisionservice2025@gmail.com')throw new Error('INVALID_EVENT');
  const attempts=event.attempts+1;
  if(failDelivery){tx.update(eventRef,{attempts,status:attempts>=5?'dead':'retry',nextAttemptAt:now()+Math.min(3600000,1000*2**attempts),lastError:'MAIL_SINK_TEMPORARY'});return 'retry';}
  const a=appointment.data();
  tx.create(sink,{eventId,to:event.to,subject:'NVS: appointment request pending',appointmentId:a.id,date:a.date,time:a.time,serviceId:a.serviceId,deliveredAt:now(),transport:'emulator-sink'});
  tx.update(eventRef,{status:'sent',attempts,sentAt:now()});return 'sent';
 });
}
