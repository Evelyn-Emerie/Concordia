import { View, Text } from "react-native";
import ChannelList, { Channel } from "./ChannelList";
import ServerList, { Server } from "./ServerList";
import { UserType } from "@/handlers/storage";
import UserCard from "./UserCard";

interface SideBarProps {
	selectedChannel?: Channel;
	setSelectedChannel: Function;
	server?: Server;
	setSelectedServer: Function;
	user?: UserType;
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
