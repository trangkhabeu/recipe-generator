import Color from "@/services/Color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search recipes...",
}: Props) {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={18} color={Color.GRAY} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.WHITE,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 10,
  },
  input: {
    marginLeft: 8,
    fontFamily: "outfit",
    flex: 1,
  },
});
