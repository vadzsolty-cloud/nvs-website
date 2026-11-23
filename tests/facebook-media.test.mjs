import test from 'node:test';
import assert from 'node:assert/strict';
import {facebookMediaManifest,checkFacebookMedia,facebookPreviewFor,facebookPreview} from '../src/facebook-media.mjs';
import {rankedFacebookPosts} from '../src/facebook-ranking.mjs';

test('Facebook images are visually reviewed frames tied to the exact linked source, with intact bytes',()=>{
 assert.deepEqual(checkFacebookMedia(),{frames:9,posts:11});
 assert.equal(rankedFacebookPosts.filter(p=>facebookPreviewFor(p)).length,9);
 const first=rankedFacebookPosts[0];assert.equal(first.id,'1604059460661087');assert.match(first.title.hu,/Audi/);
 assert.equal(facebookPreviewFor(first).sourceUrl,first.url);
 for(const p of rankedFacebookPosts){assert.equal('cover' in p,false);const frame=facebookPreviewFor(p);if(frame){assert.equal(frame.videoId,p.id);assert.equal(frame.sourceUrl,p.url);assert.equal(frame.review.realWorkFrame,true);}}
 assert.equal(facebookPreviewFor(rankedFacebookPosts.find(p=>p.id==='979880138186155')),null);
});

test('unverified or mismatched posts never fall back to a different workshop photograph',()=>{
 const unknown={id:'1234567',url:'https://www.facebook.com/reel/1234567/',cover:'hunter-byd-front-overview',video:true,title:{hu:'Eredeti munka'}};
 const preview=facebookPreview('hu',unknown);assert.ok(!preview.html.includes('<img'));assert.ok(!preview.html.includes('hunter-byd'));assert.ok(preview.html.includes('fb-source-placeholder'));
 const wrong={...rankedFacebookPosts[0],url:rankedFacebookPosts[1].url};assert.equal(facebookPreviewFor(wrong),null);assert.ok(!facebookPreview('hu',wrong).html.includes('<img'));
 const verifiedAlias={id:'122133267458736307'};assert.equal(facebookPreviewFor(verifiedAlias).videoId,'1697012922028515');
 assert.equal(facebookPreviewFor({id:'122121619784736307'}),null,'An unverified alias cannot borrow a photo from a similar Tesla job');
});

test('Facebook source guard rejects reassigned frames, changed images and unreviewed assets',()=>{
 const manifest=structuredClone(facebookMediaManifest),id=Object.keys(manifest.frames)[0];manifest.frames[id].sourceUrl=rankedFacebookPosts[1].url;
 assert.throws(()=>checkFacebookMedia({manifest}),/source does not match/);
 assert.throws(()=>checkFacebookMedia({readAsset:()=>Buffer.from('substituted photograph')}),/image changed/);
 assert.throws(()=>checkFacebookMedia({listAssets:()=>['unreviewed-workshop-photo.jpg']}),/unreviewed image/);
});
