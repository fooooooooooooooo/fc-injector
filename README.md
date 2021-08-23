# FC2 Injector

injecty css :)

## Installation

1. Download the latest release for your OS from the releases tab ([here](https://github.com/fooooooooooooooo/fc-injector/releases/latest))
2. Run `fc-injector.exe` (just `fc-injector` on linux)
3. Go to the Settings tab
4. <kbd>Browse</kbd> for your fightcade folder (the one with `Fightcade2.exe` in it)
5. <kbd>Browse</kbd> for the folder you want to store your user.css in (usally the same as your fightcade folder)
6. Click <kbd>Save Config</kbd>
7. Go to the Home tab
8. Select the CSS editor and press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save
9. Open fightcade

**NOTE**
If your css doesn't apply, try restarting fightcade a couple times.

## CSS Editor

The included CSS editor is the same code editor that powers Visual Studio Code, just with a bit less functionality. It still supports autocompletion and syntax highlighting, as well as a command palette (opened with <kbd>F1</kbd>).

## Default CSS

The default CSS is the standard fightcade colors along with some documentation. Credit goes to `chloe !#0489`

```css
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
```
