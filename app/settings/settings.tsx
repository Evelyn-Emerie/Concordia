import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountSettingsPage from "./account";
import DesktopSettings from "./desktop";
import { LocalSettings, TypeLocalSettings } from "../../handlers/storage";
import Loading from "../../components/loading";
import { Colors } from "../../constants/Colors";
import UISettings from "./UI";
import ReturnArrow from "@/components/returnArrow";
import SettingsList from "@/components/SettingsList";

let preLoadedSettings: TypeLocalSettings;

const settings = [
	{
		title: "Settings",
		settings: [
			{
				index: 0,
				title: "Account",
				view: <AccountSettingsPage key={0} />,
			},
			{
				index: 1,
				title: "UI/UX",
				view: (
					<UISettings
						key={1}
						preload={() => {
							return preLoadedSettings;
						}}
					/>
				),
			},
		],
	},
];

if (Platform.OS == "web") {
	settings[0].settings.push({
		index: settings.length + 1,
		title: "Desktop only",
		view: (
			<DesktopSettings
				key={1}
				preload={() => {
					return preLoadedSettings;
				}}
			/>
		),
	});
}

export default function SettingsScreen() {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const mainWindow = (selectedIndex: number) => {
		return settings[0].settings[selectedIndex].view;
	};

	useEffect(() => {
		const load = async () => ((preLoadedSettings = await LocalSettings.get()), setLoaded(true));
		load();
	}, [selectedIndex]);

	return (
		<GestureHandlerRootView>
			<SafeAreaView
				style={{
					backgroundColor: Colors.dark.background,
					flex: 1,
					flexDirection: "row",
				}}>
				s
				<View>
					<View style={{ marginLeft: 20, marginTop: 20 }}>
						<ReturnArrow />
					</View>
					<View style={{ marginTop: 30, marginLeft: 10, marginRight: 20 }}>
						<SettingsList selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} settings={settings} />
					</View>
				</View>
				{!loaded ? <Loading /> : mainWindow(selectedIndex)}
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
