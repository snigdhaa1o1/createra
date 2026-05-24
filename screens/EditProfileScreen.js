import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen({
  navigation,
}) {

  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [niche, setNiche] = useState("");
  const [instagram, setInstagram] = useState("");
  const [followers, setFollowers] = useState("");

  // 🔥 PROFILE IMAGE
  const [profileImage, setProfileImage] =
    useState("");

  // 🔥 PORTFOLIO
  const [portfolioImages, setPortfolioImages] =
    useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {

    try {

      const ref = doc(db, "users", user.uid);

      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        setName(data.name || "");
        setBio(data.bio || "");
        setNiche(data.niche || "");
        setInstagram(data.instagram || "");
        setFollowers(data.followers || "");

        setProfileImage(
          data.profileImage || ""
        );

        setPortfolioImages(
          data.portfolioImages || []
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 PICK PROFILE IMAGE
  const pickImage = async () => {

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.2,

        base64: true,
      });

    if (!result.canceled) {

      setProfileImage(
        `data:image/jpeg;base64,${result.assets[0].base64}`
      );
    }
  };

  // 🔥 PICK PORTFOLIO IMAGES
  const pickPortfolioImages = async () => {

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsMultipleSelection: true,

        quality: 0.15,

        base64: true,
      });

    if (!result.canceled) {

      const images = result.assets.map(
        (asset) =>
          `data:image/jpeg;base64,${asset.base64}`
      );

      setPortfolioImages(images.slice(0, 4));
    }
  };

  // 🔥 SAVE PROFILE
  const handleSave = async () => {

    try {

      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {

        name,
        bio,
        niche,
        instagram,
        followers,

        // 🔥 IMAGES
        profileImage,
        portfolioImages,
      });

      Alert.alert(
        "Success",
        "Profile updated!"
      );

      navigation.goBack();

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔥 HEADER */}
        <Text style={styles.header}>
          Edit Profile
        </Text>

        {/* 🔥 PROFILE IMAGE */}
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={pickImage}
        >

          {profileImage ? (

            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />

          ) : (

            <View style={styles.placeholder}>

              <Text style={styles.imageText}>
                Add Profile Photo
              </Text>

            </View>

          )}

        </TouchableOpacity>

        {/* 🔥 PORTFOLIO BUTTON */}
        <TouchableOpacity
          style={styles.portfolioBtn}
          onPress={pickPortfolioImages}
        >
          <Text style={styles.portfolioBtnText}>
            Add Portfolio Images
          </Text>
        </TouchableOpacity>

        {/* 🔥 PREVIEW GRID */}
        <View style={styles.previewGrid}>

          {portfolioImages.map((img, index) => (

            <Image
              key={index}
              source={{ uri: img }}
              style={styles.previewImage}
            />

          ))}

        </View>

        {/* 🔥 INPUTS */}
        <TextInput
          placeholder="Name"
          placeholderTextColor="#777"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Bio"
          placeholderTextColor="#777"
          style={[styles.input, { height: 100 }]}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <TextInput
          placeholder="Niche (Fashion, Tech...)"
          placeholderTextColor="#777"
          style={styles.input}
          value={niche}
          onChangeText={setNiche}
        />

        <TextInput
          placeholder="Instagram Username"
          placeholderTextColor="#777"
          style={styles.input}
          value={instagram}
          onChangeText={setInstagram}
        />

        <TextInput
          placeholder="Followers Count"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="numeric"
          value={followers}
          onChangeText={setFollowers}
        />

        {/* 🔥 SAVE */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            Save Profile
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 20,
  },

  // 🔥 HEADER
  header: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 28,
  },

  // 🔥 PROFILE IMAGE
  imagePicker: {
    alignSelf: "center",
    marginBottom: 28,
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },

  placeholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },

  imageText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // 🔥 PORTFOLIO
  portfolioBtn: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 22,
  },

  portfolioBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  previewImage: {
    width: "48%",
    height: 160,
    borderRadius: 20,
    marginBottom: 12,
  },

  // 🔥 INPUTS
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  // 🔥 BUTTON
  button: {
    backgroundColor: "#E1306C",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 100,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});