import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function Loading(props: { nopad?: boolean }) {
	return (
		<View style={{ flex: props.nopad ? undefined : 1, width: props.nopad ? 50 : "100%", justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size={50} color={Colors.dark.secondary} />
		</View>
	);
}
