const { app, Tray, clipboard, Menu } = require('electron');
const path = require('path');

let tray = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'tidal.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Exit', click: () => app.quit() }
  ]);
  tray.setContextMenu(contextMenu);
  
  setInterval(() => {
    const clipboardText = clipboard.readText();
    if (clipboardText && clipboardText.startsWith('https://tidal.com/')) {
      const args = clipboardText.split('/');
      if (!args[4]) return;
      if (!args[5]) return;

      switch (args[4]) {
        case "track": {
          clipboard.writeText("https://tidal.jnwh.tech/track/" + args[5]);
          break;
        }

        case "artist": {
          clipboard.writeText("https://tidal.jnwh.tech/artist/" + args[5]);
          break;
        }

        case "album": {
          clipboard.writeText("https://tidal.jnwh.tech/album/" + args[5]);
          break;
        }

        case "video": {
          clipboard.writeText("https://tidal.jnwh.tech/video/" + args[5]);
          break;
        }

        default: return;
      }
    }
  }, 1000);
});
