import test from 'node:test';
import assert from 'node:assert/strict';
import {isWebsiteOriginAllowed} from '../backend/functions/website-origins.mjs';

test('booking API accepts the existing website and both HTTPS custom-domain hosts',()=>{
 for(const origin of ['https://vadzsolty-cloud.github.io','https://night-vision-service.eu','https://www.night-vision-service.eu'])assert.equal(isWebsiteOriginAllowed(origin),true,origin);
});

test('booking API rejects lookalike hosts, insecure origins, unexpected ports and opaque origins',()=>{
 for(const origin of ['http://night-vision-service.eu','https://night-vision-service.eu.evil.example','https://night-vision-service.eu@evil.example','https://other.night-vision-service.eu','https://night-vision-service.eu:8443','https://example.com','null'])assert.equal(isWebsiteOriginAllowed(origin),false,origin);
});

test('requests without an Origin header keep the existing authentication path',()=>{
 assert.equal(isWebsiteOriginAllowed(undefined),true);
});
