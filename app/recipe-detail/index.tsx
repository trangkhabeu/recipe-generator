import Button from "@/components/Button";
import Ingredient from "@/components/Ingredient";
import RecipeIntro from "@/components/RecipeIntro";
import RecipeSteps from "@/components/RecipeSteps";
import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Alert, FlatList, View } from "react-native";

export default function RecipeDetail() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const { recipeData } = useLocalSearchParams();
  const recipe = recipeData ? JSON.parse(recipeData as string) : null;

  const isOwner = user?.email === recipe?.userEmail;

  if (!recipe) return null;

  const onDeleteRecipe = (recipeId: string) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await GlobalApi.DeleteRecipe(recipeId);
              Alert.alert("Deleted", "Recipe deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => router.replace("/(tabs)/Cookbook"),
                },
              ]);
            } catch (error: any) {
              console.error(error);
              Alert.alert("Error", "Failed to delete recipe");
            }
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            backgroundColor: Color.WHITE,
            height: "100%",
          }}
        >
          <RecipeIntro recipe={recipe} />
          <Ingredient ingredients={recipe?.ingredients} />
          <RecipeSteps steps={recipe.steps} />
          {/* <Text
            style={{
              marginTop: 15,
              fontFamily: "outfit",
              fontSize: 16,
              textAlign: "center",
              color: Color.GRAY,
            }}
          >
            You are looking for something else, Create a new one
          </Text> */}
          {isOwner && (
            <Button
              label="Edit Recipe"
              iconName="create-outline"
              onPress={() =>
                router.push({
                  pathname: "/create-recipe-manual",
                  params: {
                    recipe: recipeData,
                  },
                })
              }
            />
          )}
          {isOwner && (
            <Button
              label="Delete Recipe"
              iconName="trash"
              onPress={() => onDeleteRecipe(recipe.documentId)}
            />
          )}
        </View>
      }
    />
  );
}
