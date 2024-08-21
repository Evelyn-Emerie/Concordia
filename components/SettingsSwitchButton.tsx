import { View, Text, StyleProp, ViewStyle } from "react-native";
import SwitchButton from "./SwitchButton";

export default (props: { label: string; onPress?: Function; state: boolean; setState: Function; style?: StyleProp<ViewStyle> }) => {
	return (
		<View style={[{ width: 200 }, props.style]}>
			<Text
				style={{
					color: "#AAA",
					fontWeight: "600",
					fontSize: 16,
					marginBottom: 5,
				}}>
				{props.label ?? "Label"}
			</Text>
			<SwitchButton onPress={props.onPress} state={props.state} setState={props.setState} />
		</View>
	);
};
