import {
  EvilIcons,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { View, Animated, Easing, Pressable, Text, Image } from "react-native";

type Server = {
  id: string;
  name: string;
  iconURI?: string;
};

export default function ServerList() {
  const [selectedId, setSelectedId] = useState("1");
  const serverList: Server[] = [
    {
      id: "1",
      name: "A real server!",
    },
    {
      id: "2",
      name: "SuperCool Server!",
    },
  ];

  const handleServerSelect = (id: string) => {
    setSelectedId(id);
  };

  const router = useRouter();

  return (
    <View style={{ marginHorizontal: 5 }}>
      {serverList.map((server) => {
        return (
          <ServerIcon
            key={server.id}
            onPressed={handleServerSelect}
            id={server.id}
            selected={server.id == selectedId}
            iconURI={server.iconURI}
            name={server.name}
          />
        );
      })}
      <AddServer />
      <View style={{ flex: 1 }} />
      <Pressable
        onPress={() => {
          router.push("/settings");
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            marginBottom: 10,
          }}
        >
          <MaterialIcons name="settings" size={40} color={"#ddd"} />
        </View>
      </Pressable>
    </View>
  );
}

interface ServerIconProps {
  id?: string;
  name: string;
  iconURI?: string;
  selected?: boolean;
  onPressed?: Function;
}

function ServerIcon(props: ServerIconProps) {
  const [hover, setHover] = useState(false);

  const borderRadius = useRef(
    new Animated.Value(props.selected ? 5 : 20)
  ).current;

  const animateBorderRadius = (toValue: number) => {
    Animated.timing(borderRadius, {
      toValue,
      duration: 100, // Adjust the duration as needed
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // Border radius does not support native driver
    }).start();
  };

  useEffect(() => {
    animateBorderRadius(props.selected ? 5 : 20);
  }, [props.selected]);

  return (
    <Pressable
      onPress={() => {
        props.onPressed ? props.onPressed(props.id) : null;
      }}
      onPointerEnter={() => {
        setHover(true);
        animateBorderRadius(props.selected ? 5 : 10);
      }}
      onPointerLeave={() => {
        setHover(false);
        animateBorderRadius(props.selected ? 5 : 20);
      }}
    >
      {hover ? (
        <View
          style={{
            position: "absolute",
            left: 65,
            height: 50, //! Height + MarginTop * 2 === Height Of Server Icon
            marginTop: 5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#101010",
            borderRadius: 10,
            maxWidth: 150,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: -10, // Position the triangle to the left of the view
              width: 0,
              height: 0,
              borderTopWidth: 10,
              borderTopColor: "transparent",
              borderBottomWidth: 10,
              borderBottomColor: "transparent",
              borderRightWidth: 10,
              borderRightColor: "#101010",
              top: "50%",
              marginTop: -5, // Center the triangle vertically
            }}
          />
          <Text
            style={{ color: "white", flexWrap: "nowrap" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {props.name}
          </Text>
        </View>
      ) : null}
      <Animated.View
        style={{
          width: 50,
          height: 50,
          marginVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#323232",
          borderRadius: borderRadius, // Use Animated.Value for smooth transitions
        }}
      >
        {props.iconURI ? (
          <Image source={{ uri: props.iconURI }} />
        ) : (
          <Ionicons name="code" color={"white"} size={25} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function AddServer() {
  return (
    <Pressable onPress={() => {}}>
      <View
        style={{
          width: 50,
          height: 50,
          marginVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#323232",
          borderRadius: 5,
        }}
      >
        <Ionicons name="add-circle-outline" color={"#84ff99"} size={30} />
      </View>
    </Pressable>
  );
}
