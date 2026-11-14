const form=document.querySelector('#booking-form');
if(form){
 const date=document.querySelector('#date'),result=document.querySelector('#result');
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 date.min=today();
 date.addEventListener('input',()=>date.setCustomValidity(''));
 form.addEventListener('submit',event=>{
  event.preventDefault();date.min=today();
  if(date.value<date.min){date.setCustomValidity(document.body.dataset.invalidDate);date.reportValidity();return;}
  if(!form.reportValidity())return;
  const service=document.querySelector('#service');
  document.querySelector('#selection').textContent=`${service.selectedOptions[0].textContent} · ${date.value} · ${document.querySelector('#time').value}`;
  form.hidden=true;result.hidden=false;document.querySelector('.step').firstChild.textContent='02 / 02 ';result.focus();
 });
 document.querySelector('#reset').addEventListener('click',()=>{form.reset();form.hidden=false;result.hidden=true;document.querySelector('#selection').textContent='';document.querySelector('.step').firstChild.textContent='01 / 02 ';document.querySelector('#service').focus();});
}
