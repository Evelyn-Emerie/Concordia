import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MainWindow from "../components/MainWindow";
import { Colors } from "../constants/Colors";
import { useEffect, useState } from "react";
import PreloadWindow from "./preload/preload";
import { LocalSettings, storeUser, Token } from "../handlers/storage";
import LoginWindow from "./login/login";

const loadUser = async (setResult: Function) => {
	const token = await Token.getToken();

	if (!token) return setResult(1);
	try {
		const [response, settings] = await Promise.all([
			// Load user
			fetch("https://api.staryhub.net/users/:id", {
				headers: {
					accesstoken: token,
				},
			}),
			// Load settings
			LocalSettings.get(),
		]);

		// Load the user
		const user = await response.json();
		storeUser(user);

		// Finish loading
		setResult(2);
	} catch (e) {
		setResult(1);
		console.error(e);
	}
};

export default function Index() {
	// 0 - Loading
	// 1 - No user
	// 2 - Loaded
	const [result, setResult] = useState(0);

	useEffect(() => {
		loadUser(setResult);
	}, []);

	if (result == 0) return <PreloadWindow />;

	if (result == 1) return <LoginWindow />;

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
