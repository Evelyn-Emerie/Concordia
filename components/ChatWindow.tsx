import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AutoExpandingTextInput from "./AutoTextInput";
import { getMessages, sendMessage } from "../handlers/chat";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "../constants/Colors";
import * as Clipboard from "expo-clipboard";

export type Message = {
	id: string;
	text: string;
	channel: number;
	user: User;
};

type User = {
	id: string;
	username: string;
	profilePicture?: string;
};

interface ChatWindowProps {
	newMessage?: Message;
	activeChannel: Function;
	title: string;
}

export default function ChatWindow(props: ChatWindowProps) {
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<Message[]>([]);
	const [text, setText] = useState("");

	const getData = async () => {
		setData(await getMessages(props.activeChannel()));
		setLoading(false);
	};

	useEffect(() => {
		if (!data) setLoading(true);
		getData();
	}, [props.activeChannel]);

	useEffect(() => {
		const message = props.newMessage as Message;
		setData((prevData) => [message, ...prevData]);
	}, [props.newMessage]);

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
				backgroundColor: "#111111",
			}}>
			<View
				style={{
					height: 50,
					backgroundColor: "#161616",
					justifyContent: "center",
					paddingHorizontal: 20,
					borderBottomWidth: 2,
					borderBottomColor: "#444",
				}}>
				<Text style={{ color: "white", fontSize: 18 }}>{props.title}</Text>
			</View>
			{isLoading ? (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator />
				</View>
			) : data.length > 0 ? (
				<FlatList
					style={{
						width: "98%",
						marginHorizontal: "auto",
					}}
					data={data}
					keyExtractor={({ id }) => id}
					renderItem={({ item, index }) => <MessageCard message={item} isLastInGroup={index === data.length - 1 || data[index].user.id !== data[index + 1].user.id || new Date(data[index].id).toDateString() !== new Date(data[index + 1].id).toDateString()} />}
					inverted={true}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Text style={{ color: "#FFFFFF44", fontSize: 20 }}>There's no messages here yet!</Text>
				</View>
			)}
			<View style={{ height: 10 }} />
			<View style={{ width: "95%", marginHorizontal: "auto", marginBottom: 10 }}>
				<AutoExpandingTextInput text={text} setText={setText} onSubmit={() => sendMessage(setText, text, props.activeChannel())} />
			</View>
		</View>
	);
}

const getTime = (timestamp: number) => {
	const date = new Date(timestamp);
	const today = new Date();

	if (date.getDate() == today.getDate()) return `Today at ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

	return `${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + date.getMonth() + 1}/${date.getFullYear()} at ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
};

interface MessageCardProps {
	message: Message;
	isLastInGroup: boolean;
}

const MessageCard = (props: MessageCardProps) => {
	const timestamp = getTime(parseInt(props.message.id));

	const copyToClipboard = async (text: string) => {
		await Clipboard.setStringAsync(text);
	};

	const [hover, setHover] = useState(false);

	return (
		<View
			style={{
				minHeight: 20,
				width: "100%",
				paddingHorizontal: 10,
				paddingTop: props.isLastInGroup ? 2 : 0,
				marginTop: props.isLastInGroup ? 10 : 0,
			}}>
			{props.isLastInGroup ? (
				<View
					style={{
						flexDirection: "row",
						alignItems: "flex-end",
						marginBottom: 5,
					}}>
					<View
						style={{
							width: 30,
							height: 30,
							borderRadius: 20,
							marginRight: 5,
							overflow: "hidden",
						}}>
						{props.message.user.profilePicture ? <Image source={{ uri: `https://api.staryhub.net/users/pfp/${props.message.user.profilePicture}`, width: 30, height: 30 }} /> : null}
					</View>
					<Text style={{ color: "#fff", fontWeight: "500", marginBottom: 5 }}>{props.message.user.username}</Text>
					<Text style={{ color: "#ddd", fontSize: 10, marginBottom: 5 }}> {timestamp}</Text>
				</View>
			) : null}
			<Pressable
				style={{ cursor: "auto" }}
				onLongPress={() => {
					if (Platform.OS != "web") copyToClipboard(props.message.text);
				}}
				onHoverIn={() => {
					setHover(true);
				}}
				onHoverOut={() => {
					setHover(false);
				}}>
				<Text style={{ color: "white", backgroundColor: hover ? "#333" : "transparent" }} selectable>
					{processMessage(props.message.text)}
					<Text style={{ color: hover ? "white" : "#444", fontSize: 10, position: "absolute", right: 5 }}>{new Date(props.message.id).toLocaleTimeString().slice(0, 5)}</Text>
				</Text>
			</Pressable>
		</View>
	);
};

const processMessage = (text: string) => {
	const URL_REGEX = /(http|https|HTTP|HTTPS):\/\/[\w_-]\S*/g;

	const URLs = text.match(URL_REGEX);
	const parts = text.split(" ");
	if (!URLs) return <Text>{text}</Text>;

	let fancyText: React.JSX.Element[] = [];

	// This is a mess...
	parts.forEach((part, index) => {
		if (URLs?.includes(part)) {
			part += " ";
			fancyText.push(
				<Pressable
					key={`link-${index}`}
					onPress={() => {
						Linking.openURL(part.toString());
					}}>
					<Text
						style={{
							color: Colors.dark.secondary,
							textDecorationLine: "underline",
						}}>
						{part}
					</Text>
				</Pressable>,
			);
		} else {
			part += " ";
			fancyText.push(<Text key={`text-${index}`}>{part}</Text>);
		}
	});

	return <Text>{fancyText}</Text>;
};
