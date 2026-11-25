// Owner-supplied workshop photographs. Catalogue: media/photos.json; variants: scripts/optimize-photos.py.
// Owner-selected AI-labelled media and the requested brake illustration are explicitly disclosed (see docs/WORKSHOP-PHOTOS.md).
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const catalog=read('../media/photos.json'),variants=read('./photo-variants.json');
export const photos=Object.fromEntries(catalog.photos.map(p=>[p.slug,{...p,...variants[p.slug]}]));
export const placement=catalog.placement;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const assetStem=slug=>photos[slug].assetStem||slug;
const file=(slug,w,ext)=>`/assets/photos/${assetStem(slug)}-${w}.${ext}`;
const srcset=(p,ext)=>p.widths.map(w=>`${file(p.slug,w,ext)} ${w}w`).join(', ');
export const fullSize=slug=>{const p=photos[slug];return file(slug,p.widths.at(-1),'jpg');};
export const mediaDisclosure=(slug,l)=>{const kind=photos[slug]?.provenance?.kind;return kind==='ai-generated-illustration'?{hu:'AI által készített illusztráció',ro:'Ilustrație generată cu AI',en:'AI-generated illustration'}[l]:kind==='owner-supplied-ai-labelled'?{hu:'Beküldött kép · AI-jelöléssel',ro:'Imagine furnizată · etichetată AI',en:'Supplied image · AI-labelled'}[l]:'';};
export const alt=(slug,l)=>photos[slug].alt[l]+(mediaDisclosure(slug,l)?' · '+mediaDisclosure(slug,l):'');

/** Responsive <picture>: AVIF, WebP, JPEG fallback; intrinsic width/height prevent layout shift. */
export function picture(slug,l,{sizes='100vw',priority=false,className=''}={}){
 const p=photos[slug];if(!p)throw Error('Unknown photo '+slug);
 return `<picture class="photo ph-${slug} ${className}"><source type="image/avif" srcset="${srcset(p,'avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(p,'webp')}" sizes="${sizes}"><img src="${fullSize(slug)}" alt="${esc(alt(slug,l))}" width="${p.width}" height="${p.height}" ${priority?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async"></picture>`;
}
export function preloadHero(slug){
 const p=photos[slug];
 return `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(p,'avif')}" imagesizes="(min-width: 1001px) 55vw, 100vw" fetchpriority="high">`;
}
export const galleryCopy={
 hu:{open:'Kép nagyítása',dialog:'Képnézegető',close:'Bezárás',prev:'Előző kép',next:'Következő kép',of:'/',hint:'Kattints a képre a nagyításhoz. Nyilakkal, Esc-kel és mobilon lapozva is használható.',source:'Valódi NVS-műhelyfotó · tulajdonosi felvétel',workshopCaption:alt(placement.workshop,'hu'),servicePhoto:'Valódi fotó ebből a munkából',placeholder:'Ehhez a szolgáltatáshoz még nincs jóváhagyott, valódi műhelyfotó.',placeholderTitle:'Fotó hamarosan',categories:'Kalibrálás, fényszóró-beállítás és váltójavítás – saját munkáink fotói.'},
 ro:{open:'Mărește imaginea',dialog:'Vizualizator de imagini',close:'Închide',prev:'Imaginea anterioară',next:'Imaginea următoare',of:'/',hint:'Apasă pe o imagine pentru a o mări. Funcționează cu săgeți, Esc și prin glisare pe mobil.',source:'Fotografie reală din atelierul NVS · realizată de proprietar',workshopCaption:alt(placement.workshop,'ro'),servicePhoto:'Fotografie reală din această lucrare',placeholder:'Pentru acest serviciu nu există încă o fotografie reală aprobată din atelier.',placeholderTitle:'Fotografie în curând',categories:'Calibrare, reglarea farurilor și reparații de cutii de viteze – fotografii din lucrările noastre.'},
 en:{open:'Enlarge image',dialog:'Image viewer',close:'Close',prev:'Previous image',next:'Next image',of:'/',hint:'Select a photo to enlarge it. Works with arrow keys, Esc and swiping on mobile.',source:'Real NVS workshop photo · taken by the owner',workshopCaption:alt(placement.workshop,'en'),servicePhoto:'Real photo from this kind of work',placeholder:'There is no approved, real workshop photo for this service yet.',placeholderTitle:'Photo coming soon',categories:'Calibration, headlight aiming and gearbox repair – photos of our own work.'}
};
// Focus points live in a generated stylesheet (no inline styles, so a strict style-src 'self' CSP keeps working).
export const photoCss=()=>Object.values(photos).map(p=>`.ph-${p.slug} img{object-position:${p.position}${p.fit==='contain'?';object-fit:contain':''}}`).join('\n')+'\n';
