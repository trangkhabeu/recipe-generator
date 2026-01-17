import Color from "@/services/Color";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function RecipeSteps({ steps }: any) {
  const getStepText = (item: any) => {
    if (typeof item === "string") {
      return item;
    }

    if (typeof item === "object" && item !== null) {
      if (item.instruction) {
        return item.instruction;
      }
      if (item.step) {
        return item.step;
      }
    }

    return "";
  };
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
        }}
      >
        RecipeSteps
      </Text>

      <FlatList
        data={steps}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              marginTop: 6,
              padding: 10,
              borderRadius: 15,
              borderWidth: 0.2,
              flex: 1,
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  padding: 10,
                  width: 40,
                  textAlign: "center",
                  backgroundColor: Color.SECONDARY,
                  borderRadius: 7,
                },
              ]}
            >
              {index + 1}{" "}
            </Text>
            <Text style={[styles.text, { flex: 1 }]}>
              {" "}
              {getStepText(item)}{" "}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontFamily: "outfit",
    fontSize: 18,
  },
});
