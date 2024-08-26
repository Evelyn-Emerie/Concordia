import { Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import Loading from "../../components/loading";

export default function PreloadWindow() {
	return (
		<View style={{ backgroundColor: Colors.dark.background, flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
			<Loading nopad />
			<Text style={{ color: Colors.dark.text, marginTop: 20, fontSize: 20 }}>Concordia is starting...</Text>
		</View>
	);
}
