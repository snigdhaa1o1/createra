import React, { useState } from "react";
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
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("creator");

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // SAVE ROLE
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
      });

      Alert.alert("Success", "Account created!");

      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/control1/736x/38/11/d7/3811d7e9715f4756dfeebdffe2f94ac3.jpg",
      }}
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Join Createra</Text>

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

          {/* ROLE TITLE */}
          <Text style={styles.roleTitle}>
            Choose Your Role
          </Text>

          {/* 🔥 INTERACTIVE ROLE CARDS */}
          <View style={styles.roleContainer}>
            
            {/* CREATOR */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                role === "creator" && styles.activeRole,
              ]}
              onPress={() => setRole("creator")}
            >
              <Text style={styles.roleEmoji}>👤</Text>

              <Text style={styles.roleHeading}>
                Creator
              </Text>

              <Text style={styles.roleDesc}>
                Apply to brand campaigns
              </Text>
            </TouchableOpacity>

            {/* BRAND */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                role === "brand" && styles.activeRole,
              ]}
              onPress={() => setRole("brand")}
            >
              <Text style={styles.roleEmoji}>🏢</Text>

              <Text style={styles.roleHeading}>
                Brand
              </Text>

              <Text style={styles.roleDesc}>
                Post influencer campaigns
              </Text>
            </TouchableOpacity>
          </View>

          {/* SIGNUP */}
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
          >
            <Text style={styles.signupText}>
              Create Account
            </Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLink}>
              Already have an account? Login
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

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },

  formContainer: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 20,
    borderRadius: 25,
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 15,
  },

  roleTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  roleCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  activeRole: {
    borderColor: "#E1306C",
    backgroundColor: "rgba(225,48,108,0.18)",
  },

  roleEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  roleHeading: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  roleDesc: {
    color: "#ccc",
    fontSize: 11,
    textAlign: "center",
  },

  signupBtn: {
    backgroundColor: "#E1306C",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  loginLink: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 18,
  },
});