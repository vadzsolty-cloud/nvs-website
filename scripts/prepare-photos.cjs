// Manual review plan: {photos:[{source,photo}],placements:{...}}. Never re-approve untouched images.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),at=p=>path.join(root,p);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const planPath=process.argv[2];if(!planPath)throw Error('Usage: node scripts/prepare-photos.cjs <review-plan.json>');
 const plan=JSON.parse(fs.readFileSync(planPath,'utf8')),catalog=JSON.parse(fs.readFileSync(at('media/photos.json'),'utf8')),variants=JSON.parse(fs.readFileSync(at('src/photo-variants.json'),'utf8')),manifest=JSON.parse(fs.readFileSync(at('media/photo-privacy.json'),'utf8'));
 const {validatePhotoPrivacy}=await import('../src/photo-privacy.mjs');validatePhotoPrivacy();
 const known=new Set(catalog.photos.map(p=>p.slug)),originals=new Set(catalog.photos.map(p=>p.original)),pixelHashes=new Set();
 for(const p of catalog.photos)pixelHashes.add(hash(await sharp(at('media/originals/'+p.original)).rotate().removeAlpha().raw().toBuffer()));
 const added=[];
 for(const entry of plan.photos){
  const p=entry.photo;if(!p||known.has(p.slug)||originals.has(p.original))throw Error('Duplicate catalogue photo: '+p?.slug);
  if(!/^[a-z0-9-]+$/.test(p.slug)||path.basename(p.original)!==p.original)throw Error('Unsafe path');
  if(!p.privacy?.reviewedAt||!['masked','no-registration-visible'].includes(p.privacy.registration))throw Error('Manual review missing: '+p.slug);
  const bytes=fs.readFileSync(entry.source),meta=await sharp(bytes).metadata(),pixelHash=hash(await sharp(bytes).rotate().removeAlpha().raw().toBuffer());
  if(pixelHashes.has(pixelHash))throw Error('Duplicate image pixels: '+p.slug);pixelHashes.add(pixelHash);
  const regions=[...(p.privacy.regions||[]),...(p.redact||[])];
  if(p.privacy.registration==='masked'&&!p.privacy.regions?.length)throw Error('Plate bounds missing');
  for(const rect of regions)if(rect.length!==4||!rect.every(Number.isInteger)||rect[0]<0||rect[1]<0||rect[2]>meta.width||rect[3]>meta.height||rect[2]<=rect[0]||rect[3]<=rect[1])throw Error('Invalid rectangle: '+p.slug);
  let source=bytes;
  if(regions.length){
   p.assetStem=p.slug+'-private-v1';
   source=await sharp(bytes).rotate().composite(regions.map(([x,y,x2,y2])=>({input:{create:{width:x2-x,height:y2-y,channels:3,background:'#151a17'}},left:x,top:y}))).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toBuffer();
  }
  known.add(p.slug);originals.add(p.original);
  const stem=p.assetStem||p.slug;p.widths=meta.width<meta.height?[360,540,720]:[640,960,1280];if(meta.width<meta.height)p.fit='contain';
  fs.writeFileSync(at('media/originals/'+p.original),source);
  const record={sourceSha256:hash(source),files:{},reviewSha256:hash(JSON.stringify(p.privacy))};
  for(const w of p.widths){
   for(const ext of ['avif','webp']){
    const name=stem+'-'+w+'.'+ext,buf=await sharp(source).resize({width:w,withoutEnlargement:true})[ext]({quality:ext==='avif'?48:80,...(ext==='avif'?{effort:4}:{})}).toBuffer();
    fs.writeFileSync(at('public/assets/photos/'+name),buf);record.files[name]=hash(buf);added.push('public/assets/photos/'+name);
   }
  }
  const name=stem+'-'+p.widths.at(-1)+'.jpg',buf=await sharp(source).resize({width:p.widths.at(-1),withoutEnlargement:true}).jpeg({quality:88,chromaSubsampling:'4:4:4'}).toBuffer();
  fs.writeFileSync(at('public/assets/photos/'+name),buf);record.files[name]=hash(buf);added.push('public/assets/photos/'+name,'media/originals/'+p.original);
  manifest.photos[p.slug]=record;variants[p.slug]={original:p.original,width:meta.width,height:meta.height,widths:p.widths};catalog.photos.push(p);
  console.log('Prepared '+p.slug);
 }
 for(const [name,values] of Object.entries(plan.placements||{})){
  if(name.startsWith('serviceSlides.')){const id=name.slice(14);catalog.placement.serviceSlides[id]=[...new Set([...(catalog.placement.serviceSlides[id]||[]),...values])];}
  else catalog.placement[name]=[...new Set([...(catalog.placement[name]||[]),...values])];
 }
 catalog._note='Owner workshop photographs. Registration plates are manually reviewed and opaque masks are baked into source and responsive assets. See docs/WORKSHOP-PHOTOS.md.';
 fs.writeFileSync(at('media/photos.json'),JSON.stringify(catalog,null,1)+'\n');fs.writeFileSync(at('src/photo-variants.json'),JSON.stringify(variants,null,1)+'\n');fs.writeFileSync(at('media/photo-privacy.json'),JSON.stringify(manifest,null,1)+'\n');
 fs.writeFileSync(at('artifacts/new-photo-files.json'),JSON.stringify(added,null,2));console.log('Added '+plan.photos.length+' manually reviewed photographs.');
}
main().catch(e=>{console.error(e);process.exit(1)});
