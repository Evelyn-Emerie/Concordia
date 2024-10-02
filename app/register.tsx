import StyledTextInput from "@/components/StyledTextInput";
import StyledButton from "@/components/inputs/StyledButton";
import { Colors } from "@/constants/Colors";
import { User } from "@/handlers/storage";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export default function Register() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	function saveData() {
		setLoading(true);

		if (username.length < 5) {
			setError("Username must be at least 5 characters long");
			setLoading(false);
			return;
		}
		if (password.length < 5) {
			setError("Password must be at least 5 characters long");
			setLoading(false);
			return;
		}

		User.setUsername(username);
		User.setPassword(password);

		router.push("/");
	}

	return (
		<View style={{ justifyContent: "center", alignItems: "center", flex: 1, width: "100%" }}>
			<Text style={{ color: Colors.dark.text, fontSize: 20 }}>
				Welcome to <Text style={{ fontWeight: 600 }}>Concordia</Text>!
			</Text>
			<Text style={{ color: "white", marginTop: 5 }}>Please choose a username and password to sign in/up on servers</Text>
			<Text style={{ color: "white", marginTop: 5 }}>You can have more than 1 account</Text>

			<View style={{ height: 20 }} />
			<Text style={{ color: "red" }}>{error}</Text>
			<View style={{ height: 10 }} />

			<StyledTextInput
				label="Username"
				text={username}
				onChangeText={(t: string) => {
					setUsername(t);
					if (error) setError("");
				}}
				width={300}
				camelCase
			/>
			<View style={{ height: 10 }} />
			<StyledTextInput
				label="Password"
				text={password}
				hidden
				onChangeText={(t: string) => {
					setPassword(t);
					if (error) setError("");
				}}
				width={300}
				camelCase
			/>
			<View style={{ flexDirection: "row", marginTop: 20 }}>
				<StyledButton label="Save credentials" secondary={false} width={250} onPress={saveData} loading={loading} />
			</View>
		</View>
	);
}
