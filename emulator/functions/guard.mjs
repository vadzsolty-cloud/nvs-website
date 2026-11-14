export const PROJECT='demo-nvs-website';
export function emulatorConfig(env=process.env){
 const local=host=>/^(127\.0\.0\.1|localhost):[1-9]\d{1,4}$/.test(host||'');
 if((env.GCLOUD_PROJECT||env.GOOGLE_CLOUD_PROJECT)!==PROJECT||
    (env.GOOGLE_CLOUD_PROJECT&&env.GOOGLE_CLOUD_PROJECT!==PROJECT)||
    !local(env.FIRESTORE_EMULATOR_HOST)||!local(env.FIREBASE_AUTH_EMULATOR_HOST)){
  throw new Error('EMULATOR_ONLY: exact demo project and local Auth/Firestore endpoints required');
 }
 return {projectId:PROJECT};
}
