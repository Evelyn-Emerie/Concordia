import { Button, View } from "react-native";
import SettingsTextInput from "../../components/StyledTextInput";
import ServerPageLabel from "../../components/ServerPageLabel";
import { useEffect, useState } from "react";
import { Token, User, UserType } from "../../handlers/storage";
import Loading from "../../components/loading";

async function loadData(setUser: Function) {
	const user = await User.getUserObject();
	setUser(user);
}

export default function AccountSettingsPage() {
	const [user, setUser] = useState<UserType>();
	const [username, setUsername] = useState("");

	useEffect(() => {
		loadData(setUser);
	}, []);

	useEffect(() => {
		const l = async () => {
			setUsername(user?.username ?? "");
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
						onBlur={() => {}}
					/>
					<Button
						title="Log out"
						onPress={() => {
							Token.clear();
						}}
					/>
				</View>
			)}
		</View>
	);
}
