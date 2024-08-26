import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function LoginWindow() {
	let data: string[] = [];

	for (let i = 0; i < 100; i++) data.push(`${i}`);

	return (
		<FlatList
			data={data}
			renderItem={({ item, index }) => {
				return <Text style={{ color: "white" }}>{item}</Text>;
			}}
		/>
	);
}
