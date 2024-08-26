import StyledButton from "@/components/inputs/StyledButton";
import SettingsTextInput from "@/components/StyledTextInput";
import { Colors } from "@/constants/Colors";
import { storeToken } from "@/handlers/storage";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

function makeid(length: number) {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export default function LoginWindow(props: { requestReload: Function }) {
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSync = async () => {
		setLoading(true);
		await storeToken(password);
		props.requestReload(true);
	};

	const handleNewAccount = async () => {
		const accessToken = Date.now() + "-" + makeid(16) + "-" + makeid(19);
		await storeToken(accessToken);
		props.requestReload(true);
	};

	return (
		<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
			<Text style={{ color: Colors.dark.secondary, fontSize: 30, fontWeight: "600", marginBottom: 20 }}>Concordia</Text>
			<SettingsTextInput label="AccessToken" text={password} onChangeText={(p: string) => setPassword(p)} hidden />
			<View style={{ height: 20 }} />
			<StyledButton label="Sync data" onPress={handleSync} loading={loading} />
			<View style={{ height: 10 }} />
			<Pressable onPress={handleNewAccount}>
				<Text style={{ color: "#AAA" }}>New account...</Text>
			</Pressable>
		</View>
	);
}
