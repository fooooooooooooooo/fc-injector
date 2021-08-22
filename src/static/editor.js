// @ts-nocheck
/* eslint-disable */
require.config({ paths: { vs: '../../node_modules/monaco-editor/min/vs' } });
let saved = true;
require(['vs/editor/editor.main'], () => {
  monaco.editor.defineTheme('nord-theme', theme);

  const editor = monaco.editor.create(document.getElementById('container'), {
    value: '/* css example or something */',
    language: 'css',
    theme: 'nord-theme',
    fontSize: 16,
    fontFamily: 'JetBrains Mono',
  });

  window.onresize = function () {
    editor.layout();
  };

  window.editor = editor;
});

function save() {
  var value = window.editor.getValue();

  window.parent.postMessage({ message: 'save-css', value: value }, '*');
  saved = true;
}

function getCss() {
  window.parent.postMessage({ message: 'get-css' }, '*');
}

function keyPress(e) {
  saved = false;
  var evtobj = window.event ? event : e;
  if (evtobj.keyCode == 83 && evtobj.ctrlKey) save();
}

function onMessage(e) {
  if (e.data.message === 'get-css_response') {
    if (window.editor === undefined) {
      return;
    }
    window.editor.setValue(e.data.value);
  }
}

document.addEventListener('keydown', keyPress);
window.addEventListener('message', onMessage, false);
window.parent.postMessage({});
getCss();
