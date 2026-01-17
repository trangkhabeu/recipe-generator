import Color from "@/services/Color";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export default function LoadingDialog({
  visible = false,
  text = "Loading...",
}) {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loadContainer}>
          <ActivityIndicator size={"large"} color={Color.WHITE} />
          <Text style={styles.textLoad}>{text} </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loadContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: Color.PRIMARY,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000070",
  },
  textLoad: {
    marginTop: 10,
    color: Color.WHITE,
    fontSize: 16,
    fontFamily: "outfit",
  },
});
