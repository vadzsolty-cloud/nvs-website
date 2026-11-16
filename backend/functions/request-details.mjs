export const SERVICE_NAMES={acc:'ACC-radarkalibrálás',adas:'ADAS-kalibrálás','hunter-3d':'Hunter 3D futóműállítás',camera:'Kamerakalibrálás','led-matrix':'LED / Matrix fényszórók',diagnostics:'Autódiagnosztika',other:'Egyéb szervizmunka'};
export const VEHICLE_FIELDS=[
 ['plate','Rendszám'],['make','Márka'],['model','Modell'],['year','Évjárat'],['vin','Alvázszám (VIN)'],['mileage','Kilométeróra (km)'],
 ['fuelType','Üzemanyag / hajtás'],['engineCapacity','Hengerűrtartalom (cm³)'],['powerKw','Teljesítmény (kW)'],['transmission','Sebességváltó'],['engineCode','Motorkód'],['bodyType','Karosszéria típusa'],['color','Szín'],['seats','Ülőhelyek száma'],['maxMass','Megengedett össztömeg (kg)'],
 ['civSeries','CIV-sorozat'],['civNumber','CIV-szám'],['plateCountryCode','Rendszám országa'],['itpDate','Műszaki vizsga érvényessége'],['insuranceDate','Biztosítás érvényessége'],['revisionDate','Rögzített következő szerviz'],['ownerName','Járműhöz rögzített tulajdonos'],['phone','Járműhöz rögzített telefonszám']
];
export const singleLine=(value,max=160)=>typeof value==='number'&&Number.isFinite(value)?String(value):typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max):'';
export const vehicleDetails=car=>Object.fromEntries(VEHICLE_FIELDS.map(([key])=>[key,singleLine(car[key])]));
export function savedContact(profile={},user={}){return {name:singleLine(profile.contactName||profile.name||user.name,120),phone:singleLine(profile.phone||user.phone,40)};}
export function contactDetails(input,profile,user){
 if(input.contactName!==undefined&&typeof input.contactName!=='string'||input.contactPhone!==undefined&&typeof input.contactPhone!=='string')throw Error('CONTACT_REQUIRED');
 const fallback=savedContact(profile,user),name=typeof input.contactName==='string'?input.contactName.trim():fallback.name,phone=typeof input.contactPhone==='string'?input.contactPhone.trim():fallback.phone;
 if(!name||name.length>120||/[\u0000-\u001f\u007f]/.test(name)||!/^\+?[0-9() .-]+$/.test(phone)||phone.length>40||phone.replace(/\D/g,'').length<7||phone.replace(/\D/g,'').length>15)throw Error('CONTACT_REQUIRED');
 return {name:singleLine(name,120),phone:singleLine(phone,40),email:singleLine(user.email,254)};
}
export function notificationDetails(car,contact,profile={}){
 return {contact:{name:singleLine(contact.name,120),phone:singleLine(contact.phone,40),email:singleLine(contact.email,254)},vehicle:vehicleDetails(car),accountName:singleLine(profile.name,120),companyName:singleLine(profile.companyName||profile.company?.name,160)};
}

