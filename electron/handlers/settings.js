const storage = require('electron-settings');

let LinkInNative = false;
let servers = [];

const loadSettings = async () => {
    LinkInNative = await storage.get('LinkInNative') ?? false;
    servers = await storage.get("servers") ?? [];

    return getSettings();
}

const getSettings = () => {
    return settings = {
        servers: servers,
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
    localserver.post('/settings/setNewWindow', async (req, res) => {
        const { newState } = req.body;
        if (typeof newState != 'boolean') return res.sendStatus(400);

        LinkInNative = newState;

        await storage.set('LinkInNative', newState);

        const response = await loadSettings();
        return res.send(response);
    })

    // update local server list
    localserver.post("/settings/setServers", async (req, res) => {
        const { newServers } = req.body;

        await storage.set('servers', newServers);

        const response = await loadSettings();
        return res.send(response);
    })
}

module.exports = {
    getSettings,
    loadSettings,
    handleUpdates
}
