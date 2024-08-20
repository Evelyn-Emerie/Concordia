import { ActivityIndicator, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AutoExpandingTextInput from "./AutoTextInput";
import { getMessages, sendMessage } from "../handlers/chat";
import { FlatList, ScrollView } from "react-native-gesture-handler";

export type Message = {
  [x: string]: {};
  id: string;
  text: string;
  channel: number;
  user: User;
};

type User = {
  id: string;
  username: string;
};

interface ChatWindowProps {
  newMessage?: Message;
  activeChannel: Function;
  title: string;
  userID: string;
}

export default function ChatWindow(props: ChatWindowProps) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const getData = async () => {
    setData(await getMessages(props.activeChannel()));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getData();
  }, [props.activeChannel]);

  useEffect(() => {
    const message = props.newMessage as Message;
    setData((prevData) => [message, ...prevData]);
  }, [props.newMessage]);

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#111111",
      }}
    >
      <View
        style={{
          height: 50,
          backgroundColor: "#161616",
          justifyContent: "center",
          paddingHorizontal: 20,
          borderBottomWidth: 2,
          borderBottomColor: "#444",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>{props.title}</Text>
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : data.length > 0 ? (
        <FlatList
          style={{
            width: "99%",
            marginHorizontal: "auto",
          }}
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item, index }) => (
            <MessageCard
              message={item}
              isLastInGroup={
                index === data.length - 1 ||
                data[index].user.id !== data[index + 1].user.id
              }
            />
          )}
          inverted={true}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF44", fontSize: 20 }}>
            There's no messages here yet!
          </Text>
        </View>
      )}
      <View style={{ height: 10 }} />
      <View
        style={{ width: "95%", marginHorizontal: "auto", marginBottom: 10 }}
      >
        <AutoExpandingTextInput
          text={text}
          setText={setText}
          onSubmit={() => sendMessage(setText, text, props.activeChannel())}
        />
      </View>
    </View>
  );
}

const getTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();

  if (date.getDate() == today.getDate())
    return `Today at ${
      date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
    }:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

  return `${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}/${
    date.getMonth() > 9 ? date.getMonth() : "0" + date.getMonth()
  }/${date.getFullYear()} at ${
    date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  }:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
};

interface MessageCardProps {
  message: Message;
  isLastInGroup: boolean;
}

const MessageCard = (props: MessageCardProps) => {
  const timestamp = getTime(parseInt(props.message.id));
  return (
    <View
      style={{
        minHeight: 20,
        width: "100%",
        padding: 10,
        paddingVertical: 2,
        marginVertical: 2,
      }}
    >
      {props.isLastInGroup ? (
        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              marginRight: 5,
              backgroundColor: "white",
            }}
          />
          <Text style={{ color: "#fff", fontWeight: "500" }}>
            {props.message.user.username}
          </Text>
          <Text style={{ color: "#ddd", fontSize: 10 }}> {timestamp}</Text>
        </View>
      ) : null}

      <Text style={{ color: "white", marginLeft: 10 }} selectable>
        {props.message.text}
      </Text>
    </View>
  );
};
