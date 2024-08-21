import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useState } from "react";
import { View, TextInput, Pressable, Platform } from "react-native";

interface AutoTextInputProps {
	text: string;
	setText: Function;
	onSubmit: Function;
}

export default function AutoExpandingTextInput(props: AutoTextInputProps) {
	const [inputHeight, setInputHeight] = useState(20);
	const [isSendable, setIsSendable] = useState(false);

	const keyValue = "Enter";

	return (
		<View
			style={{
				backgroundColor: "#424242",
				paddingHorizontal: 10,
				paddingVertical: 5,
				flexDirection: "row",
				alignItems: "center",
				borderRadius: 10,
			}}>
			<TextInput
				style={{
					flex: 1,
					height: inputHeight,
					color: "white",
					// @ts-ignore
					outlineStyle: "none", //! Purely for WEB only
					fontSize: 14,
					paddingRight: 10,
				}}
				value={props.text}
				onKeyPress={(event) => {
					//! Purely for WEB only
					if (Platform.OS != "web") return;
					// @ts-ignore
					if (!event.shiftKey && event.code == "Enter") {
						//If not pressing shift + Enter but ONLY Enter
						event.preventDefault(); // Prevent space being added to text input
						if (props.text.trim().length > 0) {
							// If there is more inside the string than whitespace characters
							props.onSubmit(); // Send the message
							setInputHeight(20);
							setIsSendable(false);
						}
					}
				}}
				textAlignVertical="center"
				placeholder="Type a message here..."
				placeholderTextColor={"#626262"}
				underlineColorAndroid={"transparent"}
				onContentSizeChange={(e) => {
					if (props.text.length > 1) setInputHeight(Math.min(Math.round(e.nativeEvent.contentSize.height / 20), 10) * 20);
				}}
				onChangeText={(text) => {
					setIsSendable(text.length > 0);
					const textLines = text.split("\n").length; // Calculate amount of lines

					if (text.length < 1) setInputHeight(textLines * 20);
					props.setText(text); //Updated the text to reflect changes
				}}
				multiline={true}
			/>
			<Pressable
				onPress={() => {
					if (props.text.length < 1) return;
					props.onSubmit(); // Send the message
					setInputHeight(16);
					setIsSendable(false);
				}}>
				<Ionicons name="send" color={isSendable ? Colors.dark.secondary : "#262626"} size={20} />
			</Pressable>
		</View>
	);
}
