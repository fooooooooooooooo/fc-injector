const { ipcRenderer } = require('electron');

const homeTab = document.querySelector('#home-tab');
const settingsTab = document.querySelector('#settings-tab');

const homeSection = document.querySelector('#home');
const settingsSection = document.querySelector('#settings');

const fcBrowse = document.querySelector('#fc-location-browse');
const cssBrowse = document.querySelector('#css-location-browse');
const injectButton = document.querySelector('#inject-button');
const uninjectButton = document.querySelector('#uninject-button');
const saveConfigButton = document.querySelector('#save-config-button');

const enableDevtools = document.querySelector('#enable-devtools');

const fcLocationField = document.querySelector('#fc-location-field');
const cssLocationField = document.querySelector('#css-location-field');

const statusText = document.querySelector('#status');

const config = {
  fightcadePath: '',
  cssPath: '',
  enableDevtools: false,
};

let css = '';

let iframeSource;

// Navigation
function goHome() {
  settingsTab.classList.remove('is-active');
  settingsSection.setAttribute('hidden', 'true');

  homeTab.classList.add('is-active');
  homeSection.removeAttribute('hidden');
}

function goSettings() {
  homeTab.classList.remove('is-active');
  homeSection.setAttribute('hidden', 'true');

  settingsTab.classList.add('is-active');
  settingsSection.removeAttribute('hidden');
}

// Update UI
/**
 * @param {string} path
 */
function updateFcPath(path) {
  config.fightcadePath = path;
  // @ts-ignore
  fcLocationField.value = path;
}

/**
 * @param {string} path
 */
function updateCssPath(path) {
  config.cssPath = path;
  // @ts-ignore
  cssLocationField.value = path;
}

/**
 * @param {boolean} status
 */
function updateInjectedStatus(status) {
  if (status) {
    injectButton.setAttribute('hidden', 'true');
    uninjectButton.removeAttribute('hidden');
    statusText.textContent = 'Injected';
    statusText.classList.add('has-text-success');
    statusText.classList.remove('has-text-danger');
    return;
  }

  uninjectButton.setAttribute('hidden', 'true');
  injectButton.removeAttribute('hidden');
  statusText.textContent = 'Not injected';
  statusText.classList.remove('has-text-success');
  statusText.classList.add('has-text-danger');
}

/**
 * @param {string} cssData
 */
function updateCss(cssData) {
  css = cssData;
  // eslint-disable-next-line no-use-before-define
  sendCssToIFrame();
}

// Sending IPC
function browseFcDirectory() {
  ipcRenderer.send('browse-fc-directory', null);
}

function browseCssDirectory() {
  ipcRenderer.send('browse-css-directory', null);
}

function inject() {
  statusText.textContent = 'Not injected, injecting...';
  ipcRenderer.send('inject', null);
}

function uninject() {
  statusText.textContent = 'Injected, ejaculating...';
  ipcRenderer.send('uninject', null);
}

function checkInjected() {
  ipcRenderer.send('check-injected', null);
}

/**
 * @param {MessageEvent<any>} event
 */
function saveCss(event) {
  // @ts-ignore
  ipcRenderer.send('save-css', event.data.value);
}

function saveConfig() {
  ipcRenderer.send('save-config', config);
}

function getCss() {
  ipcRenderer.send('get-css', null);
}

function getConfig() {
  ipcRenderer.send('get-config', null);
}

function sendCssToIFrame() {
  if (iframeSource === undefined) {
    setTimeout(() => {
      sendCssToIFrame();
    }, 300);
    return;
  }
  iframeSource.postMessage({ message: 'get-css_response', value: css });
}

function toggleDevtools() {
  // @ts-ignore
  config.enableDevtools = enableDevtools.value === 'on';
}
/**
 * @param {MessageEvent<any>} event
 */
function saveSource(event) {
  iframeSource = event.source;
}

// Events
function addListeners() {
  // Clicks
  homeTab.addEventListener('click', goHome);
  settingsTab.addEventListener('click', goSettings);

  fcBrowse.addEventListener('click', browseFcDirectory);
  cssBrowse.addEventListener('click', browseCssDirectory);
  enableDevtools.addEventListener('change', toggleDevtools);

  injectButton.addEventListener('click', inject);
  uninjectButton.addEventListener('click', uninject);
  saveConfigButton.addEventListener('click', saveConfig);

  fcLocationField.addEventListener('input', () => {
    // @ts-ignore
    config.fightcadePath = fcLocationField.value;
  });

  cssLocationField.addEventListener('input', () => {
    // @ts-ignore
    config.cssPath = fcLocationField.value;
  });

  // IFrame Message
  window.addEventListener(
    'message',
    (event) => {
      switch (event.data.message) {
        case 'save-css':
          saveCss(event);
          break;
        case 'get-css':
          sendCssToIFrame();
          break;
        default:
          saveSource(event);
          break;
      }
    },
    false,
  );

  // IPC Messages
  ipcRenderer.on('browse-fc-directory_response', (event, data) => {
    updateFcPath(data);
  });

  ipcRenderer.on('browse-css-directory_response', (event, data) => {
    updateCssPath(data);
  });

  ipcRenderer.on('check-injected_response', (event, data) => {
    updateInjectedStatus(data);
  });

  ipcRenderer.on('injector-error', (event, data) => {
    console.error(data);
  });

  ipcRenderer.on('get-config_response', (event, data) => {
    updateFcPath(data.fightcadePath);
    updateCssPath(data.cssPath);
  });

  ipcRenderer.on('get-css_response', (event, data) => {
    updateCss(data);
  });
}

addListeners();

setInterval(() => {
  checkInjected();
}, 5000);

getConfig();
checkInjected();
getCss();
