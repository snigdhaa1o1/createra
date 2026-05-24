import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { LinearGradient } from "expo-linear-gradient";

export default function CreatorProfileScreen({
  route,
}) {

  const { creatorId } = route.params;

  const [creator, setCreator] =
    useState(null);

  useEffect(() => {
    fetchCreator();
  }, []);

  // 🔥 FETCH CREATOR
  const fetchCreator = async () => {

    try {

      const ref = doc(
        db,
        "users",
        creatorId
      );

      const snap =
        await getDoc(ref);

      if (snap.exists()) {
        setCreator(
          snap.data()
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 FORMAT FOLLOWERS
  const formatFollowers = (count) => {

    if (!count) return "0";

    const num = parseInt(count);

    if (num >= 1000000) {
      return (
        (num / 1000000).toFixed(1) + "M"
      );
    }

    if (num >= 1000) {
      return (
        (num / 1000).toFixed(1) + "K"
      );
    }

    return num;
  };

  if (!creator) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* 🔥 HERO */}
      <LinearGradient
        colors={["#111", "#1a1a1a"]}
        style={styles.hero}
      >

        {/* 🔥 PROFILE IMAGE */}
        {creator?.profileImage ? (

          <Image
            source={{
              uri: creator.profileImage,
            }}
            style={
              styles.profileImage
            }
          />

        ) : (

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {creator?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </Text>
          </View>

        )}

        {/* 🔥 NAME */}
        <Text style={styles.name}>
          {creator?.name ||
            "Creator"}
        </Text>

        {/* 🔥 NICHE */}
        <Text style={styles.niche}>
          {creator?.niche ||
            "Content Creator"}
        </Text>

        {/* 🔥 FOLLOWERS */}
        <Text
          style={styles.followers}
        >
          {formatFollowers(
            creator?.followers
          )}{" "}
          Followers
        </Text>

        {/* 🔥 INSTAGRAM */}
        <Text
          style={styles.instagram}
        >
          @{creator?.instagram}
        </Text>

        {/* 🔥 BUTTON */}
        <TouchableOpacity
          style={styles.instaBtn}
          onPress={() => {

            if (
              creator?.instagram
            ) {

              Linking.openURL(
                `https://www.instagram.com/${creator.instagram}/`
              );
            }
          }}
        >
          <Text style={styles.btnText}>
            Open Instagram
          </Text>
        </TouchableOpacity>

      </LinearGradient>

      {/* 🔥 ABOUT */}
      <View style={styles.section}>

        <Text
          style={styles.sectionTitle}
        >
          About Creator
        </Text>

        <Text style={styles.bio}>
          {creator?.bio ||
            "No bio available"}
        </Text>

      </View>

      {/* 🔥 PORTFOLIO */}
      <View style={styles.section}>

        <Text
          style={styles.sectionTitle}
        >
          Portfolio
        </Text>

        <View style={styles.grid}>

          {creator
            ?.portfolioImages
            ?.length > 0 ? (

            creator.portfolioImages.map(
              (
                img,
                index
              ) => (

                <Image
                  key={index}
                  source={{
                    uri: img,
                  }}
                  style={
                    styles.portfolioImage
                  }
                />

              )
            )

          ) : (

            <Text
              style={
                styles.emptyText
              }
            >
              No portfolio yet
            </Text>

          )}

        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  loading: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
  },

  // 🔥 HERO
  hero: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 18,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarText: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  niche: {
    color: "#aaa",
    marginTop: 5,
  },

  followers: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },

  instagram: {
    color: "#888",
    marginTop: 6,
  },

  instaBtn: {
    backgroundColor: "#E1306C",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // 🔥 SECTIONS
  section: {
    padding: 18,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  bio: {
    color: "#bbb",
    lineHeight: 24,
    fontSize: 15,
  },

  // 🔥 PORTFOLIO
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  portfolioImage: {
    width: "48%",
    height: 180,
    borderRadius: 18,
    marginBottom: 14,
  },

  emptyText: {
    color: "#666",
  },

});