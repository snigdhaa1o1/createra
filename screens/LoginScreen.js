import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      // FIREBASE LOGIN
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // SAVE USER
      setUser(user);

      // 🔥 FETCH ROLE
      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;

        // 👤 CREATOR
        if (role === "creator") {
          navigation.replace("Home");
        }

        // 🏢 BRAND
        else {
          navigation.replace("BrandDashboard");
        }
      } else {
        Alert.alert("Error", "User role not found");
      }

    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(
        "Enter Email",
        "Please enter your email first."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Success",
        "Password reset email sent!"
      );

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/control1/736x/38/11/d7/3811d7e9715f4756dfeebdffe2f94ac3.jpg",
      }}
      style={styles.background}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay}>

        <View style={styles.formContainer}>

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Login to continue
          </Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>
              Login
            </Text>
          </TouchableOpacity>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* SIGNUP */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText}>
              Don’t have an account? Signup
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  bgImage: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },

  formContainer: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 25,
    borderRadius: 25,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  subtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },

  loginBtn: {
    backgroundColor: "#E1306C",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 5,
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  forgotText: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 15,
  },

  signupText: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 20,
  },
});