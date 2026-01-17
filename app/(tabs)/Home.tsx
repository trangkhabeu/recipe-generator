import CategoryList from "@/components/CategoryList";
import CreateRecipe from "@/components/CreateRecipe";
import IntroHeader from "@/components/IntroHeader";
import LatestRecipes from "@/components/LatestRecipes";
import Color from "@/services/Color";
import React from "react";
import { FlatList, ScrollView } from "react-native";

export default function Home() {
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <ScrollView
          style={{
            height: "100%",
            backgroundColor: Color.WHITE,
            padding: 20,
          }}
        >
          {/* Intro */}
          <IntroHeader />
          {/* Generator recipe */}
          <CreateRecipe />
          {/* Category */}
          <CategoryList />
          {/* Lateset Recipes */}
          <LatestRecipes />
        </ScrollView>
      }
    />
  );
}
