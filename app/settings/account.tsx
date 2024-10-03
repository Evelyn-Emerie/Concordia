import { View } from "react-native";
import SettingsTextInput from "../../components/StyledTextInput";
import ServerPageLabel from "../../components/ServerPageLabel";
import { useEffect, useState } from "react";
import { User } from "../../handlers/storage";
import Loading from "../../components/loading";
import T_User from "../../types/user";

async function loadData(setUser: Function) {
	const user = await User.getUserObject();
	setUser(user);
}

export default function AccountSettingsPage() {
	const [user, setUser] = useState<T_User>();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		loadData(setUser);
	}, []);

	useEffect(() => {
		const l = async () => {
			setUsername(user?.username ?? "");
			setPassword(user?.password ?? "");
		};
		if (user) l();
	}, [user]);

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
			}}>
			<ServerPageLabel title="Account" />
			{!user ? (
				<Loading />
			) : (
				<View>
					<SettingsTextInput
						label="Username"
						text={username}
						onChangeText={(t: string) => {
							setUsername(t);
						}}
						onBlur={() => {
							User.setUsername(username);
						}}
					/>
					<SettingsTextInput
						label="Password"
						text={password}
						onChangeText={(t: string) => {
							setPassword(t);
						}}
						onBlur={() => {
							User.setPassword(password);
						}}
						hidden
					/>
				</View>
			)}
		</View>
	);
}
