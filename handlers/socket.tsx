import { io } from "socket.io-client";
import { Message } from "../components/ChatWindow";
import { ChatCache } from "./chat";

class Socket {
  static instance: any = null;

  static getInstance() {
    if (!Socket.instance) {
      Socket.instance = io("https://api.staryhub.net", {
        secure: true,
        // reconnection: true,
        // rejectUnauthorized: false,

        transports: ["websocket"],
      });
    }

    return Socket.instance;
  }
}

const getSocket = async (
  setNewMessage: Function,
  activeChannel: Function,
  newMessage?: Message
) => {
  const socket = await Socket.getInstance();

  socket.on("update", async (data: Message) => {
    if (!newMessage || newMessage.id != data.id) {
      const oldMessages = await ChatCache.get(data.channel);
      if (oldMessages) ChatCache.set(data.channel, [data, ...oldMessages]);

      if (data.channel == activeChannel()) setNewMessage(data);
    }
  });

  socket.on("connect", () => {
    console.log("Connected to server!");
  });
};

export default getSocket;
