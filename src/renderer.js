const { ipcRenderer } = require('electron');

const homeTab = document.querySelector('#home-tab');
const settingsTab = document.querySelector('#settings-tab');

const homeSection = document.querySelector('#home');
const settingsSection = document.querySelector('#settings');

const fcBrowse = document.querySelector('#fc-location-browse');
const cssBrowse = document.querySelector('#css-location-browse');

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

function updateFcPath(path) {
  console.log(path);
}
function updateCssPath(path) {
  console.log(path);
}

function browseFcDirectory() {
  console.log('sending browse-fc-directory');
  ipcRenderer.send('browse-fc-directory', null);
}

function browseCssDirectory() {
  ipcRenderer.send('browse-css-directory', null);
}

function addListeners() {
  homeTab.addEventListener('click', goHome);
  settingsTab.addEventListener('click', goSettings);

  fcBrowse.addEventListener('click', browseFcDirectory);
  cssBrowse.addEventListener('click', browseCssDirectory);

  ipcRenderer.on('browse-fc-directory_response', (event, data) => {
    updateFcPath(data);
  });

  ipcRenderer.on('browse-css-directory_response', (event, data) => {
    updateCssPath(data);
  });
}

addListeners();
