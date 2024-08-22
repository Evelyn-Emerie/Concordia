import { ActivityIndicator, View } from "react-native";

export default function Loading() {
	return (
		<View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator />
		</View>
	);
}
