import { useState, useEffect } from "react";
import { View, FlatList, Pressable, Text } from "react-native";

interface ChanneListProps {
  selected: Function;
  setSelected: Function;
  setTitle: Function;
}

export default function ChannelList(props: ChanneListProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const getChannels = async () => {
    const request = await fetch("https://api.staryhub.net/get-channels");
    const json = (await request.json()) as Channel[];

    setChannels(json);
    props.setTitle(json[0].title);
  };

  useEffect(() => {
    getChannels();
  }, []);

  const handleChange = (id: number) => {
    props.setSelected(id);
    props.setTitle(channels[id].title);
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
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>A real server!</Text>
      </View>
      {channels ? (
        <FlatList
          data={channels}
          renderItem={(item) => {
            return (
              <ChannelCard
                channel={item.item}
                selected={item.item.id == props.selected()}
                onPress={handleChange}
              />
            );
          }}
        />
      ) : null}
    </View>
  );
}

export type Channel = {
  id: number;
  title: string;
};

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
      }}
    >
      <View
        style={{
          backgroundColor: props.selected ? "#FFFFFF22" : "transparent",
          marginVertical: 2,
          paddingVertical: 2,
          paddingHorizontal: 10,
          borderRadius: 2,
          width: 150,
        }}
      >
        <Text style={{ color: "white" }}># {props.channel.title}</Text>
      </View>
    </Pressable>
  );
};
