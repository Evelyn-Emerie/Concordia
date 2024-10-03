import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { View, Animated, Easing, Pressable, Text, Image } from "react-native";
import { LocalSettings, remServer } from "../handlers/storage";
import AddServerModal from "./modals/addServer";
import Server from "../types/server";

export default function ServerList(props: { setServer: Function; selectedServer?: Server; servers: Server[]; setUpdate: Function }) {
	const handleServerSelect = (server: Server) => {
		props.setServer(server);
	};

	return (
		<View style={{ marginHorizontal: 5 }}>
			{props.servers.map((server) => {
				return <ServerIcon key={server.id} onPressed={handleServerSelect} server={server} selected={props.selectedServer ? props.selectedServer.id == server.id : false} setUpdate={props.setUpdate} />;
			})}
			<AddServer setUpdate={props.setUpdate} />
		</View>
	);
}

interface ServerIconProps {
	server: Server;
	selected?: boolean;
	onPressed?: Function;
	setUpdate: Function;
}

function ServerIcon(props: ServerIconProps) {
	const [hover, setHover] = useState(false);

	const borderRadius = useRef(new Animated.Value(props.selected ? 5 : 20)).current;

	const animateBorderRadius = (toValue: number) => {
		Animated.timing(borderRadius, {
			toValue,
			duration: 100,
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
			onLongPress={() => {
				remServer(props.server).then(() => {
					props.setUpdate();
				});
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
						width: 150,
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
					<Text style={{ color: "white", flexWrap: "nowrap", fontSize: 20 }} numberOfLines={1} ellipsizeMode="tail">
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

function AddServer(props: { setUpdate: Function }) {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<Pressable
			onPress={() => {
				setModalVisible(true);
			}}>
			<AddServerModal visible={modalVisible} toggle={setModalVisible} setUpdate={props.setUpdate} />
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
