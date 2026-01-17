import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import Prompt from "../services/Prompt";
import Button from "./Button";
import LoadingDialog from "./LoadingDialog";

export default function CreateRecipe() {
  const [userInput, setUserInput] = useState<string>();
  const [recipeOptions, setRecipeOptions] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  // console.log(user);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      detectIngredients(uri);
    }
  };

  const detectIngredients = async (imageUri: string) => {
    setDetecting(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "food.jpg",
      type: "image/jpeg",
    } as any);
    // http://10.0.2.2:8000/predict android emulator

    try {
      const response = await fetch(
        "http://192.168.128.159:8001/predict?combine_method=smart",

        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("AI RESULT:", data);

      if (data.owlvit_results?.length > 0) {
        const ingredients = data.owlvit_results
          .map((item: any) => item.label)
          .join(", ");

        setUserInput(ingredients);
      } else if (data.best_food_name) {
        setUserInput(data.best_food_name);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Detect failed");
    }

    setDetecting(false);
  };

  const onGenerate = async () => {
    if (!userInput) {
      Alert.alert("Please enter detail");
      return;
    }
    setLoading(true);
    const result = await GlobalApi.AIModel(
      userInput + Prompt.GENERATE_RECIPE_OPTION_PROMPT
    );
    console.log(result?.choices[0].message?.content);
    const content = result?.choices[0].message?.content;

    // content && setRecipeOptions(JSON.parse(content));
    if (content) {
      const parsed = safeJsonParse(content);
      if (!parsed) {
        Alert.alert("AI response is invalid JSON");
        setLoading(false);
        return;
      }
      setRecipeOptions(parsed);
    }
    setLoading(false);
    actionSheetRef.current?.show();
  };

  const safeJsonParse = (text: string) => {
    try {
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanText);
    } catch (error) {
      console.error("JSON PARSE ERROR:", error);
      console.error("RAW TEXT:", text);
      return null;
    }
  };

  const GenerateCompleteRecipe = async (option: any) => {
    actionSheetRef.current?.hide();
    setOpenLoading(true);
    const PROMPT =
      "recipeName:" +
      option?.recipeName +
      "description:" +
      option?.description +
      Prompt?.GENERATE_COMPLETE_RECIPE_RECIPE;
    const result = await GlobalApi.AIModel(PROMPT);
    const content = result?.choices[0].message?.content;
    if (!content) {
      setOpenLoading(false);
      return;
    }
    // const recipeData = JSON.parse(content);
    const recipeData = safeJsonParse(content);
    if (!recipeData) {
      setOpenLoading(false);
      Alert.alert("Failed to generate recipe");
      return;
    }

    console.log("AI CONTENT:", content);

    console.log(content);
    const imageUrl = await GetImageRecipe(option?.recipeName);
    const insertedRecordResult: any = await SaveToDatabase(
      recipeData,
      imageUrl
    );

    router.push({
      pathname: "/recipe-detail",
      params: {
        recipeData: JSON.stringify(insertedRecordResult),
      },
    });

    setOpenLoading(false);
  };

  const GetImageRecipe = async (recipeName: any) => {
    const result = await GlobalApi.GetRecipeImage(recipeName);
    console.log(result);
    return result;
  };

  const SaveToDatabase = async (recipeData: any, imageUrl: string | null) => {
    const data = {
      ...recipeData,
      recipeImage: imageUrl,
      userEmail: user?.email,
    };
    const userData = {
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      credits: user?.credits - 1,
      pref: null,
    };
    const result = await GlobalApi.CreateNewRecipe(data);
    const updateUser = await GlobalApi.UpdateUser(user?.documentId, userData);
    console.log(updateUser);
    // setUser(updateUser);
    return result.data.data;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon/pan.gif")}
        style={styles.panImage}
      />
      <Text style={styles.heading}>
        Warm up your stove, and let's get cooking!
      </Text>
      <Text style={styles.subHeading}>Make something for your stomach</Text>

      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={3}
        placeholder="What you want to create? Add ingredients etc. "
        value={userInput}
        onChangeText={(value) => setUserInput(value)}
      />
      <Button
        iconName={"sparkles-outline"}
        label={"Generate Recipe"}
        loading={loading}
        onPress={() => onGenerate()}
      />

      <LoadingDialog visible={openLoading} />

      <ActionSheet gestureEnabled ref={actionSheetRef}>
        <View style={styles.actionSheetContainer}>
          <Text style={styles.heading}>Select Recipe</Text>
          <View>
            {recipeOptions?.map((item: any, index: any) => (
              <TouchableOpacity
                onPress={() => GenerateCompleteRecipe(item)}
                key={index}
                style={styles.recipeOptionContainer}
              >
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: 16,
                  }}
                >
                  {item?.recipeName}{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "outfit",
                    color: Color.GRAY,
                  }}
                >
                  {item?.description}{" "}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ActionSheet>

      <Text style={styles.subHeading}>
        Too tired with typing, let's try this
      </Text>

      <Button
        iconName={"camera-outline"}
        label={detecting ? "Detecting..." : "Check Ingredients"}
        loading={detecting}
        onPress={pickImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    margin: 10,
    backgroundColor: Color.SECONDARY,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
  },
  panImage: {
    width: 50,
    height: 50,
  },
  heading: {
    fontFamily: "outfit",
    fontSize: 19,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 15,
    fontFamily: "outfit",
    marginTop: 6,
  },
  textInput: {
    backgroundColor: Color.WHITE,
    width: "100%",
    fontFamily: "outfit",
    fontSize: 15,
    borderRadius: 15,
    height: 120,
    marginTop: 10,
    padding: 15,
    textAlignVertical: "top",
  },
  actionSheetContainer: {
    padding: 25,
  },
  recipeOptionContainer: {
    padding: 15,
    borderWidth: 0.2,
    borderRadius: 15,
    marginTop: 15,
  },
});
