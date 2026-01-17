import RecipeCard from "@/components/RecipeCard";
import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cookbook() {
  const { user } = useContext(UserContext);
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();

  useEffect(() => {
    user && GetUserRecipeList();
  }, [user]);

  const GetUserRecipeList = async () => {
    const result = await GlobalApi.GetUserCreatedRecipe(user?.email);
    setRecipeList(result.data.data);
  };

  const savedUserRecipeList = async () => {
    // fetch save document id
    const result = await GlobalApi.FavRecipeList(user?.email);
    console.log(result.data.data);
    const savedData = result.data.data;
    let QuerryFilter = "";
    savedData.forEach((element: any) => {
      QuerryFilter =
        QuerryFilter + "filters[documentId][$in]=" + element?.recipeDocId + "&";
    });
    console.log(QuerryFilter);
    // pass document id to fetch recipes

    const resp = await GlobalApi.GetFavRecipes(QuerryFilter);
    console.log(resp.data.data);
    setRecipeList(resp.data.data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Cookbook</Text>

      <View style={[styles.tabContainer, { marginBottom: 6, gap: 15 }]}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(1);
            GetUserRecipeList();
          }}
          style={[styles.tabContainer, { opacity: activeTab == 1 ? 1 : 0.4 }]}
        >
          <FontAwesome name="book" size={24} color="black" />
          <Text style={styles.tabText}>My Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab(2);
            savedUserRecipeList();
          }}
          style={[styles.tabContainer, { opacity: activeTab == 2 ? 1 : 0.4 }]}
        >
          <FontAwesome name="bookmark" size={24} color="black" />
          <Text style={styles.tabText}>My Favorited</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipeList}
        numColumns={2}
        refreshing={loading}
        onRefresh={activeTab == 1 ? GetUserRecipeList : savedUserRecipeList}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <RecipeCard recipe={item} />
          </View>
        )}
      />

      <View
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <TouchableOpacity
          style={styles.touchOpacity}
          onPress={() => {
            router.replace("/create-recipe-manual");
          }}
        >
          <FontAwesome6
            name="add"
            size={24}
            color={Color.PRIMARY}
            style={{
              marginHorizontal: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Color.WHITE,
    height: "100%",
  },
  mainText: {
    fontFamily: "outfit-bold",
    fontSize: 35,
  },
  tabContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 4,
    justifyContent: "space-between",
  },
  tabText: {
    fontFamily: "outfit",
    fontSize: 20,
  },
  touchOpacity: {
    position: "absolute",
    bottom: 40,
    right: 20,
    height: 60,
    width: 60,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
