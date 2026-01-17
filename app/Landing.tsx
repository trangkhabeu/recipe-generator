import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import { Marquee } from "@animatereactnative/marquee";
import { useLogto } from "@logto/rn";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Landing() {
  const { signIn } = useLogto();
  const { getIdTokenClaims, isAuthenticated } = useLogto();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUser = async () => {
      const userData = await getIdTokenClaims();
      if (!userData?.email) return;

      const result = await GlobalApi.GetUserByEmail(userData.email);

      let finalUser;
      if (result.data.data.length === 0) {
        const resp = await GlobalApi.CreateNewUser({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
        });
        finalUser = resp.data.data;
      } else {
        finalUser = result.data.data[0];
      }

      setUser(finalUser);
      router.replace("/(tabs)/Home");
    };

    loadUser();
  }, [isAuthenticated]);
  const imageList = [
    require("../assets/images/food/burgur.jpg"),
    require("../assets/images/food/imge.jpg"),
    require("../assets/images/food/salmon.jpg"),
    require("../assets/images/food/tacos.jpg"),
    require("../assets/images/food/pasta-beefsteak.jpg"),
    require("../assets/images/food/salad.jpg"),
    require("../assets/images/food/beef-veg.jpg"),
  ];

  return (
    <GestureHandlerRootView>
      <View>
        <Marquee
          spacing={10}
          speed={0.4}
          style={{ transform: [{ rotate: "-5deg" }] }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image key={index} source={image} style={styles.images} />
            ))}
          </View>
        </Marquee>
        <Marquee
          spacing={10}
          speed={0.7}
          style={{ transform: [{ rotate: "-5deg" }], marginTop: 15 }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image key={index} source={image} style={styles.images} />
            ))}
          </View>
        </Marquee>
        <Marquee
          spacing={10}
          speed={0.5}
          style={{ transform: [{ rotate: "-5deg" }], marginTop: 15 }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image key={index} source={image} style={styles.images} />
            ))}
          </View>
        </Marquee>
      </View>

      <View
        style={{
          backgroundColor: Color.WHITE,
          height: "100%",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Find, Create & Enjoy Delicious Recipes!
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 17,
            textAlign: "center",
            color: Color.GRAY,
            marginTop: 10,
          }}
        >
          Generate delicious recipes in seconds with the power of Al!
        </Text>
        <TouchableOpacity
          onPress={async () => signIn("exp://192.168.128.159:8081")}
          style={styles.button}
        >
          <Text
            style={{ textAlign: "center", fontSize: 18, fontFamily: "outfit" }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  images: {
    width: 160,
    height: 160,
    borderRadius: 25,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  button: {
    backgroundColor: Color.PRIMARY,
    padding: 15,
    borderRadius: 20,
    marginTop: 25,
  },
});
