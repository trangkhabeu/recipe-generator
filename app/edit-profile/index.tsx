import { UserContext } from "@/context/UserContext";
import Color from "@/services/Color";
import GlobalApi from "@/services/GlobalApi";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.picture || "");
  const [loading, setLoading] = useState(false);
  const STRAPI_URL = "http://192.168.128.159:1337";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);

      let avatarUrl = image;

      if (image && image.startsWith("file://")) {
        const uploaded = await GlobalApi.uploadImageAvatar(image);
        avatarUrl = uploaded.url;
      }

      await GlobalApi.UpdateUser(user.documentId, {
        name: name,
        picture: avatarUrl,
      });

      setUser({
        ...user,
        name,
        picture: avatarUrl,
      });

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };
  console.log("USER:", user);

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Color.WHITE,
        padding: 25,
      }}
    >
      {/* Avatar */}
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 99,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "outfit",
            color: Color.PRIMARY,
            marginTop: 10,
          }}
        >
          Change Photo
        </Text>
      </View>

      {/* Name */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontFamily: "outfit", marginBottom: 5 }}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={{
            borderWidth: 1,
            borderColor: Color.GRAY,
            borderRadius: 10,
            padding: 15,
            fontFamily: "outfit",
          }}
        />
      </View>

      {/* Email (readonly) */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit", marginBottom: 5 }}>Email</Text>
        <TextInput
          value={user?.email}
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: Color.GRAY,
            borderRadius: 10,
            padding: 15,
            backgroundColor: "#f5f5f5",
            color: Color.GRAY,
            fontFamily: "outfit",
          }}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        onPress={onSave}
        style={{
          marginTop: 40,
          backgroundColor: Color.PRIMARY,
          padding: 18,
          borderRadius: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Color.WHITE,
            fontFamily: "outfit-bold",
            fontSize: 18,
          }}
        >
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
