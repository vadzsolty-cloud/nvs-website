const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
export function bucharestInstant(date,time){
 if(typeof date!=='string'||typeof time!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))throw new Error('INVALID_TIME');
 const [y,m,d]=date.split('-').map(Number),[h,min]=time.split(':').map(Number);
 const naive=Date.UTC(y,m-1,d,h,min);
 if(new Date(naive).toISOString().slice(0,16)!==date+'T'+time)throw new Error('INVALID_TIME');
 const matches=[];
 for(const offset of [120,180]){
  const instant=naive-offset*60000;
  const parts=Object.fromEntries(formatter.formatToParts(instant).map(p=>[p.type,p.value]));
  if(`${parts.year}-${parts.month}-${parts.day}`===date&&`${parts.hour}:${parts.minute}`===time)matches.push(instant);
 }
 if(matches.length!==1)throw new Error(matches.length?'AMBIGUOUS_TIME':'NONEXISTENT_TIME');
 return matches[0];
}
