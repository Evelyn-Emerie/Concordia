import { Text } from "react-native";

export default function ServerPageLabel(props: { title: string }) {
  return (
    <Text
      style={{
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 30,
        marginBottom: 20,
      }}
    >
      {props.title}
    </Text>
  );
}
