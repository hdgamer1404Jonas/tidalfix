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
      let redirectedLink = clipboardText.replace(
        /https:\/\/tidal\.com\/(browse\/track|browse\/album|browse\/artist|browse\/video)\/(\w+)/,
        'https://tidal.jnwh.tech/$2'
      );
      clipboard.writeText(redirectedLink);
    }
  }, 1000);
});