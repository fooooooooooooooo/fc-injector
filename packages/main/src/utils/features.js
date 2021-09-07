/**
 * @typedef  {Object} Feature
 * @property {'append'|'replace'} type
 * @property {string} location
 * @property {string} feature
 */

/**
 * @type {Feature} {@link Feature}
 */
const fileProtocolFeature = {
  type: 'append',
  location: 'app.on(\'ready\', () => {',
  feature:
    'const{protocol:protocol}=require("electron");protocol.registerFileProtocol("file",(o,e)=>{const r=o.url.replace("file:///",""),t=decodeURI(r);try{return e(t)}catch(o){console.error("ERROR: registerLocalResourceProtocol: Could not get file path:",o)}});',
};

/**
 * @type {Feature} {@link Feature}
 */
const securityFeature = {
  type: 'replace',
  location: 'webSecurity: !options.insecure',
  feature: 'webSecurity: false',
};

/**
 * @type {Feature} {@link Feature}
 */
const devtoolsFeature = {
  type: 'append',
  location: 'function createTrayIcon(nativefierOptions, mainWindow) {',
  feature: 'mainWindow.openDevTools();',
};

const multiInstanceFeature = {
  type: 'replace',
  location:
    'const shouldQuit = appArgs.singleInstance && !electron_1.app.requestSingleInstanceLock();',
  feature: 'const shouldQuit = false;',
};

const transparencyFeature = {
  type: 'append',
  location: 'const DEFAULT_WINDOW_OPTIONS = {',
  feature: 'transparent:true,frame:false,',
};

const transparencyFixFeature = {
  type: 'replace',
  location: ', backgroundColor: options.backgroundColor',
  feature: '/* , backgroundColor: options.backgroundColor */', // get fucked lmao
};

export {
  fileProtocolFeature,
  securityFeature,
  devtoolsFeature,
  multiInstanceFeature,
  transparencyFeature,
  transparencyFixFeature,
};
