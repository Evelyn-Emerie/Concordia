import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import MainWindow from "./main/main";
import { useEffect, useState } from "react";
import { User } from "@/handlers/storage";
import Loading from "@/components/loading";
import Register from "./register";

export default function Index() {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	useEffect(() => {
		async function load() {
			const user = await User.getUserObject();
			if (user.username.length < 3 || user.password.length < 5) setLoggedIn(false);
			else setLoggedIn(true);
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
				{loggedIn == null ? <Loading /> : loggedIn == true ? <MainWindow /> : <Register />}
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
