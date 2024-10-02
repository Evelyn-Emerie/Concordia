const { app, session, BrowserWindow } = require('electron');
const fs = require('fs');
const express = require('express');
const path = require('node:path');
const cors = require('cors');
const settings = require('./handlers/settings');

const localserver = express();
const PORT = require('./LocalServer.json').port;


// Serve static files from the 'dist' directory
localserver.use(cors());
localserver.use(express.static(path.join(__dirname, 'dist')));
localserver.use(express.json());


// Route to serve the index.html
localserver.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the local server
localserver.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// Create the Electron window
function createWindow() {
    const win = new BrowserWindow({
        minWidth: 600,
        width: 1000,
        minHeight: 300,
        height: 600,
        title: 'Concordia',
        backgroundColor: '#000',
        show: false
    });

    //! TEMPORARY win.removeMenu();

    // Load the Express server URL
    if (process.env.DEV)
        win.loadURL(`http://127.0.0.1:8081`); // DEV MODE
    else
        win.loadURL(`http://127.0.0.1:${PORT}`);


    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('page-title-updated', (event) => {
        event.preventDefault();
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (settings.getSettings().LinkInNative)
            return require('electron').shell.openExternal(url); // Open URL in native browser
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                frame: true,
                fullscreenable: true,
                backgroundColor: 'black',
                autoHideMenuBar: true
            }
        }
    })
}


// Initialize the app
app.whenReady().then(async () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

settings.loadSettings();
settings.handleUpdates(localserver);