import RecipeCard from "@/components/RecipeCard";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function RecipeByCategory() {
  const { categoryName } = useLocalSearchParams();
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);

  console.log(categoryName);

  useEffect(() => {
    GetRecipeListByCategory();
  }, []);

  const GetRecipeListByCategory = async () => {
    setLoading(true);
    const result = await GlobalApi.GetRecipeByCategory(categoryName as string);
    console.log(result.data.data);
    setRecipeList(result?.data.data);
    setLoading(false);
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 65,
        backgroundColor: Color.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 25,
        }}
      >
        Brown {categoryName} Recipes{" "}
      </Text>

      <FlatList
        data={recipeList}
        numColumns={2}
        refreshing={loading}
        onRefresh={GetRecipeListByCategory}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <RecipeCard recipe={item} />
          </View>
        )}
      />
    </View>
  );
}
