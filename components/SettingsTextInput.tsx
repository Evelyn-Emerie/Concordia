import { View, Text, TextInput } from "react-native";

export default function SettingsTextInput(props: { label?: string; onChangeText?: Function; onBlur?: Function; text?: string }) {
	return (
		<View style={{ width: 200 }}>
			<Text
				style={{
					color: "#AAA",
					fontWeight: "600",
					fontSize: 16,
					marginBottom: 5,
				}}>
				{props.label ?? "Label"}
			</Text>
			<TextInput
				style={{
					color: "white",
					backgroundColor: "#333",
					padding: 5,
					borderRadius: 2,
					// @ts-ignore
					outlineStyle: "none", //! Purely for WEB only
				}}
				value={props.text ?? ""}
				underlineColorAndroid={"transparent"}
				onChangeText={(text) => {
					if (props.onChangeText) props.onChangeText(text);
				}}
				onBlur={(event) => {
					if (props.onBlur) props.onBlur(event);
				}}
			/>
		</View>
	);
}
