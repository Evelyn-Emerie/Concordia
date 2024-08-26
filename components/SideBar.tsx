import { View, Text } from "react-native";
import ChannelList, { Channel } from "./ChannelList";
import ServerList, { Server } from "./ServerList";

interface SideBarProps {
	selectedChannel?: Channel;
	setSelectedChannel: Function;
	server?: Server;
	setSelectedServer: Function;
}

export default function SideBar(props: SideBarProps) {
	return (
		<View
			style={{
				flexDirection: "row-reverse",
				width: 235,
				height: "100%",
			}}>
			{props.server ? (
				<ChannelList selected={props.selectedChannel} setSelected={props.setSelectedChannel} server={props.server} />
			) : (
				<View style={{ width: "100%", flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text style={{ color: "white" }}>No channels</Text>
				</View>
			)}
			<ServerList setServer={props.setSelectedServer} selectedServer={props.server} />
		</View>
	);
}
