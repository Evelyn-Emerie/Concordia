import { Animated, Dimensions, Image, Linking, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AutoExpandingTextInput from "./AutoTextInput";
import { getMessages, sendMessage } from "../handlers/chat";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "../constants/Colors";
import * as Clipboard from "expo-clipboard";
import Loading from "./loading";
import { Server } from "./ServerList";
import { Channel } from "./ChannelList";

export type Message = {
	id: string;
	text: string;
	channel: number;
	user: User;
};

type User = {
	id: string;
	nickname?: string;
	username: string;
	profilePicture?: string;
};

interface ChatWindowProps {
	newMessage?: Message;
	activeChannel?: Channel;
	server?: Server;
}

export default function ChatWindow(props: ChatWindowProps) {
	const { height, width } = useWindowDimensions();
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<Message[]>([]);
	const [text, setText] = useState("");
	const superRef = useRef(null);

	const getData = async () => {
		if (props.activeChannel) setData(await getMessages(props.activeChannel!.id, props.server as Server));
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

	useEffect(() => {
		if (superRef.current) {
			//@ts-ignore
			// ts is being retarded idfk
			superRef.current?.scrollToEnd({ animated: false });
		}
	}, [data]);

	if (!props.server)
		return (
			<View style={{ justifyContent: "center", alignContent: "center", width: "100%", flex: 1 }}>
				<Text style={{ color: "white", textAlign: "center" }}>No selected server</Text>
			</View>
		);

	if (!props.activeChannel)
		return (
			<View style={{ justifyContent: "center", alignContent: "center", width: "100%", flex: 1 }}>
				<Text style={{ color: "white", textAlign: "center" }}>No selected channel</Text>
			</View>
		);

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
			}}>
			<View
				style={{
					height: 50,
					backgroundColor: Colors.dark.background,
					justifyContent: "center",
					paddingHorizontal: 20,
				}}>
				<Text style={{ color: "white", fontSize: 18 }}>{props.activeChannel.title}</Text>
			</View>
			<View style={{ flex: 1 }} />
			{isLoading ? (
				<Loading />
			) : data.length > 0 ? (
				<View style={{ maxHeight: height - 120 }}>
					<FlatList
						ref={superRef}
						style={{
							width: "98%",
							marginHorizontal: "auto",
						}}
						data={[...data].reverse()}
						// ListHeaderComponent={<Text style={{ color: "white", fontSize: 30, fontWeight: "600", marginTop: height - 60 }}>Start of the channel {props.activeChannel.title}</Text>}
						renderItem={({ item, index }) => {
							let isLastInGroup = true;
							if (index > 0) {
								const previousItem = data[data.length - 1 - index]; // Adjust index for reversed array
								const currentItem = data[data.length - index];

								const sameDay = new Date(data[data.length - index].id).toLocaleDateString() == new Date(data[data.length - 1 - index].id).toLocaleDateString(); // same day?
								isLastInGroup = currentItem.user.id != previousItem.user.id || !sameDay;
							}
							return <MessageCard message={item} index={index} isLastInGroup={isLastInGroup} server={props.server as Server} />;
						}}
						refreshing={true}
						onStartReached={() => {
							console.log("end!");
							// TODO implement loading more messages when reaching end
						}}
						getItemLayout={(data, index) => {
							return { length: 100, offset: 5000 * index, index }; // ? Any better method to make it scroll to the bottom at start without (too) much visual stuff?
						}}
						initialScrollIndex={data.length > 0 ? data.length - 1 : 0}
						initialNumToRender={40} // Render all 40 messages given by server
						onScrollToIndexFailed={(e) => {
							console.error(e);
						}}
						showsVerticalScrollIndicator={false}
					/>
				</View>
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
				<AutoExpandingTextInput charLimit={300} text={text} setText={setText} onSubmit={() => sendMessage(setText, text, props.activeChannel!.id, props.server as Server)} />
			</View>
		</View>
	);
}

const getTime = (timestamp: number) => {
	const date = new Date(timestamp);
	const today = new Date();

	if (date.getDate() == today.getDate()) return `Today at ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

	return `${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)}/${date.getFullYear()} at ${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
};

interface MessageCardProps {
	message: Message;
	isLastInGroup: boolean;
	server: Server;
	index?: number;
}

const MessageCard = (props: MessageCardProps) => {
	if (!props.message) return;

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
						{props.message.user.profilePicture ? <Image source={{ uri: `${props.server.ip}/users/pfp/${props.message.user.profilePicture}`, width: 30, height: 30 }} /> : null}
					</View>
					<Text style={{ color: "#fff", fontWeight: "500", marginBottom: 5 }}>{props.message.user.nickname ?? props.message.user.username}</Text>
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
				<Text style={{ color: "white", backgroundColor: hover ? "#333" : "transparent", position: "relative", userSelect: "text" }}>
					{processMessage(props.message.text)}
					{hover ? <Text style={{ color: "white", fontSize: 10, position: "absolute", right: 5 }}>{new Date(props.message.id).toLocaleTimeString().slice(0, 5)}</Text> : null}
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
