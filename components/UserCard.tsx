import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Pressable, Text } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Colors } from "../constants/Colors";
import T_User from "../types/user";

export default function UserCard(props: { user?: T_User }) {
	return (
		<View style={{ alignSelf: "flex-end", width: "100%", paddingHorizontal: 10, height: 60, backgroundColor: Colors.dark.background, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: 10 }}>
			{/* <ExpoImage source="https://media1.tenor.com/m/tCL3HGcaV4UAAAAd/raccoon-dance.gif" style={{ width: 45, height: 45 }} /> */}
			<View style={{ width: 10 }} />
			<Text style={{ color: Colors.dark.text, fontWeight: 600, fontSize: 18 }}>{props.user?.username ?? ""}</Text>
			<View style={{ flex: 1 }} />
			<Pressable
				onPress={() => {
					router.push("/settings/settings");
				}}>
				<View
					style={{
						width: 25,
						height: 25,
					}}>
					<MaterialIcons name="settings" size={25} color={"#ddd"} />
				</View>
			</Pressable>
		</View>
	);
}
