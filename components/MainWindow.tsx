import { useEffect, useRef, useState } from "react";
import getSocket from "../handlers/socket";
import SideBar from "../components/SideBar";
import { Keyboard, Platform, View } from "react-native";
import { Directions, DrawerLayout, Gesture, GestureDetector } from "react-native-gesture-handler";
import ChatWindow, { Message } from "../components/ChatWindow";

export default function MainWindow() {
	const [newMessage, setNewMessage] = useState<Message>();
	const [selectedChannel, setSelectedChannel] = useState(0);
	const [title, setTitle] = useState("");
	const drawer = useRef<DrawerLayout>(null);

	const getActiveChannel = () => {
		return selectedChannel;
	};

	const isWeb = Platform.OS == "web";

	useEffect(() => {
		getSocket(setNewMessage, getActiveChannel, newMessage);
	}, [selectedChannel]);

	if (isWeb)
		return (
			<View style={{ flexDirection: "row", flex: 1 }}>
				<SideBar selectedChannel={getActiveChannel} setSelectedChannel={setSelectedChannel} setTitle={setTitle} />
				<ChatWindow newMessage={newMessage} activeChannel={getActiveChannel} title={title} />
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
			<DrawerLayout ref={drawer} drawerType="front" drawerWidth={235} drawerBackgroundColor="#00000088" drawerPosition="left" renderNavigationView={() => <SideBar selectedChannel={getActiveChannel} setSelectedChannel={setSelectedChannel} setTitle={setTitle} />}>
				<ChatWindow newMessage={newMessage} activeChannel={getActiveChannel} title={title} />
			</DrawerLayout>
		</GestureDetector>
	);
}
