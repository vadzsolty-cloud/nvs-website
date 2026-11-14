import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {emulatorConfig} from './guard.mjs';
import {processOutbox} from './outbox.mjs';
const app=initializeApp(emulatorConfig()),db=getFirestore(app);
for(const status of ['pending','retry'])for(const doc of (await db.collection('webMailOutbox').where('status','==',status).get()).docs)await processOutbox(db,doc.id);
await app.delete();
