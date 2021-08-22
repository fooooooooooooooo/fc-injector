// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  console.log('hey :)');
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector);
  //   if (element) element.innerText = text;
  // };

  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type]);
  // }
});
