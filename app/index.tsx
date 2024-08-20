import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MainWindow from "../components/MainWindow";

export default function Index() {
  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          backgroundColor: "#161616",
          flex: 1,
        }}
      >
        <MainWindow />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
