import { UserContext } from "@/context/UserContext";
import React, { useContext, useState } from "react";
import { Image, Text, View } from "react-native";

export default function IntroHeader() {
  const { user } = useContext(UserContext);
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 5,
        }}
      >
        <Image
          source={{ uri: user?.picture }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 100,
          }}
        />
        <Text
          style={{
            fontFamily: "outfit-bold",
          }}
        >
          Hello, {user?.name}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* <Switch
          value={isEnabled}
          onValueChange={() => setIsEnabled(!isEnabled)}
        />
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 16,
          }}
        >
          {isEnabled ? "Vegetarian" : "Non-Vegetarian"}
        </Text> */}
      </View>
    </View>
  );
}
