import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import MainWindow from "./main/main";
import { useEffect } from "react";
import { LocalSettings } from "@/handlers/storage";

export default function Index() {
	useEffect(() => {
		async function load() {
			const settings = await LocalSettings.get();
			console.log(settings);
		}
		load();
	}, []);
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
