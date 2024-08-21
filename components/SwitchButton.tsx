import { Pressable, View } from "react-native";
import { Colors } from "../constants/Colors";

export default (props: { onPress?: Function; state: boolean; setState: Function }) => {
	return (
		<Pressable
			onPress={() => {
				props.setState(!props.state);
				console.log(!props.state);

				if (props.onPress) props.onPress(!props.state);
			}}>
			<View style={{ backgroundColor: props.state ? Colors.dark.secondary : "#444", width: 50, height: 20, borderRadius: 20, position: "relative" }}>
				<View style={{ backgroundColor: "white", width: 25, height: 25, borderRadius: 25, position: "absolute", left: props.state ? null : 0, right: !props.state ? null : 0, top: -2.5 }} />
			</View>
		</Pressable>
	);
};
