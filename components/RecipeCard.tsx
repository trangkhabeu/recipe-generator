import Color from "@/services/Color";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecipeCard({ recipe }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/recipe-detail",
          params: {
            recipeData: JSON.stringify(recipe),
          },
        })
      }
      style={{
        margin: 5,
      }}
    >
      <Image
        source={{ uri: recipe.recipeImage }}
        style={{
          width: "100%",
          height: 220,
          borderRadius: 20,
        }}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          padding: 10,
          width: "100%",
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <View>
          <Text style={styles.textRecipe}>{recipe?.recipeName} </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textRecipe: {
    color: Color.WHITE,
    fontFamily: "outfit",
    fontSize: 16,
  },
});
