import Color from "@/services/Color";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export default function Button({
  label,
  onPress,
  iconName = "",
  loading = false,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Color.PRIMARY,
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <Ionicons name={iconName} size={24} color="white" />
      )}

      <Text
        style={{
          textAlign: "center",
          fontSize: 17,
          fontFamily: "outfit",
          color: Color.WHITE,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
