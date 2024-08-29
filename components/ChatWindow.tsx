import React, { useEffect, useRef, useState } from "react";
import { Image, Linking, Platform, Pressable, Text, useWindowDimensions, View, FlatList } from "react-native";
import * as Clipboard from "expo-clipboard";
import AutoExpandingTextInput from "./AutoTextInput";
import Loading from "../components/loading";
import { getMessages, sendMessage } from "../handlers/chat";
import { Colors } from "../constants/Colors";
import { Server } from "./ServerList";
import { Channel } from "./ChannelList";
import { Secrets } from "@/constants/Secrets";

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
	const { height } = useWindowDimensions();
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<Message[]>([]);
	const [text, setText] = useState("");
	const superRef = useRef(null);

	const getData = async () => {
		if (props.activeChannel) setData(await getMessages(props.activeChannel.id, props.server as Server));
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
		<View style={{ flex: 1, width: "100%" }}>
			<View style={{ height: 50, backgroundColor: Colors.dark.background, justifyContent: "center", paddingHorizontal: 20 }}>
				<Text style={{ color: "white", fontSize: 18 }}>{props.activeChannel.title}</Text>
			</View>
			<View style={{ flex: 1 }} />
			{isLoading ? (
				<Loading />
			) : data.length > 0 ? (
				<View style={{ maxHeight: height - 120 }}>
					<FlatList
						ref={superRef}
						style={{ width: "98%", marginHorizontal: "auto" }}
						data={[...data].reverse()}
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
							return { length: 100, offset: 5000 * index, index };
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
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
	if (!props.message) return null;

	const timestamp = getTime(parseInt(props.message.id));
	const copyToClipboard = async (text: string) => await Clipboard.setStringAsync(text);
	const [hover, setHover] = useState(false);

	return (
		<View style={{ minHeight: 20, width: "100%", paddingHorizontal: 10, paddingTop: props.isLastInGroup ? 2 : 0, marginTop: props.isLastInGroup ? 10 : 0 }}>
			{props.isLastInGroup && (
				<View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 5 }}>
					<View style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5, overflow: "hidden" }}>{props.message.user.profilePicture ? <Image source={{ uri: `${props.server.ip}/users/pfp/${props.message.user.profilePicture}`, width: 30, height: 30 }} /> : null}</View>
					<Text style={{ color: "#fff", fontWeight: "500", marginBottom: 5 }}>{props.message.user.nickname ?? props.message.user.username}</Text>
					<Text style={{ color: "#ddd", fontSize: 10, marginBottom: 5 }}> {timestamp}</Text>
				</View>
			)}
			<Pressable style={{ cursor: "auto" }} onLongPress={() => Platform.OS != "web" && copyToClipboard(props.message.text)} onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)}>
				<Text style={{ color: "white", backgroundColor: hover ? "#333" : "transparent", position: "relative", userSelect: "text" }}>
					<ProcessedMessage text={props.message.text} />
					{hover && <Text style={{ color: "white", fontSize: 10, position: "absolute", right: 5 }}>{new Date(props.message.id).toLocaleTimeString().slice(0, 5)}</Text>}
				</Text>
			</Pressable>
		</View>
	);
};

interface ProcessedMessageProps {
	text: string;
}

const ProcessedMessage = ({ text }: ProcessedMessageProps) => {
	const URL_REGEX = /(http|https|HTTP|HTTPS):\/\/[\w_-]\S*/g;
	const [gifUrl, setGifUrl] = useState<string | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		const fetchGif = async (id: string) => {
			try {
				const response = await fetch(`https://tenor.googleapis.com/v2/posts?key=${Secrets.Tenor}&media_filter=gif&ids=${id}`);
				const json = await response.json();
				setGifUrl(json.results[0].media_formats.gif.url);
			} catch (e) {
				setError(true);
			}
		};

		if (text.includes("[gif](")) {
			const id = text.split("(")[1].split(")")[0];
			fetchGif(id);
		}
	}, [text]);

	if (gifUrl) {
		return <Image source={{ uri: gifUrl }} style={{ width: 200, height: 200, marginTop: 2, marginLeft: 2, borderRadius: 5 }} />;
	}

	if (error) {
		return <Text style={{ color: "red" }}>Failed to load gif</Text>;
	}

	const URLs = text.match(URL_REGEX);
	const parts = text.split(" ");

	if (!URLs) return <Text>{text}</Text>;

	return (
		<Text>
			{parts.map((part, index) =>
				URLs.includes(part) ? (
					<Pressable key={`link-${index}`} onPress={() => Linking.openURL(part)}>
						<Text style={{ color: Colors.dark.secondary, textDecorationLine: "underline" }}>{part + " "}</Text>
					</Pressable>
				) : (
					<Text key={`text-${index}`}>{part + " "}</Text>
				),
			)}
		</Text>
	);
};
