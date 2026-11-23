import {business} from './business.mjs';
import {pageId} from './facebook-posts.mjs';
export const facebookIcon='<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false"><path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.028 4.388 11.024 10.125 11.93v-8.437H7.078v-3.493h3.047V9.413c0-3.028 1.792-4.7 4.533-4.7 1.312 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.93-1.956 1.887v2.264h3.328l-.532 3.493h-2.796v8.437C19.612 23.097 24 18.101 24 12.073Z"/></svg>';
export function socialLink(l,{className='',href=`/${l}/facebook/`,label='Social media',external=false}={}){return `<a class="social-media-link ${className}" href="${href}"${external?' target="_blank" rel="noopener noreferrer"':''}>${facebookIcon}<span>${label}</span></a>`;}

const spotlightCopy={
 hu:{page:'NVS a Facebookon',pageDetail:'Hírek és videók',group:'NVS Facebook-csoport',groupDetail:'Csatlakozz a közösséghez'},
 ro:{page:'NVS pe Facebook',pageDetail:'Noutăți și videoclipuri',group:'Grupul NVS pe Facebook',groupDetail:'Alătură-te comunității'},
 en:{page:'NVS on Facebook',pageDetail:'News and videos',group:'NVS Facebook group',groupDetail:'Join our community'}
};
export function socialSpotlight(l){
 const t=spotlightCopy[l];
 const card=(href,title,detail,kind)=>`<a class="hero-social-link hero-social-${kind}" href="${href}" target="_blank" rel="noopener noreferrer">${facebookIcon}<span><strong>${title}</strong><small>${detail}</small></span><span class="hero-social-arrow" aria-hidden="true">↗</span></a>`;
 return `<div class="hero-social-links">${card('https://www.facebook.com/'+pageId,t.page,t.pageDetail,'page')}${business.facebookGroup?card(business.facebookGroup,t.group,t.groupDetail,'group'):''}</div>`;
}
