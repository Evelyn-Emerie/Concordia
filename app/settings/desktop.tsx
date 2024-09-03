import { useState } from "react";
import { View, Text } from "react-native";
import SettingsSwitchButton from "../../components/StyledSwitchButton";
import { LocalSettings } from "../../handlers/storage";
import ServerPageLabel from "../../components/ServerPageLabel";

export default function DesktopSettings(props: { preload: Function }) {
	const [state, setState] = useState(props.preload().LinkInNative ?? false);
	const sendUpdate = async (newState: boolean) => {
		const PORT = require("../../electron/LocalServer.json").port;
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
			LocalSettings.update();
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
			}}>
			<ServerPageLabel title="Desktop" />
			<SettingsSwitchButton setState={setState} state={state} label="Open links in native browser" style={{ flexDirection: "row", width: 400, justifyContent: "space-between" }} onPress={sendUpdate} />
		</View>
	);
}
