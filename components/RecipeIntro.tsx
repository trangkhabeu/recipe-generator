import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecipeIntro({ recipe }: any) {
  const { user } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);

  const SaveRecipe = async () => {
    const data = {
      userEmail: user?.email,
      recipeDocId: recipe?.documentId,
    };
    const result = await GlobalApi.SaveUserFavRecipe(data);
    console.log(result);
    Alert.alert("Your recipe was saved!");
    setIsFavorited(true);
  };

  const RemovedSaveRecipe = () => {
    // return !isFavorited;
  };

  return (
    <View>
      <Image
        source={{ uri: recipe?.recipeImage }}
        style={{
          width: "100%",
          height: 240,
          borderRadius: 20,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 25,
            marginTop: 7,
          }}
        >
          {recipe.recipeName}{" "}
        </Text>
        <TouchableOpacity
          onPress={() => (!isFavorited ? SaveRecipe() : RemovedSaveRecipe())}
        >
          {!isFavorited ? (
            <FontAwesome name="bookmark-o" size={24} color="black" />
          ) : (
            <FontAwesome name="bookmark" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          marginTop: 7,
        }}
      >
        Description
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          color: Color.GRAY,
          marginTop: 3,
        }}
      >
        {recipe.description}{" "}
      </Text>
      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <View style={styles.featureContainer}>
          <FontAwesome5 name="fire-alt" size={18} color={Color.PRIMARY} />
          <View>
            <Text style={styles.text}>{recipe?.calories} Cal</Text>
            <Text>Calories</Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <Ionicons name="timer" size={18} color={Color.PRIMARY} />
          <View>
            <Text style={styles.text}>{recipe?.cookTime} Mins</Text>
            <Text>Time</Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <Ionicons name="people" size={18} color={Color.PRIMARY} />
          <View>
            <Text style={styles.text}>{recipe?.serveTo} </Text>
            <Text>Serve</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  featureContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 15,
    backgroundColor: Color.SECONDARY,
    borderRadius: 15,
  },
  text: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Color.PRIMARY,
  },
});
