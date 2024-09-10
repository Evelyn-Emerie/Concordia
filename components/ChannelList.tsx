import { useState, useEffect } from "react";
import { View, FlatList, Pressable, Text } from "react-native";
import User from "../types/user";
import Server from "../types/server";
import Channel from "../types/channel";

interface ChanneListProps {
	selected?: Channel;
	setSelected: Function;
	server: Server;
	user?: User;
}

export default function ChannelList(props: ChanneListProps) {
	const [channels, setChannels] = useState<Channel[]>([]);
	const getChannels = async () => {
		const request = await fetch(`${props.server.ip}/channels/get`);
		const json = (await request.json()) as Channel[];

		setChannels(json);
		if (json.length > 0) props.setSelected(json[0]);
	};

	useEffect(() => {
		getChannels();
	}, []);

	const handleChange = (channel: Channel) => {
		props.setSelected(channel);
	};

	return (
		<View style={{ paddingHorizontal: 10 }}>
			<View
				style={{
					height: 50,
					borderBottomColor: "white",
					justifyContent: "center",
					marginBottom: 10,
					marginLeft: 5,
					width: 200,
				}}>
				<Text style={{ color: "white", fontSize: 24 }}>{props.server.title}</Text>
			</View>
			{channels ? (
				<FlatList
					data={channels}
					renderItem={(item) => {
						return (
							<ChannelCard
								channel={item.item}
								selected={item.item.id == props.selected?.id}
								onPress={() => {
									handleChange(item.item);
								}}
							/>
						);
					}}
				/>
			) : null}
		</View>
	);
}

interface ChannelCardProps {
	channel: Channel;
	selected?: boolean;
	onPress: Function;
}

const ChannelCard = (props: ChannelCardProps) => {
	return (
		<Pressable
			onPress={() => {
				props.onPress(props.channel.id);
			}}>
			<View
				style={{
					backgroundColor: props.selected ? "#FFFFFF22" : "transparent",
					marginVertical: 2,
					paddingVertical: 2,
					paddingHorizontal: 10,
					borderRadius: 2,
					width: 150,
				}}>
				<Text style={{ color: "white" }}># {props.channel.title}</Text>
			</View>
		</Pressable>
	);
};
