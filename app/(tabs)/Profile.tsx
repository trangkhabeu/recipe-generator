import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import { useLogto } from "@logto/rn";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const options = [
    {
      name: "Edit Profile",
      icon: require("../../assets/images/icon/edit.png"),
      path: "/edit-profile",
    },
    {
      name: "My Recipes",
      icon: require("../../assets/images/icon/my-recipe.png"),
      path: "/(tabs)/Cookbook",
    },
    {
      name: "Create New Recipe",
      icon: require("../../assets/images/icon/i1.png"),
      path: "/(tabs)/Home",
    },
    {
      name: "Browse More Recipes",
      icon: require("../../assets/images/icon/exploration.png"),
      path: "/(tabs)/Explore",
    },
    {
      name: "Logout",
      icon: require("../../assets/images/icon/logout.png"),
      path: "logout",
    },
  ];

  const { user, setUser } = useContext(UserContext);
  const { signOut } = useLogto();
  const router = useRouter();

  const onOptionClick = async (option: any) => {
    if (option.path == "logout") {
      await signOut();
      setUser(null);
      router.replace("/");
      return;
    }
    router.push(option.path);
  };

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Color.WHITE,
        padding: 25,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
        }}
      >
        Profile
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <Image
          source={{ uri: user?.picture }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 99,
          }}
        />
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
            marginTop: 20,
          }}
        >
          {user?.name}{" "}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            color: Color.GRAY,
          }}
        >
          {user?.email}{" "}
        </Text>
      </View>
      <FlatList
        data={options}
        style={{
          marginTop: 25,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onOptionClick(item)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              padding: 20,
              borderTopWidth: 1,
              borderBottomWidth: 0.5,
              borderColor: "#e5e5e5d2",
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 40,
                height: 40,
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "outfit",
                marginLeft: 10,
              }}
            >
              {item.name}{" "}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
