import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { useEffect, useState } from "react";
import PreloadWindow from "./preload/preload";
import { LocalSettings, storeUser, Token } from "../handlers/storage";
import LoginWindow from "./login/login";
import MainWindow from "./main/main";

const loadUser = async (setResult: Function) => {
	const token = await Token.getToken();

	if (!token) return setResult(1);
	setResult(2);
};

export default function Index() {
	// 0 - Loading
	// 1 - No user
	// 2 - Loaded
	const [result, setResult] = useState(0);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		loadUser(setResult);
		setReload(false);
	}, [reload]);

	if (result == 0) return <PreloadWindow />;

	if (result == 1)
		return (
			<GestureHandlerRootView>
				<SafeAreaView
					style={{
						backgroundColor: Colors.dark.background,
						flex: 1,
					}}>
					<LoginWindow requestReload={setReload} />
				</SafeAreaView>
			</GestureHandlerRootView>
		);

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
