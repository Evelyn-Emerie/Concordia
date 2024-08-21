import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountSettingsPage from "./account";
import TestPage from "./test";

const settings = [
	{
		title: "User Settings",
		settings: [
			{
				index: 0,
				title: "Account",
				view: <AccountSettingsPage key={0} />,
			},
			{
				index: 1,
				title: "Super Test",
				view: <TestPage key={1} />,
			},
		],
	},
];

const getLocalSettings = async () => {
	try {
		const response = await fetch(`http://127.0.0.1:${require("../../constants/LocalServer.json").port}/settings`, {
			method: "POST",
			headers: {
				"Accept": "*/*",
				"Content-Type": "application/json",
			},
		});
		const json = await response.json();
		localSettings = json;
	} catch (e) {
		console.error(e);
	}
};

type LocalSettings = {
	LinkInNative: boolean;
};

export let localSettings: LocalSettings | null = null;

export default function SettingsScreen() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const mainWindow = (selectedIndex: number) => {
		return settings[0].settings[selectedIndex].view;
	};
	useEffect(() => {
		getLocalSettings();
	}, []);
	return (
		<GestureHandlerRootView>
			<SafeAreaView
				style={{
					backgroundColor: "#161616",
					flex: 1,
					flexDirection: "row",
				}}>
				<View>
					<View style={{ marginLeft: 20, marginTop: 20 }}>
						<ReturnArrow />
					</View>
					<View style={{ marginTop: 30, marginLeft: 10, marginRight: 20 }}>
						<SettingsList selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
					</View>
				</View>
				{mainWindow(selectedIndex)}
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}

type Setting = {
	index: number;
	title: string;
	view: React.JSX.Element;
};

const SettingsList = (props: { selectedIndex: number; setSelectedIndex: Function }) => {
	return (
		<FlatList
			data={settings}
			renderItem={(item) => {
				return <SettingsCategory key={item.index} title={item.item.title} settings={item.item.settings} selectedIndex={props.selectedIndex} setSelected={props.setSelectedIndex} />;
			}}
		/>
	);
};

const SettingsCategory = (props: { title: string; settings: Setting[]; selectedIndex: number; setSelected: Function }) => {
	return (
		<View style={{ width: 150, paddingHorizontal: 10 }}>
			<Text
				style={{
					color: "#999",
					fontWeight: "600",
					marginBottom: 5,
				}}>
				{props.title}
			</Text>
			{props.settings.map((item, index) => {
				return <SettingsButton key={item.index} title={item.title} index={item.index} selected={item.index == props.selectedIndex} setSelected={props.setSelected} />;
			})}
		</View>
	);
};

const SettingsButton = (props: { title: string; index: number; selected: boolean; setSelected: Function }) => {
	const [hover, SetHover] = useState(false);
	return (
		<Pressable
			onHoverIn={() => {
				SetHover(true);
			}}
			onHoverOut={() => {
				SetHover(false);
			}}
			onPress={() => {
				props.setSelected(props.index);
			}}>
			<View
				style={{
					backgroundColor: props.selected ? "#FFFFFF44" : hover ? "#FFFFFF22" : "transparent",
					width: "100%",
					paddingHorizontal: 10,
					borderRadius: 5,
					marginVertical: 2,
				}}>
				<Text style={{ color: "white", marginVertical: 2 }}>{props.title}</Text>
			</View>
		</Pressable>
	);
};

const ReturnArrow = () => {
	return (
		<Link href={"/"}>
			<View
				style={{
					width: 30,
					height: 30,
					borderRadius: 30,
					borderColor: "white",
					borderWidth: 2,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<MaterialIcons name="arrow-back-ios-new" size={20} color={"white"} />
			</View>
		</Link>
	);
};
