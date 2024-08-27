import { Modal, Pressable, TouchableWithoutFeedback, View, Text } from "react-native";
import StyledTextInput from "../StyledTextInput";
import { Colors } from "@/constants/Colors";
import StyledButton from "../inputs/StyledButton";
import { useState } from "react";
import { Server } from "../ServerList";
import { addServer, LocalSettings } from "@/handlers/storage";

export default function AddServerModal(props: { toggle: Function; visible: boolean }) {
	const [ip, setIp] = useState("https://");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [warning, setWarning] = useState("");
	const [signUp, setSignUp] = useState(false);
	const [signIn, setSigIn] = useState(false);

	const handleSignUp = () => {
		if (error.length > 0) return;
		setSignUp(true);

		if (ip.length <= 0) return setError("Adress is required!");
		if (username.length <= 0) return setError("Username is required!");
		if (password.length <= 0) return setError("Password is required!");

		try {
			const register = async () => {
				const response = await fetch(`${ip}/users/register`, {
					method: "POST",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: username,
						password: password,
					}),
				});

				const json = await response.json();

				if (response.status != 200) return setError(json.message);

				const localSettings = await LocalSettings.get();
				const lastId = localSettings.servers[localSettings.servers.length - 1].id;
				const server: Server = {
					id: lastId + 1,
					accessToken: json.token,
					title: json.server.title,
					ip: ip,
					iconURL: json.server.iconURL,
				};

				await addServer(server);
				setIp("https://");
				setUsername("");
				setPassword("");
				props.toggle(false);
			};
			register();
		} catch (e) {
			console.error(e);
		}
		setSignUp(false);
	};
	const handleSignIn = () => {
		if (error.length > 0) return;

		setSigIn(true);
		if (ip.length <= 0) return setError("Adress is required!");
		if (username.length <= 0) return setError("Username is required!");
		if (password.length <= 0) return setError("Password is required!");

		try {
			const login = async () => {
				const response = await fetch(`${ip}/users/login`, {
					method: "POST",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: username,
						password: password,
					}),
				});

				const json = await response.json();

				if (response.status == 403) return setError(json.message);

				const localSettings = await LocalSettings.get();
				const lastId = localSettings.servers[localSettings.servers.length - 1].id;
				const server: Server = {
					id: lastId + 1,
					accessToken: json.token,
					title: json.server.title,
					ip: ip,
					iconURL: json.server.iconURL,
				};

				await addServer(server);

				setIp("https://");
				setUsername("");
				setPassword("");

				props.toggle(false);
			};
			login();
		} catch (e) {
			console.error(e);
		}
		setSigIn(false);
	};

	return (
		<Modal
			transparent={true}
			visible={props.visible}
			onRequestClose={() => {
				props.toggle(false);
			}}
			animationType={"fade"}>
			<Pressable
				style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", cursor: "auto", backgroundColor: "#000000EE" }}
				onPress={() => {
					props.toggle(false);
				}}>
				<TouchableWithoutFeedback>
					<View style={{ backgroundColor: Colors.dark.background, width: "90%", maxWidth: 400, height: 300, borderRadius: 4, justifyContent: "center", alignItems: "center" }}>
						<Text style={{ color: "red" }}>{error}</Text>
						<Text style={{ color: "orange" }}>{warning}</Text>
						<StyledTextInput
							label="Adress"
							text={ip}
							onChangeText={(t: string) => {
								if (!t.startsWith("https://")) setWarning("⚠️ Unsafe adress!");
								else setWarning("");
								setIp(t);
							}}
							width={300}
						/>
						<StyledTextInput
							label="username"
							text={username}
							onChangeText={(t: string) => {
								setUsername(t);
								if (error) setError("");
							}}
							width={300}
							camelCase
						/>
						<StyledTextInput
							label="password"
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
							<StyledButton label="Sign in" onPress={handleSignIn} loading={signIn} />
							<View style={{ width: 20 }} />
							<StyledButton label="Sign up" secondary={true} onPress={handleSignUp} loading={signUp} />
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Pressable>
		</Modal>
	);
}
