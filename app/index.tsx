import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatWindow, { Message } from "../components/ChatWindow";
import { SafeAreaView } from "react-native-safe-area-context";
import ServerList from "../components/ServerList";
import { useState } from "react";

import Socket from "./socket";

export default function Index(this: any) {
  const [newMessage, setNewMessage] = useState<Message>();

  const socket = Socket.getInstance();

  socket.on("connect", () => {
    console.log("Connected to server!");
  });

  socket.on("update", (data: Message) => {
    if (!newMessage || newMessage.id != data.id) {
      // console.log(newMessage?.id != data.id);
      setNewMessage(data);
    }
  });

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          backgroundColor: "#161616",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <ServerList />
        <ChatWindow newMessage={newMessage} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
