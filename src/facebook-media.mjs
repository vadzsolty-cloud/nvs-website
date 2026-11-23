import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
export const facebookMediaManifest=JSON.parse(readFileSync(new URL('media/facebook-frame-provenance.json',root),'utf8'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function checkFacebookMedia({manifest=facebookMediaManifest,readAsset=file=>readFileSync(new URL('public/assets/facebook-frames/'+file,root)),listAssets=()=>readdirSync(new URL('public/assets/facebook-frames/',root))}={}){
 if(manifest.version!==1)throw Error('Facebook preview: invalid provenance manifest');
 const files=new Set(),postIds=new Set();
 for(const[id,frame]of Object.entries(manifest.frames)){
  if(!/^\d+$/.test(id)||frame.sourceUrl!=='https://www.facebook.com/reel/'+id+'/')throw Error('Facebook preview: source does not match video '+id);
  if(frame.file!==id+'-'+frame.sha256.slice(0,8)+'.jpg'||frame.publishedBy!=='Night Vision Service SRL'||!frame.review?.realWorkFrame||frame.review.privacy!=='no-readable-registration'||!/^\d{4}-\d{2}-\d{2}$/.test(frame.review.reviewedAt))throw Error('Facebook preview: manual source and image review missing '+id);
  if(frame.width<100||frame.height<100||frame.frameTime<=0||!/^center(?: \d{1,2}%)?$/.test(frame.position))throw Error('Facebook preview: invalid frame dimensions or position '+id);
  if(digest(readAsset(frame.file))!==frame.sha256)throw Error('Facebook preview: image changed after source review '+id);
  files.add(frame.file);
  for(const post of [id,...frame.originalPostIds]){if(!/^\d+$/.test(post)||postIds.has(post))throw Error('Facebook preview: ambiguous post mapping '+post);postIds.add(post);}
 }
 for(const file of listAssets())if(!files.has(file))throw Error('Facebook preview: unreviewed image '+file);
 return {frames:files.size,posts:postIds.size};
}
export function facebookPreviewFor(post){
 const match=Object.entries(facebookMediaManifest.frames).find(([id,f])=>id===post.id||f.originalPostIds.includes(post.id));
 if(!match)return null;
 const[id,frame]=match,expected=id===post.id?frame.sourceUrl:`https://www.facebook.com/61572089218581/posts/${post.id}`;
 if((post.url||`https://www.facebook.com/61572089218581/posts/${post.id}`)!==expected)return null;
 return {videoId:id,src:'/assets/facebook-frames/'+frame.file,...frame};
}
const text={hu:{frame:'Képkocka az eredeti videóból.',video:'Videó a Facebookon',post:'Bejegyzés a Facebookon',original:'Teljes bejegyzés a Facebookon.'},ro:{frame:'Cadru din videoclipul original.',video:'Video pe Facebook',post:'Postare pe Facebook',original:'Postarea completă pe Facebook.'},en:{frame:'Frame from the original video.',video:'Video on Facebook',post:'Post on Facebook',original:'Full post on Facebook.'}};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function facebookPreview(l,post){
 const frame=facebookPreviewFor(post),t=text[l];
 return {html:frame?`<div class="fb-cover"><img class="fb-source-image fb-frame-${frame.position.split(' ')[1]?.replace('%','')||'50'}" src="${frame.src}" alt="${esc(post.title[l]+' – '+t.frame)}" width="${frame.width}" height="${frame.height}" loading="lazy" decoding="async" data-source-video="${frame.videoId}"></div>`:`<div class="fb-cover"><span class="fb-source-placeholder"><svg viewBox="0 0 24 24" width="42" height="42" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor"/></svg><span>${post.video?t.video:t.post}</span></span></div>`,note:frame?t.frame:t.original};
}
