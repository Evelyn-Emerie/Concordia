import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useEffect, useState } from "react";
import { View, TextInput, Pressable, Platform, Text, Modal } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image as ExpoImage } from "expo-image";
import T_Gif from "../types/gif";
import T_Server from "@/types/server";
interface AutoTextInputProps {
	text: string;
	setText: Function;
	onSubmit: Function;
	charLimit?: number;
	server: T_Server;
}

const getGifs = async (server: T_Server, query: string, setGifs: Function) => {
	try {
		const response = await fetch(`${server.ip}/api/gifs?q=${query}`);
		const json = await response.json();
		if (response.status !== 200) throw new Error("Failed to fetch");
		console.log("setting gif");

		setGifs(json);
	} catch (e) {
		console.log(e);
	}
};

export default function AutoExpandingTextInput(props: AutoTextInputProps) {
	const [inputHeight, setInputHeight] = useState(20);
	const [isSendable, setIsSendable] = useState(false);
	const [isVisible, setVisible] = useState(false);
	// ! Temporary
	const data: T_Gif[] = [
		{
			source: "https://media.tenor.com/TWbZjCy8iN4AAAAC/girl-anime.gif",
			width: 200,
			height: 100,
		},
		{
			source: "https://media.tenor.com/-P82knPil4oAAAAC/girls-lesbian.gif",
			width: 200,
			height: 100,
		},
		{
			source: "https://media.tenor.com/jlDpJDljsHUAAAAC/yuri-anime.gif",
			width: 200,
			height: 100,
		},
	];
	const [gifs, setGifs] = useState<T_Gif[]>(data);

	const keyValue = "Enter";

	useEffect(() => {
		getGifs(props.server, "yuri+kiss", setGifs);
	}, []);

	return (
		<View
			style={{
				backgroundColor: "#424242",
				paddingHorizontal: 10,
				paddingVertical: 2,
				flexDirection: "row",
				alignItems: "center",
				borderRadius: 10,
				position: "relative",
				maxHeight: 100,
			}}>
			{isVisible ? (
				<View style={{ width: "100%", height: 120, position: "absolute", backgroundColor: "#161616", bottom: "120%", right: 0, borderRadius: 3 }}>
					<FlatList data={gifs} renderItem={(item) => <GifImage setSendable={setIsSendable} gif={item.item} setText={props.setText} text={props.text} setVisible={setVisible} />} horizontal />
				</View>
			) : null}
			<Pressable
				onPress={() => {
					setVisible(!isVisible);
				}}>
				<View>
					<Ionicons name="add-circle" size={20} color={"#262626"} />
				</View>
			</Pressable>
			<View style={{ width: 5 }} />
			<TextInput
				style={{
					flex: 1,
					height: inputHeight,
					color: "white",
					// @ts-ignore
					outlineStyle: "none", //! Purely for WEB only
					fontSize: 14,
					paddingRight: 10,
					maxHeight: 100,
				}}
				value={props.text}
				onKeyPress={(event) => {
					//! Purely for WEB only
					if (Platform.OS != "web") return;
					// @ts-ignore
					if (!event.shiftKey && event.nativeEvent.key == "Enter") {
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
					if (props.charLimit && text.length > props.charLimit) text = text.slice(0, 300); // Prevent messages over 300 characters long
					if (props.text.length < 1 && text.includes("\n")) return; // Prevent empty new lines without starting character(s)

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
					setInputHeight(20);
					setIsSendable(false);
				}}>
				<View style={{ justifyContent: "center", alignItems: "center", width: 30 }}>
					<Ionicons name="send" color={isSendable ? Colors.dark.secondary : "#262626"} size={20} />
					<Text style={{ color: "#262626", fontSize: 12, fontWeight: "700" }}>{props.text.length}/300</Text>
				</View>
			</Pressable>
		</View>
	);
}

const GifImage = (props: { gif: T_Gif; text: string; setText: Function; setVisible: Function; setSendable: Function }) => {
	const [hover, setHover] = useState(false);

	return (
		<Pressable
			onHoverIn={() => setHover(true)}
			onHoverOut={() => setHover(false)}
			onPress={() => {
				props.setText(props.text + `[gif](${props.gif.source})${props.gif.height};${props.gif.width}`);
				props.setVisible(false);
				props.setSendable(true);
			}}>
			<View style={{ padding: 5, backgroundColor: hover ? "#ffffff22" : "transparent", borderRadius: 3 }}>
				<ExpoImage source={{ uri: props.gif.source }} style={{ height: 110, width: 200, borderRadius: 2 }} />
			</View>
		</Pressable>
	);
};
