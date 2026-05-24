import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");

      setTimeout(() => {
        if (user) {
          navigation.replace("Home");
        } else {
          navigation.replace("Login");
        }
      }, 2500);
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* 🎬 Animation */}
      <LottieView
        source={require("../assets/splash.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />

      {/* ✨ App Name */}
      <Text style={styles.title}>Createra</Text>

      {/* ✨ Tagline */}
      <Text style={styles.tagline}>Connect. Create. Grow.</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  animation: {
    width: 220,
    height: 220,
  },

  title: {
    color: "#E1306C",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },

  tagline: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
});