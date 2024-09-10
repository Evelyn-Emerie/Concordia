import { View, Text } from "react-native";
import ChannelList from "./ChannelList";
import ServerList from "./ServerList";
import UserCard from "./UserCard";
import T_Channel from "../types/channel";
import T_Server from "../types/server";
import T_User from "../types/user";

interface SideBarProps {
	selectedChannel?: T_Channel;
	setSelectedChannel: Function;
	server?: T_Server;
	setSelectedServer: Function;
	user?: T_User;
}

export default function SideBar(props: SideBarProps) {
	return (
		<View
			style={{
				width: 285,
				height: "100%",
			}}>
			<View style={{ flexDirection: "row-reverse", width: "100%", flex: 1 }}>
				{props.server ? (
					<ChannelList selected={props.selectedChannel} setSelected={props.setSelectedChannel} server={props.server} user={props.user} />
				) : (
					<View
						style={{
							width: "100%",
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Text style={{ color: "white" }}>No channels</Text>
					</View>
				)}
				<ServerList setServer={props.setSelectedServer} selectedServer={props.server} />
			</View>
			<UserCard user={props.user} />
		</View>
	);
}
