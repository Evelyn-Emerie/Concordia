import { Channel } from "@/components/ChannelList";
import ChatWindow, { Message } from "@/components/ChatWindow";
import { Server } from "@/components/ServerList";
import SideBar from "@/components/SideBar";
import { Colors } from "@/constants/Colors";
import getSocket from "@/handlers/socket";
import { useState, useRef, useEffect } from "react";
import { Keyboard, Platform, View } from "react-native";
import { Directions, DrawerLayout, Gesture, GestureDetector } from "react-native-gesture-handler";

export default function MainWindow() {
	const [newMessage, setNewMessage] = useState<Message>();
	const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>();
	const [selectedServer, setSelectedServer] = useState<Server | undefined>();
	const drawer = useRef<DrawerLayout>(null);

	useEffect(() => {
		if (selectedServer) getSocket(setNewMessage, selectedChannel as Channel, selectedServer as Server, newMessage);
	}, [selectedServer, selectedChannel]);

	const isWeb = Platform.OS == "web";
	if (isWeb)
		return (
			<View style={{ flex: 1, width: "100%", backgroundColor: Colors.dark.background, flexDirection: "row" }}>
				<SideBar selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} server={selectedServer} setSelectedServer={setSelectedServer} />
				<ChatWindow activeChannel={selectedChannel} server={selectedServer} newMessage={newMessage} />
			</View>
		);

	const fling = Gesture.Fling();
	fling.direction(Directions.RIGHT);
	fling.onEnd(() => {
		Keyboard.dismiss();
		drawer.current?.openDrawer();
	});

	return (
		<GestureDetector gesture={fling}>
			<DrawerLayout ref={drawer} drawerType="front" drawerWidth={235} drawerBackgroundColor="#00000088" drawerPosition="left" renderNavigationView={() => <SideBar selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} server={selectedServer} setSelectedServer={setSelectedServer} />}>
				<ChatWindow activeChannel={selectedChannel} server={selectedServer} />
			</DrawerLayout>
		</GestureDetector>
	);
}
