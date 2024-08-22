const storage = require('electron-settings');

let LinkInNative = false;

const loadSettings = async () => {
    LinkInNative = await storage.get('LinkInNative');
}

const getSettings = () => {
    return settings = {
        servers: [
            {
                id: 0,
                title: 'A real server!',
                ip: 'https://api.staryhub.net',
                iconURL: 'https://i.pinimg.com/564x/79/c1/8f/79c18f71503dbfbddbbefe67f809f1c6.jpg'
            }
        ],
        LinkInNative: LinkInNative
    }
}

const handleUpdates = (localserver) => {
    // get settings
    localserver.post('/settings', async (req, res) => {
        const settings = getSettings();
        return res.send(settings);
    })

    // open links in new window?
    localserver.post('/settings/setNewWindow', (req, res) => {
        const { newState } = req.body;
        if (typeof newState != 'boolean') return res.sendStatus(400);

        LinkInNative = newState;

        storage.set('LinkInNative', newState);

        return res.sendStatus(200);
    })
}

module.exports = {
    getSettings,
    loadSettings,
    handleUpdates
}
