export function getConfig(env=process.env){
 const raw=env.BASE_PATH || '';
 if(raw && !/^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\/?$/.test(raw))throw Error('BASE_PATH must be empty or a path such as /nvs-website');
 const basePath=raw.replace(/\/$/,'');
 const origin=new URL(env.SITE_URL || 'http://localhost:4180');
 if(!['http:','https:'].includes(origin.protocol)||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password)throw Error('SITE_URL must be an HTTP(S) origin without a path or credentials');
 const production=env.PRODUCTION==='true';
 if(production&&(!env.SITE_URL||origin.protocol!=='https:'||['localhost','127.0.0.1'].includes(origin.hostname)))throw Error('Production needs an approved HTTPS SITE_URL');
 return {basePath,origin:origin.origin,production,output:env.OUTPUT_DIR||'dist'};
}
