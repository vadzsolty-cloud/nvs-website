import {readFileSync} from 'node:fs';
export const embedAvailability=JSON.parse(readFileSync(new URL('../media/facebook-embed-availability.json',import.meta.url),'utf8'));
for(const[id,entry]of Object.entries(embedAvailability.entries)){if(!/^\d+$/.test(id)||entry.sourceUrl!=='https://www.facebook.com/reel/'+id+'/'||!['available','restricted'].includes(entry.status)||!/^\d{4}-\d{2}-\d{2}$/.test(entry.checkedAt))throw Error('Unverified Facebook embed availability '+id);}
export const facebookEmbeddable=post=>embedAvailability.entries[post.id]?.sourceUrl===post.url&&embedAvailability.entries[post.id]?.status==='available';
export const playbackCopy={
 hu:{enable:'Videók engedélyezése',play:'Előnézetek indítása',pause:'Előnézetek szüneteltetése',one:'Videó lejátszása',stop:'Videó szüneteltetése',intro:'Videóelőnézetek hang nélkül, egymás után. A teljes videót a Facebookon nézheted meg.',permission:'A lejátszáshoz engedélyezd a Facebook-tartalmakat.',error:'A lejátszó most nem érhető el. A bejegyzéseket továbbra is megnyithatod a Facebookon.'},
 ro:{enable:'Permite videoclipurile',play:'Pornește previzualizările',pause:'Pauză previzualizări',one:'Redă videoclipul',stop:'Pauză videoclip',intro:'Previzualizări video fără sunet, pe rând. Videoclipul complet este disponibil pe Facebook.',permission:'Pentru redare, permite conținutul Facebook.',error:'Playerul nu este disponibil acum. Poți deschide în continuare postările pe Facebook.'},
 en:{enable:'Allow videos',play:'Start previews',pause:'Pause previews',one:'Play video',stop:'Pause video',intro:'Silent video previews, one at a time. Watch the full video on Facebook.',permission:'Allow Facebook content to play the videos.',error:'The player is unavailable right now. You can still open the posts on Facebook.'}
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function playbackControls(l){const t=playbackCopy[l];return `<div class="fb-playback-controls" hidden data-fb-copy="${esc(JSON.stringify(t))}"><p>${t.intro}</p><button class="button" type="button" data-fb-toggle>${t.enable}</button><p class="fb-playback-status" role="status"></p></div>`;}
