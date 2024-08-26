import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { View, Animated, Easing, Pressable, Text, Image, Modal, TouchableWithoutFeedback } from "react-native";
import { LocalSettings } from "../handlers/storage";
import { Colors } from "../constants/Colors";

export type Server = {
	id: number;
	title: string;
	ip: string;
	iconURL?: string;
};

export default function ServerList(props: { setServer: Function; selectedServer?: Server }) {
	const [serverList, setServerList] = useState<Server[]>([]);

	const handleServerSelect = (server: Server) => {
		props.setServer(server);
	};

	useEffect(() => {
		const load = async () => {
			const settings = await LocalSettings.get();
			if (settings.servers) setServerList(settings.servers);
		};
		load();
	}, []);

	const router = useRouter();

	return (
		<View style={{ marginHorizontal: 5 }}>
			{serverList.map((server) => {
				return <ServerIcon key={server.ip} onPressed={handleServerSelect} server={server} selected={props.selectedServer ? props.selectedServer.id == server.id : false} />;
			})}
			<AddServer />
			<View style={{ flex: 1 }} />
			<Pressable
				onPress={() => {
					router.push("/settings/settings");
				}}>
				<View
					style={{
						width: 40,
						height: 40,
						marginBottom: 10,
					}}>
					<MaterialIcons name="settings" size={40} color={"#ddd"} />
				</View>
			</Pressable>
		</View>
	);
}

interface ServerIconProps {
	server: Server;
	selected?: boolean;
	onPressed?: Function;
}

function ServerIcon(props: ServerIconProps) {
	const [hover, setHover] = useState(false);

	const borderRadius = useRef(new Animated.Value(props.selected ? 5 : 20)).current;

	const animateBorderRadius = (toValue: number) => {
		Animated.timing(borderRadius, {
			toValue,
			duration: 100, // Adjust the duration as needed
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false, // Border radius does not support native driver
		}).start();
	};

	useEffect(() => {
		animateBorderRadius(props.selected ? 5 : 20);
	}, [props.selected]);

	return (
		<Pressable
			onPress={() => {
				props.onPressed ? props.onPressed(props.server) : null;
			}}
			onPointerEnter={() => {
				setHover(true);
				animateBorderRadius(props.selected ? 5 : 10);
			}}
			onPointerLeave={() => {
				setHover(false);
				animateBorderRadius(props.selected ? 5 : 20);
			}}>
			{hover ? (
				<View
					style={{
						position: "absolute",
						left: 65,
						height: 50, //! Height + MarginTop * 2 === Height Of Server Icon
						marginTop: 5,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#101010",
						borderRadius: 10,
						maxWidth: 150,
						paddingHorizontal: 10,
					}}>
					<View
						style={{
							position: "absolute",
							left: -10, // Position the triangle to the left of the view
							width: 0,
							height: 0,
							borderTopWidth: 10,
							borderTopColor: "transparent",
							borderBottomWidth: 10,
							borderBottomColor: "transparent",
							borderRightWidth: 10,
							borderRightColor: "#101010",
							top: "50%",
							marginTop: -5, // Center the triangle vertically
						}}
					/>
					<Text style={{ color: "white", flexWrap: "nowrap" }} numberOfLines={1} ellipsizeMode="tail">
						{props.server.title}
					</Text>
				</View>
			) : null}
			<Animated.View
				style={{
					width: 50,
					height: 50,
					marginVertical: 5,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#323232",
					overflow: "hidden",
					borderRadius: borderRadius, // Use Animated.Value for smooth transitions
				}}>
				{props.server.iconURL ? <Image source={{ uri: props.server.iconURL, width: 50, height: 50 }} /> : <Ionicons name="code" color={"white"} size={25} />}
			</Animated.View>
		</Pressable>
	);
}

function AddServer() {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<Pressable
			onPress={() => {
				setModalVisible(true);
			}}>
			<Modal
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(false);
				}}
				animationType={"fade"}>
				<Pressable
					style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", cursor: "auto", backgroundColor: "#000000EE" }}
					onPress={() => {
						setModalVisible(false);
					}}>
					<TouchableWithoutFeedback>
						<View style={{ backgroundColor: Colors.dark.background, width: "90%", maxWidth: 500, height: 300, borderRadius: 4 }}>
							<Text>Hello world!</Text>
						</View>
					</TouchableWithoutFeedback>
				</Pressable>
			</Modal>
			<View
				style={{
					width: 50,
					height: 50,
					marginVertical: 5,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#323232",
					borderRadius: 5,
				}}>
				<Ionicons name="add-circle-outline" color={"#84ff99"} size={30} />
			</View>
		</Pressable>
	);
}
