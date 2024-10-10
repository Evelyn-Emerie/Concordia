const { app, BrowserWindow, Tray, Menu } = require('electron');
const express = require('express');
const path = require('node:path');
const cors = require('cors');
const settings = require('./handlers/settings.js');

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

let myWindow = null;
let tray = null;

// Function to create the Electron window
function createWindow() {
    myWindow = new BrowserWindow({
        minWidth: 600,
        width: 1000,
        minHeight: 300,
        height: 600,
        title: 'Concordia',
        backgroundColor: '#000',
        show: false,
        icon: path.join(__dirname, "../assets/images", 'icon_circle.png')
    });

    const win = myWindow;

    if (!process.env.DEV) win.removeMenu();

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

    win.on('close', (event) => {
        event.preventDefault();
        win.hide();
    })

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
        };
    });
}

// Handle single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Focus the already open window when second instance is launched
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore();
            myWindow.focus();
        }
    });

    // Initialize the app
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
        tray = new Tray(path.join(__dirname, "../assets/images", 'Tray-icon.png'));
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Quit', click: () => { app.exit() } }
        ])
        tray.setToolTip('Concordia')
        tray.on('click', () => {
            myWindow.show();
        })
        tray.setContextMenu(contextMenu)
    });
}



settings.loadSettings();
settings.handleUpdates(localserver);