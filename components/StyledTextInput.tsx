import { View, Text, TextInput } from "react-native";

export default function StyledTextInput(props: { label?: string; onChangeText?: Function; onBlur?: Function; text?: string; hidden?: boolean; width?: number; camelCase?: boolean }) {
	return (
		<View style={{ width: props.width ?? 200 }}>
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
					if (props.camelCase) text = text.replaceAll(" ", "");
					if (props.onChangeText) props.onChangeText(text);
				}}
				secureTextEntry={props.hidden}
				onBlur={(event) => {
					if (props.onBlur) props.onBlur(event);
				}}
			/>
		</View>
	);
}
