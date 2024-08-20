import { View, Text } from "react-native";

export default function TestPage() {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>Test Page!</Text>
    </View>
  );
}
