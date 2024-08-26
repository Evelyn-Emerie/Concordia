import { io } from "socket.io-client";
import { Message } from "../components/ChatWindow";
import { ChatCache } from "./chat";
import { Server } from "@/components/ServerList";
import { Channel } from "@/components/ChannelList";

class Socket {
	static instance: any = null;

	static getInstance(server: Server) {
		if (!Socket.instance) {
			Socket.instance = io(`${server.ip}`, {
				secure: true,
				// reconnection: true,
				// rejectUnauthorized: false,

				transports: ["websocket"],
			});
		}

		return Socket.instance;
	}
}

const getSocket = async (setNewMessage: Function, activeChannel: Channel, server: Server, newMessage?: Message) => {
	const socket = await Socket.getInstance(server);

	socket.off("update");
	socket.on("update", async (data: Message) => {
		if (!newMessage || newMessage.id != data.id) {
			const oldMessages = await ChatCache.get(data.channel);
			if (oldMessages) ChatCache.set(data.channel, [data, ...oldMessages]);

			if (data.channel == activeChannel.id) setNewMessage(data);
		}
	});

	socket.on("connect", () => {
		console.log("Connected to server!");
	});
};

export default getSocket;
