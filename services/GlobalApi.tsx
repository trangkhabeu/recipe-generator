import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

// https://recipe-generator-admin.onrender.com
// http://192.168.128.159:1337
const axiosClient = axios.create({
  baseURL: "https://recipe-generator-admin.onrender.com/api",
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
  },
});

const unsplashClient = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY}`,
  },
});

const GetUserByEmail = (email: string) =>
  axiosClient.get("/user-lists?filters[email][$eq]=" + email);

const CreateNewUser = (data: any) =>
  axiosClient.post("/user-lists", { data: data });

const GetCategories = () => axiosClient.get("/categories?populate=*");

const CreateNewRecipe = (data: any) =>
  axiosClient.post("/recipes", { data: data });

const UpdateUser = (uid: any, data: any) =>
  axiosClient.put("/user-lists/" + uid, { data: data });

const GetRecipeByCategory = (category: string) =>
  axiosClient.get(
    `/recipes?filters[category][$jsonSupersetOf]=${encodeURIComponent(
      JSON.stringify([category])
    )}`
  );

const GetAllRecipeList = () => axiosClient.get("/recipes?sors[0]=id:desc");

const GetAllRecipesByLimit = (limit: number) =>
  axiosClient.get(
    "/recipes?sors[0]=id:desc&pagination[start]=1&pagination[limit]=" + limit
  );

const GetUserCreatedRecipe = (userEmail: string) =>
  axiosClient.get("/recipes?filters[userEmail][$eq]=" + userEmail);

const SaveUserFavRecipe = (data: any) =>
  axiosClient.post("/user-favorites", { data: data });

const FavRecipeList = (userEmail: string) =>
  axiosClient.get("/user-favorites?filters[userEmail][$eq]=" + userEmail);

const GetFavRecipes = (query: string) => axiosClient.get("/recipes?" + query);

const updateUser = (documentId: string, data: any) =>
  axiosClient.put(`/user-lists/${documentId}`, { data: data });

const GetPerCategories = () => axiosClient.get("/categories");

const UpdateRecipe = (id: string, data: any) =>
  axiosClient.put(`/recipes/${id}`, { data });

const DeleteRecipe = (id: string) => axiosClient.delete(`/recipes/${id}`);

const SearchRecipe = (keyword: string) =>
  axiosClient.get(
    `/recipes?filters[$or][0][recipeName][$containsi]=${keyword}`
  );

const uploadImage = async (imageUri: string) => {
  if (!imageUri) return null;

  const data = new FormData();
  data.append("files", {
    uri: imageUri,
    name: "recipe.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch("http://192.168.128.159:1337/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
    },
    body: data,
  });

  const json = await res.json();
  return json[0]?.url;
};

const uploadImageAvatar = async (imageUri: string, fileName = "image.jpg") => {
  if (!imageUri) return null;

  const data = new FormData();
  data.append("files", {
    uri: imageUri,
    name: fileName,
    type: "image/jpeg",
  } as any);

  const res = await fetch("http://192.168.128.159:1337/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`,
    },
    body: data,
  });

  const json = await res.json();
  return json[0];
};

const GetRecipeImage = async (recipeName: string): Promise<string | null> => {
  try {
    const res = await unsplashClient.get("/search/photos", {
      params: {
        query: recipeName + " food",
        page: 1,
        per_page: 3,
        orientation: "squarish",
      },
    });

    if (res.data.results.length > 0) {
      return res.data.results[0].urls.regular;
    }

    return null;
  } catch (error) {
    console.error("Unsplash error:", error);
    return null;
  }
};

const AIModel = async (prompt: string) =>
  await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-lite-001",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

export default {
  GetUserByEmail,
  CreateNewUser,
  GetCategories,
  AIModel,
  GetRecipeImage,
  CreateNewRecipe,
  UpdateUser,
  GetRecipeByCategory,
  GetAllRecipeList,
  GetAllRecipesByLimit,
  GetUserCreatedRecipe,
  SaveUserFavRecipe,
  FavRecipeList,
  GetFavRecipes,
  uploadImage,
  GetPerCategories,
  UpdateRecipe,
  updateUser,
  uploadImageAvatar,
  DeleteRecipe,
  SearchRecipe,
};
