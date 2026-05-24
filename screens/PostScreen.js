import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { addDoc, collection } from "firebase/firestore";

import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export default function PostScreen({ navigation }) {

  // 🔥 USER CONTEXT
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handlePost = async () => {

    if (!title || !description || !category) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {

      // 🔥 SAVE CAMPAIGN
      await addDoc(collection(db, "campaigns"), {
        title,
        description,
        category,

        // 🔥 BRAND INFO
        brandId: user.uid,
        brandEmail: user.email,

        // 🔥 FUTURE READY
        createdAt: new Date(),
      });

      Alert.alert("Success", "Campaign posted!");

      // CLEAR
      setTitle("");
      setDescription("");
      setCategory("");

      navigation.navigate("Home");

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Post Campaign
      </Text>

      <TextInput
        placeholder="Campaign Title"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Category (Fashion, Tech, Food...)"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePost}
      >
        <Text style={styles.buttonText}>
          Post Campaign
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
    paddingTop: 60,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#121212",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#E1306C",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});