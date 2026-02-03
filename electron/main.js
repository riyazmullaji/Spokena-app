const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Spokena",
    webPreferences: {
      nodeIntegration: false, // Security: keep this false for remote URLs
      contextIsolation: true
    }
  });

  // THIS IS THE KEY: Load your existing hosted app
  win.loadURL('https://spokena.vercel.app'); 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});