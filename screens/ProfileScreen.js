import React, {
  useContext,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ScrollView,
  Linking,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../context/AuthContext";

import { auth, db } from "../firebase";

import { signOut } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ProfileScreen({
  navigation,
}) {

  const { user, setUser } =
    useContext(AuthContext);

  const [applications, setApplications] =
    useState([]);

  const [profile, setProfile] =
    useState({});

  // 🔥 REFRESH PROFILE
  useFocusEffect(
    React.useCallback(() => {

      fetchApplications();
      fetchProfile();

    }, [])
  );

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

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {

    try {

      const ref = doc(
        db,
        "users",
        user.uid
      );

      const snap =
        await getDoc(ref);

      if (snap.exists()) {

        setProfile(
          snap.data()
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  // 🔥 FETCH APPLICATIONS
  const fetchApplications =
    async () => {

      if (!user) return;

      try {

        const q = query(
          collection(
            db,
            "applications"
          ),

          where(
            "creatorId",
            "==",
            user.uid
          )
        );

        const snap =
          await getDocs(q);

        const data =
          snap.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setApplications(data);

      } catch (error) {

        console.log(error);
      }
    };

  // 🔥 LOGOUT
  const handleLogout =
    async () => {

      await signOut(auth);

      await AsyncStorage.removeItem(
        "user"
      );

      setUser(null);

      
    };

  // 🔥 APPLICATION CARD
  const renderApplication = ({
    item,
  }) => {

    const statusColor =
      item.status === "accepted"
        ? "#16a34a"
        : item.status === "rejected"
        ? "#dc2626"
        : "#E1306C";

    return (
      <View
        style={
          styles.applicationCard
        }
      >

        <Text style={styles.appTitle}>
          {item.title}
        </Text>

        <Text
          style={styles.appCategory}
        >
          {item.category}
        </Text>

        <View
          style={[
            styles.statusBox,

            {
              backgroundColor:
                item.status ===
                "accepted"
                  ? "rgba(22,163,74,0.18)"
                  : item.status ===
                    "rejected"
                  ? "rgba(220,38,38,0.18)"
                  : "rgba(225,48,108,0.18)",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  statusColor,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* 🔥 HERO */}
        <LinearGradient
          colors={[
            "#111",
            "#1a1a1a",
          ]}
          style={styles.hero}
        >

          {/* 🔥 PROFILE IMAGE */}
          {profile?.profileImage ? (

            <Image
              source={{
                uri: profile.profileImage,
              }}
              style={
                styles.avatarImage
              }
            />

          ) : (

            <View
              style={styles.avatar}
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {profile?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  user?.email
                    ?.charAt(0)
                    ?.toUpperCase()}
              </Text>
            </View>

          )}

          {/* 🔥 NAME */}
          <Text style={styles.name}>
            {profile?.name ||
              "Creator"}
          </Text>

          {/* 🔥 NICHE */}
          <Text
            style={styles.niche}
          >
            {profile?.niche ||
              "Content Creator"}
          </Text>

          {/* 🔥 FOLLOWERS */}
          <Text
            style={styles.followers}
          >
            {formatFollowers(
              profile?.followers
            )}{" "}
            Followers
          </Text>

          {/* 🔥 INSTAGRAM */}
          <Text
            style={styles.instagram}
          >
            @
            {profile?.instagram ||
              "creator"}
          </Text>

          {/* 🔥 BUTTONS */}
          <View
            style={
              styles.heroButtons
            }
          >

            <TouchableOpacity
              style={
                styles.instaBtn
              }
              onPress={() => {

                if (
                  profile?.instagram
                ) {

                  Linking.openURL(
                    `https://www.instagram.com/${profile.instagram}/`
                  );
                }
              }}
            >
              <Text
                style={
                  styles.btnText
                }
              >
                View Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.editBtn
              }
              onPress={() =>
                navigation.navigate(
                  "EditProfile"
                )
              }
            >
              <Text
                style={
                  styles.btnText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>

          </View>

        </LinearGradient>

        {/* 🔥 ABOUT */}
        <View style={styles.section}>

          <Text
            style={
              styles.sectionTitle
            }
          >
            About Me
          </Text>

          <Text style={styles.bio}>
            {profile?.bio ||
              "No bio added yet"}
          </Text>

        </View>

        {/* 🔥 PORTFOLIO */}
        <View style={styles.section}>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Portfolio
          </Text>

          <View style={styles.grid}>

            {profile
              ?.portfolioImages
              ?.length > 0 ? (

              profile.portfolioImages.map(
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
                  styles.emptyPortfolio
                }
              >
                No portfolio images
                yet
              </Text>

            )}

          </View>

        </View>

        {/* 🔥 APPLICATIONS */}
        <View style={styles.section}>

          <Text
            style={
              styles.sectionTitle
            }
          >
            My Applications
          </Text>

          <FlatList
            data={applications}
            keyExtractor={(
              item
            ) => item.id}
            renderItem={
              renderApplication
            }
            scrollEnabled={false}
          />

        </View>

        {/* 🔥 LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // 🔥 HERO
  hero: {
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 38,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  // 🔥 PROFILE IMAGE
  avatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },

  avatarImage: {
    width: 115,
    height: 115,
    borderRadius: 60,
    marginBottom: 18,
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  // 🔥 TEXT
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  niche: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 15,
  },

  followers: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 16,
  },

  instagram: {
    color: "#888",
    marginTop: 6,
    fontSize: 15,
  },

  // 🔥 BUTTONS
  heroButtons: {
    flexDirection: "row",
    marginTop: 22,
  },

  instaBtn: {
    backgroundColor: "#E1306C",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    marginRight: 10,
  },

  editBtn: {
    backgroundColor: "#222",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
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
    borderRadius: 20,
    marginBottom: 14,
  },

  emptyPortfolio: {
    color: "#666",
    marginTop: 10,
  },

  // 🔥 APPLICATIONS
  applicationCard: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  appTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  appCategory: {
    color: "#E1306C",
    marginTop: 6,
  },

  statusBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 14,
  },

  statusText: {
    fontWeight: "bold",
    textTransform:
      "capitalize",
  },

  // 🔥 LOGOUT
  logoutBtn: {
    backgroundColor: "#E1306C",
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 100,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});