import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function Loading() {
	return (
		<View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size={50} color={Colors.dark.secondary} />
		</View>
	);
}
