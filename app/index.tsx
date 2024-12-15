import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import MainWindow from "./main/main";
import { useEffect, useState } from "react";
import { User } from "@/handlers/storage";
import Loading from "@/components/loading";
import Register from "./register";
import CallWindow from "./call/call";
import * as Network from "expo-network";

export default function Index() {
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	const [isConnected, setIsConnected] = useState<boolean | null>(null);
	useEffect(() => {
		async function load() {
			const user = await User.getUserObject();
			if (user.username.length < 3 || user.password.length < 5) setLoggedIn(false);
			else setLoggedIn(true);
		}
		load();
	}, []);

	useEffect(() => {
		async function checkConnection() {
			try {
				// TODO change to a different website
				const test = await fetch("https://api.ipify.org?format=json", { method: "GET" });
				if (test.status == 200) {
					setIsConnected(true);
				} else setIsConnected(false);
			} catch (e) {
				setIsConnected(false);
			}

			setTimeout(() => {
				checkConnection();
			}, 60 * 1000); // Check internet connection every minute
		}
		checkConnection();
	}, []);

	return (
		<GestureHandlerRootView>
			<SafeAreaView
				style={{
					backgroundColor: Colors.dark.background,
					flex: 1,
				}}>
				{isConnected ? loggedIn == null ? <Loading /> : loggedIn == true ? <MainWindow /> : <Register /> : <Loading />}
				{/* <CallWindow /> */}
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
