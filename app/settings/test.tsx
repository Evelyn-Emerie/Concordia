import { useState } from "react";
import { View, Text } from "react-native";
import SettingsSwitchButton from "../../components/SettingsSwitchButton";
import { preLoadedSettings } from "./settings";

export default function TestPage() {
	const [state, setState] = useState(preLoadedSettings.LinkInNative ?? false);
	const sendUpdate = async (newState: boolean) => {
		const PORT = require("../../constants/LocalServer.json").port;
		try {
			await fetch(`http://127.0.0.1:${PORT}/settings/setNewWindow`, {
				method: "POST",
				headers: {
					"Accept": "*/*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					newState: newState,
				}),
			});
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<View
			style={{
				flex: 1,
				width: "100%",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Text style={{ color: "white" }}>Test Page!</Text>
			<SettingsSwitchButton setState={setState} state={state} label="Open links in native browser" style={{ flexDirection: "row", width: 400, justifyContent: "space-between" }} onPress={sendUpdate} />
		</View>
	);
}
