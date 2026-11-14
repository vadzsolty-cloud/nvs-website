import test from 'node:test';
import assert from 'node:assert/strict';
import {emulatorConfig,PROJECT} from '../emulator/functions/guard.mjs';
import {bucharestInstant} from '../emulator/functions/time.mjs';
import {identity,registryId} from '../emulator/functions/booking.mjs';
test('emulator guard fails closed for real projects, absent emulators and remote endpoints',()=>{
 const valid={GCLOUD_PROJECT:PROJECT,FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099'};
 assert.equal(emulatorConfig(valid).projectId,PROJECT);
 for(const patch of [{GCLOUD_PROJECT:'night-vision-service'},{FIREBASE_AUTH_EMULATOR_HOST:''},{FIRESTORE_EMULATOR_HOST:'firestore.googleapis.com:443'},{GOOGLE_CLOUD_PROJECT:'production'},{FIRESTORE_EMULATOR_HOST:'https://127.0.0.1:8080'}])assert.throws(()=>emulatorConfig({...valid,...patch}),/EMULATOR_ONLY/);
});
test('Bucharest conversion rejects nonexistent and ambiguous DST times',()=>{
 assert.equal(new Date(bucharestInstant('2026-12-01','09:00')).toISOString(),'2026-12-01T07:00:00.000Z');
 assert.equal(new Date(bucharestInstant('2027-07-01','09:00')).toISOString(),'2027-07-01T06:00:00.000Z');
 assert.throws(()=>bucharestInstant('2027-03-28','03:30'),/NONEXISTENT_TIME/);
 assert.throws(()=>bucharestInstant('2027-10-31','03:30'),/AMBIGUOUS_TIME/);
 for(const pair of [['2027-02-30','12:00'],['2027-01-01','24:00'],['2027-01-01','12:70'],['bad','12:00']])assert.throws(()=>bucharestInstant(...pair),/INVALID_TIME/);
});
test('vehicle registry normalization and SHA-256 match the existing app algorithm',()=>{
 assert.equal(identity(' hr-12 ábc '),'HR12ABC');
 assert.equal(registryId('plate','HR 12 ABC'),registryId('plate','hr-12-abc'));
 assert.match(registryId('plate','HR12ABC'),/^plate_[a-f0-9]{64}$/);
 assert.notEqual(registryId('plate','HR12ABC'),registryId('vin','HR12ABC'));
});
