import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,existsSync,realpathSync,unlinkSync,lstatSync} from 'node:fs';
import {resolve,dirname,relative,sep,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {photos} from './photos.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export const reviewHash=photo=>sha256(JSON.stringify(photo.privacy));
const fail=(slug,message)=>{throw new Error('Photo privacy: '+slug+': '+message);};

// The review is manual; fingerprints prevent a changed image bypassing that review.
export function checkPhotoPrivacy({photos:items,manifest,readSource,readAsset,listAssets}){
 const entries=Array.isArray(items)?items:Object.values(items),allowed=new Set();
 if(manifest.version!==1)fail('manifest','unsupported version');
 if(Object.keys(manifest.photos||{}).length!==entries.length)fail('manifest','catalogue does not match reviewed photographs');
 for(const p of entries){
  const r=p.privacy,record=manifest.photos[p.slug],stem=p.assetStem||p.slug;
  if(!r||!/^\d{4}-\d{2}-\d{2}$/.test(r.reviewedAt||'')||!['masked','no-registration-visible'].includes(r.registration))fail(p.slug,'manual registration-plate review required');
  if(!/^[a-z0-9-]+$/.test(stem)||basename(p.original)!==p.original)fail(p.slug,'unsafe photograph path');
  if(r.registration==='masked'){
   if(!p.assetStem||p.assetStem===p.slug||!r.regions?.length)fail(p.slug,'masked photos need regions and a new asset name');
   for(const rect of r.regions)if(rect.length!==4||!rect.every(Number.isInteger)||rect[0]<0||rect[1]<0||rect[2]>p.width||rect[3]>p.height||rect[2]<=rect[0]||rect[3]<=rect[1])fail(p.slug,'invalid mask bounds');
  }
  if(!record||record.reviewSha256!==reviewHash(p))fail(p.slug,'review changed or is missing; prepare and review the photograph again');
  if(sha256(readSource(p.original))!==record.sourceSha256)fail(p.slug,'source changed since review');
  const files=record.files||{};
  for(const w of p.widths)for(const ext of ['avif','webp'])if(!files[stem+'-'+w+'.'+ext])fail(p.slug,'missing reviewed responsive variant');
  if(!files[stem+'-'+p.widths.at(-1)+'.jpg'])fail(p.slug,'missing reviewed enlargement/JPEG');
  for(const [name,hash] of Object.entries(files)){
   const m=name.match(/^(.+)-(\d+)\.(avif|webp|jpg)$/);
   if(!m||m[1]!==stem||!p.widths.includes(Number(m[2]))||allowed.has(name))fail(p.slug,'unexpected variant '+name);
   if(sha256(readAsset(name))!==hash)fail(p.slug,'variant changed since review: '+name);
   allowed.add(name);
  }
 }
 for(const name of listAssets())if(!allowed.has(name))fail('assets','unreviewed file '+name);
 return {photos:entries.length,masked:entries.filter(p=>p.privacy.registration==='masked').length,files:allowed.size};
}
export function validatePhotoPrivacy(){
 const manifest=JSON.parse(readFileSync(resolve(root,'media/photo-privacy.json'),'utf8'));
 return checkPhotoPrivacy({photos,manifest,readSource:name=>readFileSync(resolve(root,'media/originals',name)),readAsset:name=>readFileSync(resolve(root,'public/assets/photos',name)),listAssets:()=>readdirSync(resolve(root,'public/assets/photos'),{withFileTypes:true}).map(e=>{if(!e.isFile()||e.isSymbolicLink())fail('assets','unexpected entry '+e.name);return e.name;})});
}
// Remove only stale regular files inside this checkout's generated photo directory.
export function pruneUnreviewedOutputPhotos(output){
 const folder=resolve(output,'assets/photos');if(!existsSync(folder))return;
 const manifest=JSON.parse(readFileSync(resolve(root,'media/photo-privacy.json'),'utf8')),allowed=new Set(Object.values(manifest.photos).flatMap(p=>Object.keys(p.files)));
 const actualRoot=realpathSync(root),actualFolder=realpathSync(folder),rel=relative(actualRoot,actualFolder);
 for(const entry of readdirSync(folder,{withFileTypes:true})){
  if(allowed.has(entry.name))continue;
  if(!rel||rel.startsWith('..'+sep)||rel==='..'||!entry.isFile()||entry.isSymbolicLink())fail('output','refusing to remove an unexpected entry outside the generated checkout');
  const target=resolve(folder,entry.name);if(dirname(target)!==folder||lstatSync(target).isSymbolicLink())fail('output','unsafe stale file');
  unlinkSync(target);
 }
}
