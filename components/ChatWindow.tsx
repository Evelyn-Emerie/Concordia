import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  Touchable,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AutoExpandingTextInput from "./AutoTextInput";

export type Message = {
  id: string;
  text: string;
};

interface ChatWindowProps {
  newMessage?: Message;
}

export default function ChatWindow(props: ChatWindowProps) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const getMessages = async () => {
    try {
      const response = await fetch("https://api.staryhub.net/messages");
      const json = await response.json();

      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    const message = props.newMessage as Message;
    setData((prevData) => [...prevData, message]);
  }, [props.newMessage]);

  const sendMessage = async () => {
    try {
      setText("");
      await fetch("https://api.staryhub.net/add-message", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginHorizontal: "auto",
      }}
    >
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          style={{ flexDirection: "column-reverse", width: "100%" }}
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <MessageCard id={item.id} text={item.text} />
          )}
        />
      )}
      <View style={{ height: 10 }} />
      <AutoExpandingTextInput
        text={text}
        setText={setText}
        onSubmit={() => sendMessage()}
      />
    </View>
  );
}

const MessageCard = (props: Message) => {
  return (
    <View
      style={{ minHeight: 20, width: "100%", padding: 10, paddingVertical: 2 }}
    >
      <Text style={{ color: "white" }}>{props.text}</Text>
    </View>
  );
};
