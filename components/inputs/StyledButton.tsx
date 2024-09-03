import { Colors } from "../../constants/Colors";
import { View, Text, Pressable } from "react-native";
import Loading from "../loading";

export default function StyledButton(props: { label: string; onPress?: Function; width?: number; height?: number; loading?: boolean; secondary?: boolean }) {
	return (
		<Pressable
			onPress={() => {
				if (props.loading) return;
				if (props.onPress) props.onPress();
			}}>
			<View style={{ backgroundColor: props.secondary ? "#333" : Colors.dark.secondary, width: props.width ?? 100, height: props.height ?? 30, justifyContent: "center", alignItems: "center", borderRadius: 2, position: "relative" }}>
				{props.loading ? (
					<View style={{ backgroundColor: Colors.dark.background, padding: 2, borderRadius: props.height ?? 30 }}>
						<Loading size={20} />
						<View style={{ position: "absolute", width: 10, height: 10, borderRadius: 10, backgroundColor: props.secondary ? "#333" : Colors.dark.secondary, top: ((props.height ?? 30) - 15) / 2, left: ((props.height ?? 30) - 16) / 2 }} />
					</View>
				) : (
					<Text style={{ color: Colors.dark.onSecondary }}>{props.label}</Text>
				)}
			</View>
		</Pressable>
	);
}
