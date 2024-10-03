import { View, FlatList, Pressable, Text } from "react-native";
import User from "../types/user";
import Server from "../types/server";
import Channel from "../types/channel";
import { useEffect, useState } from "react";

interface ChanneListProps {
	selected?: Channel;
	setSelected: Function;
	server: Server;
	user?: User;
}

export default function ChannelList(props: ChanneListProps) {
	const [channels, setChannels] = useState<Channel[]>(props.server.channels ?? []);

	const getChannels = async () => {
		try {
			const request = await fetch(`${props.server.ip}/channels/get`);
			const json = (await request.json()) as Channel[];

			setChannels(json);
			if (json.length > 0) props.setSelected(json[0]);
		} catch (e) {
			setChannels([]);
		}
	};

	useEffect(() => {
		getChannels();
	}, [props.server]);

	const handleChange = (channel: Channel) => {
		props.setSelected(channel);
	};

	return (
		<View style={{ paddingHorizontal: 5, flex: 1 }}>
			<View
				style={{
					height: 50,
					borderBottomColor: "white",
					justifyContent: "center",
					marginBottom: 10,
					marginLeft: 5,
				}}>
				<Text style={{ color: "white", fontSize: 24 }}>{props.server.title}</Text>
			</View>
			{channels.length > 0 ? (
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
			) : (
				<View style={{ justifyContent: "center", alignItems: "center", flex: 1, width: "100%" }}>
					<Text style={{ color: "white" }}>No channel found</Text>
				</View>
			)}
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
