import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MainWindow from "../components/MainWindow";
import { Colors } from "../constants/Colors";

export default function Index() {
	return (
		<GestureHandlerRootView>
			<SafeAreaView
				style={{
					backgroundColor: Colors.dark.background,
					flex: 1,
				}}>
				<MainWindow />
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
