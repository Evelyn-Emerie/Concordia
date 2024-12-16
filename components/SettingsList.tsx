import { useState } from "react";
import { FlatList, View, Pressable, Text } from "react-native";

type Setting = {
	index: number;
	title: string;
	view: React.JSX.Element;
};

type SettingCategory = { title: string; settings: Setting[] };

export default function SettingsList(props: { selectedIndex: number; setSelectedIndex: Function; settings: SettingCategory[] }) {
	return (
		<FlatList
			data={props.settings}
			renderItem={(item) => {
				return <SettingsCategory key={item.index} title={item.item.title} settings={item.item.settings} selectedIndex={props.selectedIndex} setSelected={props.setSelectedIndex} />;
			}}
		/>
	);
}

const SettingsCategory = (props: { title: string; settings: Setting[]; selectedIndex: number; setSelected: Function }) => {
	return (
		<View style={{ width: 150, paddingHorizontal: 10 }}>
			<Text
				style={{
					color: "#999",
					fontWeight: "600",
					marginBottom: 5,
				}}>
				{props.title}
			</Text>
			{props.settings.map((item, index) => {
				return <SettingsButton key={item.index} title={item.title} index={item.index} selected={item.index == props.selectedIndex} setSelected={props.setSelected} />;
			})}
		</View>
	);
};

const SettingsButton = (props: { title: string; index: number; selected: boolean; setSelected: Function }) => {
	const [hover, SetHover] = useState(false);
	return (
		<Pressable
			onHoverIn={() => {
				SetHover(true);
			}}
			onHoverOut={() => {
				SetHover(false);
			}}
			onPress={() => {
				props.setSelected(props.index);
			}}>
			<View
				style={{
					backgroundColor: props.selected ? "#FFFFFF44" : hover ? "#FFFFFF22" : "transparent",
					width: "100%",
					paddingHorizontal: 10,
					borderRadius: 5,
					marginVertical: 2,
				}}>
				<Text style={{ color: "white", marginVertical: 2 }}>{props.title}</Text>
			</View>
		</Pressable>
	);
};
