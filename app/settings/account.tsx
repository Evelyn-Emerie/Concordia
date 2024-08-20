import { View, Text, ActivityIndicator } from "react-native";
import SettingsTextInput from "../../components/SettingsTextInput";
import ServerPageLabel from "../../components/ServerPageLabel";
import { useEffect, useState } from "react";
import { User, UserType, storeUser } from "../../handlers/storage";

async function loadData(setLoadState: Function, setUser: Function, setId: Function) {
	const user = await User.getUserObject();
	setUser(user);
	setId(user.id);
	setLoadState(true);
}

export default function AccountSettingsPage() {
	const [user, setUser] = useState<UserType>();
	const [id, setId] = useState("");
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		loadData(setLoaded, setUser, setId);
	}, []);

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
			}}>
			<ServerPageLabel title="Account" />
			{/* <Text style={{ color: "white" }}></Text> */}
			{!loaded ? (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						flex: 1,
						width: "100%",
					}}>
					<ActivityIndicator />
				</View>
			) : (
				<SettingsTextInput
					label="UserID"
					text={id}
					onChangeText={(t: string) => {
						setId(t);
					}}
					onBlur={() => {
						console.log(`SAVING: ${id}`);

						storeUser({
							id: id ?? "",
							username: user?.username ?? "",
						});
					}}
				/>
			)}
		</View>
	);
}
