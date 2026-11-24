import {playbackControls} from './facebook-playback.mjs';
import {rankedFacebookPosts,rankingCheckedAt} from './facebook-ranking.mjs';
import {socialSpotlight} from './social-link.mjs';
export const facebookPageCopy={
 hu:{title:'Social media',intro:'Tíz népszerű munkánk a Facebookról: futóműállítás, kalibrálás és szakszerű karbantartás.',featured:'Legnézettebb bejegyzés',selected:'Népszerű munkáink',page:'Találkozzunk a Facebookon is',pageIntro:'További munkáinkért és friss bejegyzéseinkért látogass el a teljes Facebook-oldalunkra.',full:'Látogass el az oldalunkra',open:'Bejegyzés megnyitása',back:'Vissza a referenciákhoz',link:'Social media',note:'Nézettség szerinti sorrend · Ellenőrizve:',views:'megtekintés'},
 ro:{title:'Social media',intro:'Zece lucrări apreciate pe Facebook: geometrie roți, calibrări și întreținere profesională.',featured:'Cea mai vizionată postare',selected:'Lucrările noastre populare',page:'Ne găsești și pe Facebook',pageIntro:'Vizitează pagina noastră completă de Facebook pentru alte lucrări și postări recente.',full:'Vizitează pagina noastră',open:'Deschide postarea',back:'Înapoi la referințe',link:'Social media',note:'În ordinea vizionărilor · Verificat:',views:'vizualizări'},
 en:{title:'Social media',intro:'Ten popular workshop projects from Facebook: wheel alignment, calibration and professional maintenance.',featured:'Most-viewed post',selected:'Popular workshop projects',page:'Find us on Facebook too',pageIntro:'Visit our full Facebook page for more workshop projects and recent posts.',full:'Visit our page',open:'Open the post',back:'Back to our work',link:'Social media',note:'Ordered by views · Checked:',views:'views'}
};
export const facebookViewLabel=(p,l)=>(p.approximate?'≈ ':'')+new Intl.NumberFormat({hu:'hu-HU',ro:'ro-RO',en:'en-GB'}[l]).format(p.views)+' '+facebookPageCopy[l].views;
export function facebookPage(l,{fbList}){
 const t=facebookPageCopy[l];
 const checked=new Intl.DateTimeFormat({hu:'hu-HU',ro:'ro-RO',en:'en-GB'}[l],{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(rankingCheckedAt+'T12:00:00Z'));
 return `<section class="section facebook-intro"><div class="social-page-tools"><a class="text-link social-back" href="/${l}/#references">${t.back}</a>${socialSpotlight(l)}</div><div class="social-page-heading"><div><p class="eyebrow">NVS / SOCIAL MEDIA</p><h1>${t.title}</h1><p class="lead">${t.intro}</p></div></div><p class="facebook-ranking-note">${t.note} ${checked}</p></section><section class="section facebook-selected" aria-labelledby="social-work-title"><p class="eyebrow">NIGHT VISION SERVICE</p><h2 id="social-work-title">${t.selected}</h2>${playbackControls(l)}${fbList(l,rankedFacebookPosts)}</section>`;
}
