import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icon/i5.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icon/i2.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Cookbook"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icon/i3.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("../../assets/images/icon/i4.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
