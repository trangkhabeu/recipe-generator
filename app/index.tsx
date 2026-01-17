import { useLogto } from "@logto/rn";
import { Redirect } from "expo-router";
import { ImageBackground, View } from "react-native";

export default function Index() {
  const { isAuthenticated } = useLogto();
  if (!isAuthenticated) {
    return <Redirect href="/Landing" />;
  }

  if (isAuthenticated === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ImageBackground
          source={require("../assets/images/loading.jpg")}
          style={{ width: 300, height: 300 }}
        />
      </View>
    );
  }

  // return (
  //   <View
  //     style={{
  //       flex: 1,
  //       justifyContent: "center",
  //       alignItems: "center",
  //     }}
  //   >
  //     <ImageBackground
  //       source={require("../assets/images/loading.jpg")}
  //       style={{ width: 300, height: 300 }}
  //     />

  //   </View>

  // );
}

// if (isAuthenticated === undefined) {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <ImageBackground
//         source={require("../assets/images/loading.jpg")}
//         style={{ width: 300, height: 300 }}
//       />
//     </View>
//   );
// }

// if (!isAuthenticated) {
//   return <Redirect href="/Landing" />;
// }
