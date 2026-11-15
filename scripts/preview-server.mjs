import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.avif':'image/avif','.webp':'image/webp'};
export function createPreviewServer({output='dist',basePath='',emulatorUi=false}={}){
 const root=resolve(output);
 return http.createServer(async(req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(basePath&&pathname===basePath){res.writeHead(308,{Location:basePath+'/'}).end();return;}
   if(basePath&&!pathname.startsWith(basePath+'/')){res.writeHead(404).end();return;}
   const local=basePath?pathname.slice(basePath.length):pathname;
   let file=resolve(root,'.'+local);
   if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403).end();return;}
   const info=await stat(file);
   if(info.isDirectory()){
    if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'}).end();return;}
    file=resolve(file,'index.html');
   }
   const body=await readFile(file);
   const connections=emulatorUi&&/^\/(hu|ro|en)\/lab\//.test(local)?"'self' http://127.0.0.1:9099 http://127.0.0.1:5001":"'none'";
   res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; frame-src https://maps.google.com https://www.google.com; connect-src ${connections}; form-action 'none'; frame-ancestors 'none'; base-uri 'none'`});res.end(body);
  }catch{
   res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
   try{res.end(await readFile(resolve(root,'404.html')));}catch{res.end('404');}
  }
 });
}
