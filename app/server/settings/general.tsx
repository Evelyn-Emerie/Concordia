import { View } from "react-native";
import ServerPageLabel from "../../../components/ServerPageLabel";
import Server from "../../../types/server";
import SettingsTextInput from "../../../components/StyledTextInput";

export default function GeneralServerSettings(props: { getServer: Function }) {
	const server: Server = props.getServer();
	console.log(server);

	return (
		<View
			style={{
				flex: 1,
				width: "100%",
			}}>
			<ServerPageLabel title="General" />
			<SettingsTextInput label="Description" width={300} text={server.title} />
		</View>
	);
}
