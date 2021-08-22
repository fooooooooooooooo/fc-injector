// @ts-nocheck
/* eslint-disable */
require.config({ paths: { vs: '../../node_modules/monaco-editor/min/vs' } });
let saved = true;

const defaultCss = `
/* 
Colors can be formatted as either Hex values or HSL values or RGBA values,
#408080FF;
hsla(180, 85%, 37%, 1);
rgba(64, 128, 128, 1);
Will all give the same result, however conversions between Hex/HSLA/RGBA wont be 100% accurate
*/

/* If anything here is wrong, dm "chloe !#0489" on Discord about it */

#app.theme-default {
  /* Main background, Icons */
    --mainColor-darker:   #140812; /* Room hover borders */
    --mainColor-dark:     #260f23;
    --mainColor:          #351b30;
    --mainColor-light:    #5e3550; /* Icons, Dividers, Room info panels */
    --mainColor-lighter:  #854b71; /* Icon hover glow, Accept/Decline text */
    --mainColor-lightest: #d8bace; /* Lobby info text, # of players icon */
  
  /* Accent colors */
      --accentColor:  #33f1e5; /* FIGHTCADE text, Selected icon glow, Challange text */
      --accentColor2: #ff007a; /* Links, @'s in chat, Replays/Rankings/Events/Profile text */
  
  /* Text */
    --mainColor-lightest-trans-hi:    rgba(216,186,206,.7); /* Text, Lobby name */
    --mainColor-lightest-trans-md:    rgba(216,186,206,.5); /* Message times, Test Game text, Clear Filters text, Next/Previous Page text*/
  
  /* Glows, dividers */
    --mainColor-dark-trans-lo:    rgba(38,15,35,.3);  /* Panel dividing glow, Main glow on room join hover*/
    --mainColor-darker-trans-hi:  rgba(20,8,18,.7);   /* Secondary glow on room join hover*/
    --mainColor-darker-trans-lo:  rgba(20,8,18,.3);   /* Join room glow, Lobby chat box glow, Challange message box */
  }
`
require(['vs/editor/editor.main'], () => {
  monaco.editor.defineTheme('nord-theme', theme);

  const editor = monaco.editor.create(document.getElementById('container'), {
    value: defaultCss,
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
