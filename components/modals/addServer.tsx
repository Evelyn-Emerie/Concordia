import { useState } from "react";
import { Modal, Text, View } from "react-native";

const [modalVisible, setModalVisible] = useState(false);

export default function AddServerModal() {
	return (
		<Modal
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(false);
			}}>
			<View>
				<Text>Hello World!</Text>
			</View>
		</Modal>
	);
}

export function showModal() {
	setModalVisible(true);
}
