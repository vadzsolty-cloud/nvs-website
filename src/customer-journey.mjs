import {business} from './business.mjs';
import {uiIcon} from './icons.mjs';
export const journeyCopy={
 hu:{book:'Időpontkérés',call:'Hívj minket',title:'Egyeztessünk az autódról',text:'Mondd el az autó típusát és a tapasztalt hibát. Telefonon is segítünk kiválasztani a megfelelő szolgáltatást.',note:'A kért időpontot a műhely igazolja vissza.',app:'NVS alkalmazás'},
 ro:{book:'Solicită o programare',call:'Sună-ne',title:'Discutăm despre mașina ta',text:'Spune-ne modelul mașinii și problema observată. Te ajutăm și telefonic să alegi serviciul potrivit.',note:'Atelierul confirmă data și ora solicitate.',app:'Aplicația NVS'},
 en:{book:'Request an appointment',call:'Call us',title:'Tell us about your car',text:'Tell us your vehicle model and the problem you have noticed. We can also help you choose the right service by phone.',note:'The workshop confirms your requested appointment.',app:'The NVS app'}
};
export function serviceActions(l,{compact=false}={}){const t=journeyCopy[l];return '<div class="service-actions'+(compact?' service-actions--compact':'')+'"><a class="button primary" href="/'+l+'/account/">'+uiIcon('calendar')+t.book+'</a><a class="button" href="'+business.phoneHref+'">'+uiIcon('phone')+t.call+'</a></div>';}
export function serviceNext(l){const t=journeyCopy[l];return '<section class="section service-next" aria-labelledby="service-next-title"><div><p class="eyebrow">NIGHT VISION SERVICE</p><h2 id="service-next-title">'+t.title+'</h2><p>'+t.text+'</p></div><div>'+serviceActions(l)+'<p class="service-next-note">'+t.note+'</p></div></section>';}
