const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('node:path');

const localserver = express();
const PORT = 3001;

// Serve static files from the 'dist' directory
localserver.use(express.static(path.join(__dirname, 'dist')));

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
        minWidth: 500,
        width: 1000,
        minHeight: 300,
        height: 600,
        title: 'ChatThingie',
        backgroundColor: '#000',
        show: false
    });
    // win.setAutoHideMenuBar(true);
    win.menuBarVisible = false;

    // Load the Express server URL
    // win.loadURL(`http://localhost:${PORT}`);
    win.loadURL(`http://localhost:8081`); //! DEV MODE
    win.once('ready-to-show', () => {
        win.show();
    });


    win.webContents.setWindowOpenHandler(({ url }) => {
        // return require('electron').shell.openExternal(url); Open URL in native browser
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                frame: true,
                fullscreenable: true,
                backgroundColor: 'black',
                autoHideMenuBar: true
            }
        }

        // return { action: 'deny' }
    })
}


// Initialize the app
app.whenReady().then(() => {
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
