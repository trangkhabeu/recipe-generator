import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function Explore() {
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);

  useEffect(() => {
    GetAllRecipes();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchText.trim()) {
        setFilteredRecipes([]);
        return;
      }

      try {
        const res = await GlobalApi.SearchRecipe(searchText);
        setFilteredRecipes(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchText]);

  const GetAllRecipes = async () => {
    setLoading(true);
    const result = await GlobalApi.GetAllRecipeList();
    console.log(result.data.data);
    setRecipeList(result.data.data);
    setLoading(false);
  };

  const displayData = searchText.trim() ? filteredRecipes : recipeList;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: Color.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
        }}
      >
        Explore
      </Text>
      <SearchBar
        value={searchText}
        onChange={setSearchText}
        placeholder="Search by recipe name"
      />

      {searchText.trim() && displayData?.length === 0 && (
        <Text
          style={{
            marginTop: 15,
            fontFamily: "outfit",
            fontSize: 16,
            textAlign: "center",
            color: Color.GRAY,
          }}
        >
          You are looking for something else, create a new one
        </Text>
      )}

      <FlatList
        data={displayData}
        numColumns={2}
        refreshing={loading}
        onRefresh={GetAllRecipes}
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
