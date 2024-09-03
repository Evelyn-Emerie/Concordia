import { Modal, Pressable, TouchableWithoutFeedback, View, Text, Image } from "react-native";
import StyledTextInput from "../StyledTextInput";
import { Colors } from "../../constants/Colors";
import StyledButton from "../inputs/StyledButton";
import { useRef, useState } from "react";
import { Server } from "../ServerList";
import { addServer, LocalSettings, User } from "../../handlers/storage";

type ServerInfo = {
	title: string;
	description: string;
	iconURL: string;
};

export default function AddServerModal(props: { toggle: Function; visible: boolean }) {
	const [ip, setIp] = useState("https://");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [warning, setWarning] = useState("");
	const [signUp, setSignUp] = useState(false);
	const [signIn, setSigIn] = useState(false);
	const [serverInfo, setServerInfo] = useState<ServerInfo>();

	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const getServerInfo = async (adress: string) => {
		try {
			const response = await fetch(adress);
			if (response.status != 200) return setError("Server not found!");
			const json = await response.json();

			setServerInfo(json);
			setError("");
		} catch (e) {
			setError("Server not found");
			setServerInfo(undefined);
		}
	};

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
				const lastId = localSettings.servers.length > 0 ? localSettings.servers[localSettings.servers.length - 1].id : 0;
				const server: Server = {
					id: lastId + 1 ?? 0,
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
				const lastId = localSettings.servers.length > 0 ? localSettings.servers[localSettings.servers.length - 1].id : 0;
				const server: Server = {
					id: lastId + 1 ?? 0,
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
				style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center", cursor: "auto", backgroundColor: "#000000AA" }}
				onPress={() => {
					props.toggle(false);
				}}>
				<TouchableWithoutFeedback>
					<View style={{ backgroundColor: Colors.dark.background, width: "90%", maxWidth: 400, minHeight: 300, borderRadius: 4, justifyContent: "center", alignItems: "center", paddingVertical: 10 }}>
						{serverInfo ? (
							<View style={{ justifyContent: "center", alignItems: "center" }}>
								<Image source={{ uri: serverInfo?.iconURL, width: 75, height: 75 }} />
								<Text style={{ color: Colors.dark.text, fontSize: 40 }}>{serverInfo.title}</Text>
								<Text style={{ color: Colors.dark.text }}>{serverInfo.description}</Text>
							</View>
						) : null}
						<Text style={{ color: "red" }}>{error}</Text>
						<Text style={{ color: "orange" }}>{warning}</Text>
						<StyledTextInput
							label="Adress"
							text={ip}
							onChangeText={(t: string) => {
								if (!t.startsWith("https://")) setWarning("⚠️ Unsafe adress!");
								else setWarning("");
								setIp(t);

								// Clear any previous debounce timeout
								if (debounceTimeout.current) {
									clearTimeout(debounceTimeout.current);
								}

								if (t.length > 8)
									// Set a new debounce timeout to fetch server info
									debounceTimeout.current = setTimeout(() => {
										getServerInfo(t);
									}, 500); // .5s delay
							}}
							width={300}
						/>
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
						<Pressable
							onPress={async () => {
								const user = await User.getUserObject();
								setUsername(user.username);
								setPassword(user.password);
							}}>
							<Text style={{ color: Colors.dark.secondary, textDecorationLine: "underline" }}>Autofill local user</Text>
						</Pressable>
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
