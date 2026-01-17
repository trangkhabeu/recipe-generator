import GlobalApi from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import RecipeCardHome from "./RecipeCardHome";

export default function LatestRecipes() {
  const [recipeList, setRecipeList] = useState();

  useEffect(() => {
    GetAllRecipes();
  }, []);

  const GetAllRecipes = async () => {
    const result = await GlobalApi.GetAllRecipesByLimit(10);
    console.log(result.data.data);
    setRecipeList(result.data.data);
  };
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit-bold",
        }}
      >
        LatestRecipes
      </Text>
      <FlatList
        data={recipeList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <RecipeCardHome recipe={item} />
          </View>
        )}
      />
    </View>
  );
}
