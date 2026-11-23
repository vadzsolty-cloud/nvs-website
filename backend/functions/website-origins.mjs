export const websiteOrigins=Object.freeze([
 'https://vadzsolty-cloud.github.io',
 'https://night-vision-service.eu',
 'https://www.night-vision-service.eu'
]);

export function isWebsiteOriginAllowed(origin){
 return !origin||websiteOrigins.includes(origin);
}
