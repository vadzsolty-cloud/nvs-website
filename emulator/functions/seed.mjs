import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {emulatorConfig} from './guard.mjs';
import {DEMO_SHOP,registryId} from './booking.mjs';
const app=initializeApp(emulatorConfig()),auth=getAuth(app),db=getFirestore(app);
async function user(uid,email){try{await auth.createUser({uid,email,password:'Nvs-demo-only-123!',emailVerified:true});}catch(e){if(e.code!=='auth/uid-already-exists'&&e.code!=='auth/email-already-exists')throw e;}}
await user('demo-customer','customer@example.invalid');await user(DEMO_SHOP,'shop@example.invalid');
await db.doc('shops/'+DEMO_SHOP).set({name:'Synthetic NVS workshop',status:'approved'});
await db.doc('cars/demo-car').set({id:'demo-car',ownerUid:'demo-customer',ownerId:'demo-owner',shopId:DEMO_SHOP,plate:'TEST-001',make:'Synthetic',model:'Fixture',owner:{name:'Synthetic customer',email:'customer@example.invalid'},createdAt:Date.now()});
await db.doc('vehicleRegistry/'+registryId('plate','TEST-001')).set({carId:'demo-car',ownerUid:'demo-customer',shopId:DEMO_SHOP,identityType:'plate'});
console.log('Synthetic fixture ready. Local-only login: customer@example.invalid / Nvs-demo-only-123!');
await app.delete();
