import GlobalApi from "@/services/GlobalApi";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryList() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    GetCategoryList();
  });
  const GetCategoryList = async () => {
    const result = await GlobalApi.GetCategories();
    setCategoryList(result?.data?.data);
  };

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text style={styles.heading}>Category</Text>

      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/recipe-by-category",
                params: {
                  categoryName: item?.name,
                },
              })
            }
            style={styles.categoryContainer}
          >
            <Image
              source={{ uri: item?.image?.url }}
              style={{
                width: 45,
                height: 45,
              }}
            />
            <Text style={styles.categoryName}> {item?.name} </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: "outfit-bold",
    fontSize: 15,
  },
  categoryContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  categoryName: {
    fontFamily: "outfit",
    marginTop: 3,
  },
});
