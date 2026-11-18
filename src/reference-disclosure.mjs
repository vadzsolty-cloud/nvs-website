import {uiIcon} from './icons.mjs';
export const referencePreview={posts:3,photos:6};
export const referenceCopy={
 hu:{posts:'További referenciák',photos:'Összes fotó megtekintése',lessPosts:'Kevesebb referencia',lessPhotos:'Kevesebb fotó'},
 ro:{posts:'Mai multe lucrări',photos:'Vezi toate fotografiile',lessPosts:'Mai puține lucrări',lessPhotos:'Mai puține fotografii'},
 en:{posts:'More workshop projects',photos:'View all photos',lessPosts:'Fewer projects',lessPhotos:'Fewer photos'}
};
// Native details keeps every reference in readable HTML and works without JavaScript.
export function referenceDisclosure(lang,kind,count,body){
 if(count<=0)return '';
 const t=referenceCopy[lang],less=kind==='posts'?t.lessPosts:t.lessPhotos;
 return `<details class="reference-disclosure" data-reference-more="${kind}"><summary><span class="disclosure-more">${t[kind]} <span class="disclosure-count">(+${count})</span></span><span class="disclosure-less">${less}</span><span class="disclosure-symbol" aria-hidden="true"><span class="disclosure-expand">${uiIcon('plus')}</span><span class="disclosure-collapse">${uiIcon('minus')}</span></span></summary>${body}</details>`;
}
