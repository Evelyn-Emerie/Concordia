import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MainWindow from "../components/MainWindow";
import { storeToken, storeUser, Token } from "../handlers/storage";

const loadUser = async () => {
	const token = await Token.getToken();
	try {
		const response = await fetch("https://api.staryhub.net/users/:id", {
			headers: {
				accesstoken: token,
			},
		});

		const user = await response.json();

		storeUser(user);

		console.log(user);
	} catch (e) {
		console.error(e);
	}
};

export default function Index() {
	loadUser();
	return (
		<GestureHandlerRootView>
			<SafeAreaView
				style={{
					backgroundColor: "#161616",
					flex: 1,
				}}>
				<MainWindow />
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
