/* eslint-disable */
// @ts-nocheck
console.log("foo'd!");
function reloadCss() {
  const cssLink = document.querySelector('#palmodded');

  const a = cssLink.getAttribute('href');

  cssLink.setAttribute('href', '');
  cssLink.setAttribute('href', a);
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init() {
  // TODO: find a better way to only add the elements after login page
  setTimeout(() => {
    const palmodded = document.createElement('link');
    palmodded.id = 'palmodded';
    palmodded.rel = 'stylesheet';
    palmodded.setAttribute('href', cssPath);
    document.body.append(palmodded);
  }, 5000);
}

document.addEventListener('keydown', (e) => {
  const evtobj = window.event ? event : e;
  if (evtobj.keyCode === 82 && evtobj.ctrlKey) {
    reloadCss();
  }
});
