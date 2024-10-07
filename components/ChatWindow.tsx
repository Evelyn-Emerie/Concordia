import React, { useEffect, useRef, useState, memo } from "react";
import { Linking, Platform, Pressable, Text, useWindowDimensions, View, FlatList, Image, Dimensions, ScaledSize } from "react-native";
import * as Clipboard from "expo-clipboard";
import AutoExpandingTextInput from "./AutoTextInput";
import Loading from "../components/loading";
import { getMessages, sendMessage } from "../handlers/chat";
import { Colors } from "../constants/Colors";
import Server from "../types/server";
import Channel from "../types/channel";
import { Image as ExpoImage } from "expo-image";
import T_Gif from "../types/gif";
import T_User from "@/types/user";
import { User } from "@/handlers/storage";

export type Message = {
	id: string;
	text: string;
	channel: number;
	user: Member;
};

type Member = {
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
	const dimensions = Dimensions.get("window");
	const { height } = useWindowDimensions();
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<Message[]>([]);
	const [text, setText] = useState("");
	const [user, setUser] = useState<T_User | null>(null);
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

	useEffect(() => {
		const getUser = async () => {
			const user = await User.getUserObject();
			setUser(user);
		};
		getUser();
	}, []);

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
			{isLoading || !user ? (
				<Loading />
			) : data.length > 1 ? (
				<View style={{ flex: 1 }}>
					<FlatList
						ref={superRef}
						style={{ width: "98%", marginHorizontal: "auto" }}
						data={[...data].reverse()}
						keyExtractor={(item) => item.id}
						renderItem={({ item, index }) => {
							let isLastInGroup = true;
							try {
								if (index > 0) {
									const previousItem = data[data.length - 1 - index]; // Adjust index for reversed array
									const currentItem = data[data.length - index];

									const sameDay = new Date(data[data.length - index].id).toLocaleDateString() == new Date(data[data.length - 1 - index].id).toLocaleDateString(); // same day?
									isLastInGroup = currentItem.user.id != previousItem.user.id || !sameDay;
								}
							} catch (e) {
								isLastInGroup = true;
							}

							return <MessageCard user={user} message={item} index={index} isLastInGroup={isLastInGroup} server={props.server as Server} dimensions={dimensions} />;
						}}
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
			<View style={{ width: "95%", marginHorizontal: "auto", maxHeight: 100 }}>
				<AutoExpandingTextInput server={props.server} charLimit={300} text={text} setText={setText} onSubmit={() => sendMessage(setText, text, props.activeChannel!.id, props.server as Server)} />
			</View>
			<View style={{ height: 10 }} />
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
	dimensions: ScaledSize;
	user: T_User;
}

const MessageCard = memo((props: MessageCardProps) => {
	if (!props.message) return null;

	const timestamp = getTime(parseInt(props.message.id));
	const copyToClipboard = async (text: string) => await Clipboard.setStringAsync(text);
	const [hover, setHover] = useState(false);

	const isMentioned = props.message.text.match(new RegExp(`@${props.user.username}\\b`, "g"));

	return (
		<View style={{ minHeight: 20, width: "100%", paddingHorizontal: 10, paddingTop: props.isLastInGroup ? 2 : 0, marginTop: props.isLastInGroup ? 10 : 0 }}>
			{props.isLastInGroup && (
				<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
					<View style={{ width: 30, height: 30, borderRadius: 20, marginRight: 5, overflow: "hidden" }}>{props.message.user.profilePicture ? <Image source={{ uri: `${props.server.ip}/users/pfp/${props.message.user.profilePicture}`, width: 30, height: 30 }} /> : null}</View>
					<Text style={{ color: "#fff", fontWeight: "500", marginBottom: 5 }}>{props.message.user.nickname ?? props.message.user.username}</Text>
					<Text style={{ color: "#ddd", fontSize: 10, marginBottom: 5 }}> {timestamp}</Text>
				</View>
			)}
			<Pressable style={{ cursor: "auto" }} onLongPress={() => Platform.OS != "web" && copyToClipboard(props.message.text)} onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)}>
				<Text style={{ color: "white", backgroundColor: isMentioned ? `${Colors.dark.secondary}77` : hover ? "#333" : "transparent", position: "relative", userSelect: "text", padding: 2, borderRadius: 3 }}>
					<ProcessedMessage text={props.message.text} server={props.server} dimensions={props.dimensions} />
					{hover && <Text style={{ color: "white", fontSize: 10, position: "absolute", right: 5 }}>{new Date(props.message.id).toLocaleTimeString().slice(0, 5)}</Text>}
				</Text>
			</Pressable>
		</View>
	);
});

interface ProcessedMessageProps {
	text: string;
	server: Server;
	dimensions: ScaledSize;
}

const ProcessedMessage = memo((props: ProcessedMessageProps) => {
	const URL_REGEX = /(http|https|HTTP|HTTPS):\/\/[\w_-]\S*/g;
	const [gif, setGif] = useState<T_Gif | null>(null);

	useEffect(() => {
		const match = props.text.match(/\[gif]\(([^)]+)\)(\d+);(\d+)/);

		if (match)
			setGif({
				source: match[1],
				height: Number(match[2]),
				width: Number(match[3]),
			});
	}, [props.text, props.server, !gif]);

	if (gif) {
		let width = 250,
			height = 250;
		if (gif.width && gif.height) {
			let limit = 50;
			if (Platform.OS == "web") limit = 250;
			if (gif.width > props.dimensions.width - limit) {
				width = props.dimensions.width - limit;
				const aspectRatio = gif.height / gif.width;
				height = width * aspectRatio;
			} else {
				width = gif.width;
				height = gif.height;
			}
		}
		return <ExpoImage source={{ uri: gif.source }} cachePolicy={"memory"} contentFit="fill" style={{ width: width, height: height, marginTop: 0, marginLeft: 5, marginBottom: 5, borderRadius: 5 }} />;
	}

	const URLs = props.text.match(URL_REGEX);
	const parts = props.text.split(" ");

	if (!URLs) return <Text>{props.text}</Text>;

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
});
