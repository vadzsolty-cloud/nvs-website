import {getConfig} from './config.mjs';
import {createPreviewServer} from './preview-server.mjs';
const config=getConfig(),port=Number(process.env.PORT||4180);
createPreviewServer(config).listen(port,'127.0.0.1',()=>console.log('Local preview: http://localhost:'+port+config.basePath+'/hu/'));
