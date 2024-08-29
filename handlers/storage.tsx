import AsyncStorage from "@react-native-async-storage/async-storage";
import { Server } from "../components/ServerList";
import { Platform } from "react-native";

export type UserType = {
	username: string;
	password: string;
};

export class User {
	static user: UserType = {} as UserType;

	static async getUserObject() {
		if (!User.user.username) {
			User.user = await getUser();
		}

		return User.user;
	}

	static async setPassword(password: string) {
		User.user.password = password;
		await AsyncStorage.setItem("user", JSON.stringify(User.user));
		return User.user;
	}

	static async setUsername(username: string) {
		User.user.username = username;
		await AsyncStorage.setItem("user", JSON.stringify(User.user));
		return User.user;
	}
}

const getUser = async () => {
	const user: UserType = JSON.parse((await AsyncStorage.getItem("user")) ?? "{}");
	return user;
};

export type TypeLocalSettings = {
	servers: Server[];
	LinkInNative: boolean;
};

class LocalSettings {
	static settings: TypeLocalSettings;

	static async get() {
		if (!LocalSettings.settings) {
			LocalSettings.settings = await getLocalSettings();
		}

		return LocalSettings.settings;
	}

	static async save(newData: typeof this.settings) {
		await AsyncStorage.setItem("localSettings", JSON.stringify(newData));

		await this.update();
		return newData;
	}

	static async update() {
		LocalSettings.settings = await getLocalSettings();
		return LocalSettings.settings;
	}
}

const addServer = async (server: Server) => {
	let localSettings = await LocalSettings.get();
	localSettings.servers.push(server);

	if (Platform.OS == "web") {
		const PORT = require("../electron/LocalServer.json").port;
		try {
			await fetch(`http://127.0.0.1:${PORT}/settings/setServers`, {
				method: "POST",
				headers: {
					"Accept": "*/*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					newServers: localSettings.servers,
				}),
			});
		} catch (e) {
			console.error(e);
		}
	}
	return await LocalSettings.save(localSettings);
};

const updateServerData = async () => {
	let settings = await LocalSettings.get();

	// Use map to return an array of promises and await them with Promise.all
	const updatedServers: Server[] = await Promise.all(
		settings.servers.map(async (server) => {
			const response = await fetch(server.ip);

			const json = await response.json();
			const result: Server = {
				id: server.id,
				accessToken: server.accessToken,
				title: json.title,
				ip: server.ip,
				iconURL: json.iconURL,
			};
			return result;
		}),
	);

	if (Platform.OS == "web") {
		const PORT = require("../electron/LocalServer.json").port;
		try {
			await fetch(`http://127.0.0.1:${PORT}/settings/setServers`, {
				method: "POST",
				headers: {
					"Accept": "*/*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					newServers: updatedServers,
				}),
			});
		} catch (e) {
			console.error(e);
		}
	}

	await LocalSettings.save(settings);
	await LocalSettings.update();
};

export { LocalSettings, addServer, updateServerData };

const getLocalSettings = async () => {
	// If running on web, get settings from electron's storage
	if (Platform.OS == "web")
		try {
			const response = await fetch(`http://127.0.0.1:${require("../electron/LocalServer.json").port}/settings`, {
				method: "POST",
				headers: {
					"Accept": "*/*",
					"Content-Type": "application/json",
				},
			});
			const d = await response.json();
			console.log(d);

			return d;
		} catch (e) {
			console.error(e);
		}

	// If running on Android/iOS get settings from react storage
	return await JSON.parse((await AsyncStorage.getItem("localSettings")) ?? "{}");
};
