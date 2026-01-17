import { UserContext } from "@/context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LogtoConfig, LogtoProvider, UserScope } from "@logto/rn";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });
  const router = useRouter();

  const config: LogtoConfig = {
    endpoint: "https://wcr5f0.logto.app/",
    appId: "poobxm2q3ql525evwgb1z",
    scopes: [UserScope.Email],
  };

  const [user, setUser] = useState();

  return (
    <LogtoProvider config={config}>
      <UserContext.Provider value={{ user, setUser }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Landing"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="recipe-by-category/index"
            options={{
              headerTransparent: true,
              headerTitle: "",
            }}
          />
          <Stack.Screen
            name="recipe-detail/index"
            options={{
              headerTitle: "Detail Recipe",
              // headerRight: () => (
              //   <Ionicons name="share" size={24} color="black" />
              // ),
            }}
          />
          <Stack.Screen
            name="create-recipe-manual/index"
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace("/(tabs)/Cookbook")}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="edit-profile/index"
            options={{
              headerTitle: "Edit Profile",
            }}
          />
        </Stack>
      </UserContext.Provider>
    </LogtoProvider>
  );
}
