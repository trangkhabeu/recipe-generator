import Button from "@/components/Button";
import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRecipeByUser() {
  const ingredientIconMap: Record<string, string> = {
    egg: "🥚",
    tomato: "🍅",
    chicken: "🍗",
    beef: "🥩",
    fish: "🐟",
    rice: "🍚",
    milk: "🥛",
    salt: "🧂",
    oil: "🫒",
    pork: "🥩",
    noodle: "🍜",
    onion: "🧅",
    garlic: "🧄",
    potato: "🥔",
    carrot: "🥕",
    cheese: "🧀",
    bread: "🍞",
    shrimp: "🦐",
    chillipepper: "🌶️",
    cream: "🍶",
    sweetpotato: "🍠",
    corn: "🌽",
    cucumber: "🥒",
    cabage: "🥬",
    broccoli: "🥦",
    eggplant: "🍆",
  };

  const { recipe } = useLocalSearchParams();
  const parsedRecipe = recipe ? JSON.parse(recipe as string) : null;
  const router = useRouter();
  const isEdit = !!parsedRecipe;

  const { user } = useContext(UserContext);

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [serveTo, setServeTo] = useState("");

  const [categoryOptions, setCategoryOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [image, setImage] = useState<string | null>(null);

  const [ingredients, setIngredients] = useState([
    { ingredient: "", quantity: "", icon: "" },
  ]);

  const [steps, setSteps] = useState<string[]>([""]);

  // category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GlobalApi.GetCategories();

        const list = res.data?.data || [];
        setCategoryOptions(list);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  // ingredient
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredient: "", quantity: "", icon: "" },
    ]);
  };

  const updateIngredient = (
    index: number,
    key: "ingredient" | "quantity" | "icon",
    value: string
  ) => {
    const copy = [...ingredients];
    copy[index][key] = value;

    if (key === "ingredient" && !copy[index].icon) {
      const lower = value.toLowerCase();
      for (const k in ingredientIconMap) {
        if (lower.includes(k)) {
          copy[index].icon = ingredientIconMap[k];
          break;
        }
      }
    }

    setIngredients(copy);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  /* steps handle */
  const addStep = () => setSteps([...steps, ""]);

  const updateStep = (index: number, value: string) => {
    const copy = [...steps];
    copy[index] = value;
    setSteps(copy);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // validation
  const validateForm = () => {
    if (!recipeName.trim()) return "Recipe name is required";
    if (!description.trim()) return "Description is required";

    if (!calories || isNaN(Number(calories)))
      return "Calories must be a number";

    if (!serveTo || isNaN(Number(serveTo))) return "Serve To must be a number";

    if (!cookTime || isNaN(Number(cookTime)))
      return "Cook Time must be a number";

    const validIngredients = ingredients.filter(
      (i) => i.ingredient.trim() !== ""
    );
    if (validIngredients.length === 0)
      return "Please add at least one ingredient";

    const validSteps = steps.filter((s) => s.trim() !== "");
    if (validSteps.length === 0) return "Please add at least one step";

    return null;
  };

  // pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // edit
  useEffect(() => {
    if (!parsedRecipe) return;

    setRecipeName(parsedRecipe.recipeName);
    setDescription(parsedRecipe.description);
    setIngredients(parsedRecipe.ingredients || []);
    setSteps(parsedRecipe.steps || []);
    setCalories(String(parsedRecipe.calories || ""));
    setServeTo(String(parsedRecipe.serveTo || ""));
    setCookTime(String(parsedRecipe.cookTime || ""));
    setCategories(parsedRecipe.category || []);
    setImage(parsedRecipe.recipeImage || null);
  }, []);

  const buildRecipePayload = (imageUrl?: string | null) => {
    return {
      recipeName,
      description,
      ingredients: ingredients
        .filter((i) => i.ingredient.trim() !== "")
        .map((i) => ({
          ingredient: i.ingredient,
          quantity: i.quantity || "to taste",
          icon: i.icon || "🍽️",
        })),

      steps: steps.filter((s) => s.trim() !== ""),

      calories: Number(calories),
      cookTime: Number(cookTime),
      serveTo: Number(serveTo),

      category: categories,

      recipeImage: imageUrl || null,
      userEmail: user?.email,
    };
  };

  const onSave = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Invalid data", error);
      return;
    }

    try {
      const imageUrl = image ? await GlobalApi.uploadImage(image) : null;
      const payload = buildRecipePayload(imageUrl);

      if (isEdit && parsedRecipe?.documentId) {
        await GlobalApi.UpdateRecipe(parsedRecipe.documentId, payload);
        Alert.alert("Updated", "Recipe updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await GlobalApi.CreateNewRecipe(payload);
        Alert.alert("Success", "Recipe created successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/Cookbook"),
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", "Failed to save recipe");
      console.log("AXIOS ERROR DATA:", err?.response?.data);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* basic in4 */}
        <Text style={styles.title}>Create Your Recipe</Text>

        <TextInput
          style={styles.input}
          placeholder="Recipe name"
          value={recipeName}
          onChangeText={setRecipeName}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        {/* image upload */}
        <Text style={styles.sectionTitle}>Recipe Image</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.addText}>+ Select Image</Text>
          )}
        </TouchableOpacity>

        {/*  */}
        <Text style={styles.sectionTitle}>Recipe Details</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Calories (kcal)"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Serve To"
            keyboardType="numeric"
            value={serveTo}
            onChangeText={setServeTo}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Cook Time (minutes)"
          keyboardType="numeric"
          value={cookTime}
          onChangeText={setCookTime}
        />

        <Text style={styles.sectionTitle}>Category</Text>

        <View style={styles.chipContainer}>
          {categoryOptions.map((cat) => {
            const selected = categories.includes(cat.name);

            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => toggleCategory(cat.name)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/*inggredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>

        {ingredients.map((item, index) => (
          <View key={index} style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Ingredient name"
              value={item.ingredient}
              onChangeText={(v) => updateIngredient(index, "ingredient", v)}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantity (e.g. 2 eggs)"
              value={item.quantity}
              onChangeText={(v) => updateIngredient(index, "quantity", v)}
            />

            <TextInput
              style={styles.input}
              placeholder="Icon (emoji optional)"
              value={item.icon}
              onChangeText={(v) => updateIngredient(index, "icon", v)}
            />

            {ingredients.length > 1 && (
              <TouchableOpacity
                onPress={() => removeIngredient(index)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
          <Text style={styles.addText}>+ Add Ingredient</Text>
        </TouchableOpacity>

        {/*steps*/}
        <Text style={styles.sectionTitle}>Steps</Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.stepLabel}>Step {index + 1}</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe this step"
              value={step}
              onChangeText={(v) => updateStep(index, v)}
            />

            {steps.length > 1 && (
              <TouchableOpacity
                onPress={() => removeStep(index)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remove Step</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addStep} style={styles.addBtn}>
          <Text style={styles.addText}>+ Add Step</Text>
        </TouchableOpacity>

        {/* submit */}
        <Button
          label={isEdit ? "Update Recipe" : "Save Recipe"}
          iconName="save-outline"
          onPress={onSave}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Color.SECONDARY,
  },
  title: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginVertical: 10,
  },
  input: {
    backgroundColor: Color.WHITE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontFamily: "outfit",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  addBtn: {
    alignItems: "center",
    marginBottom: 10,
  },
  addText: {
    color: Color.PRIMARY,
    fontFamily: "outfit-bold",
  },
  removeBtn: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  removeText: {
    color: "red",
    fontSize: 13,
  },
  stepLabel: {
    fontFamily: "outfit-bold",
    marginBottom: 5,
  },
  imagePicker: {
    height: 160,
    borderRadius: 15,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Color.PRIMARY,
  },
  chipSelected: {
    backgroundColor: Color.PRIMARY,
  },
  chipText: {
    fontFamily: "outfit",
    color: Color.PRIMARY,
  },
  chipTextSelected: {
    color: Color.WHITE,
    fontFamily: "outfit-bold",
  },
});
