import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function Loading(props: { nopad?: boolean; size?: number }) {
	return (
		<View style={{ flex: props.nopad ? undefined : 1, width: props.nopad ? props.size ?? 50 : "100%", justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size={props.size ?? 50} color={Colors.dark.secondary} />
		</View>
	);
}
