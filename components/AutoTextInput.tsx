import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, TextInput, Pressable, Platform } from "react-native";

interface AutoTextInputProps {
  text: string;
  setText: Function;
  onSubmit: Function;
}

export default function AutoExpandingTextInput(props: AutoTextInputProps) {
  const [inputHeight, setInputHeight] = useState(16);

  const keyValue = "Enter";

  return (
    <View
      style={{
        backgroundColor: "#424242",
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: inputHeight,
          color: "white",
          // @ts-ignore
          outlineStyle: "none", //! Purely for WEB only
          fontSize: 14,
        }}
        value={props.text}
        onKeyPress={(event) => {
          //! Purely for WEB only
          if (Platform.OS != "web") return;
          // @ts-ignore
          if (!event.shiftKey && event.code == "Enter") {
            //If not pressing shift + Enter but ONLY Enter
            event.preventDefault(); // Prevent space being added to text input
            if (props.text.trim().length > 0) {
              // If there is more inside the string than whitespace characters
              props.onSubmit(); // Send the message
            }
          }
        }}
        textAlignVertical="center"
        placeholder="Type a message here..."
        placeholderTextColor={"#626262"}
        underlineColorAndroid={"transparent"}
        onChangeText={(text) => {
          const textLines = text.split("\n").length; // Calculate amount of lines
          setInputHeight(textLines * 16);
          props.setText(text); //Updated the text to reflect changes
        }}
        multiline={true}
      />
      <Pressable
        onPress={() => {
          if (props.text.length < 1) return;
          props.onSubmit(); // Send the message
          setInputHeight(16);
        }}
      >
        <Ionicons
          name="arrow-forward-circle-outline"
          color={"white"}
          size={20}
        />
      </Pressable>
    </View>
  );
}
