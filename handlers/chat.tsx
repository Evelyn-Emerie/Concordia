import T_Server from "../types/server";
import { Message } from "../components/ChatWindow";

const ChatCache = new Map();

const getMessages = async (channelId: number, server: T_Server) => {
	const cached = await ChatCache.get(channelId);

	if (cached) return cached;

	try {
		const response = await fetch(`${server.ip}/channels/${channelId}/messages`);

		let json = (await response.json()) as Message[];

		ChatCache.set(channelId, json);

		if (json.length > 0) return json.reverse();
		else return [];
	} catch (error) {
		console.error(`[CHAT ERROR] ${error}`);
	} finally {
		setTimeout(() => {
			clearCache(channelId);
		}, 1000 * 10);
	}
};
const clearCache = (id?: number) => {
	if (id || id != 0) ChatCache.delete(id);
	else ChatCache.clear();
};

export { ChatCache, getMessages, clearCache, sendMessage };

const sendMessage = async (setText: Function, text: string, activeChannel: number, server: T_Server) => {
	try {
		setText("");

		const res = await fetch(`${server.ip}/channels/${activeChannel}/messages`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"accesstoken": server.accessToken,
			},
			body: JSON.stringify({
				message: text,
			}),
		});
		const json = await res.json();
	} catch (error) {
		console.error(`[CHAT WINDOW ERROR] ${error}`);
	}
};
