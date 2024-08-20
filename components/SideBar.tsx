import { View } from "react-native";
import ChannelList from "./ChannelList";
import ServerList from "./ServerList";

interface SideBarProps {
  selectedChannel: Function;
  setSelectedChannel: Function;
  setTitle: Function;
}

export default function SideBar(props: SideBarProps) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        width: 235,
        height: "100%",
      }}
    >
      <ChannelList
        selected={props.selectedChannel}
        setSelected={props.setSelectedChannel}
        setTitle={props.setTitle}
      />
      <ServerList />
    </View>
  );
}
