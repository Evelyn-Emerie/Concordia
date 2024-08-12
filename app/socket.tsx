import { io } from "socket.io-client";

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

export default Socket;
