import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

export default function BrandDashboard({
  navigation,
}) {

  const [campaigns, setCampaigns] =
    useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 🔥 FETCH CAMPAIGNS
  const fetchCampaigns =
    async () => {

      try {

        const q = query(
          collection(
            db,
            "campaigns"
          ),

          where(
            "brandId",
            "==",
            auth.currentUser.uid
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

        setCampaigns(data);

      } catch (error) {

        console.log(error);
      }
    };

  // 🔥 CAMPAIGN CARD
  const renderCampaign = ({
    item,
  }) => {

    return (

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          {item.title}
        </Text>

        <Text style={styles.cardDesc}>
          {item.category}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(
              "Applicants",
              {
                campaignId:
                  item.id,
              }
            )
          }
        >
          <Text
            style={styles.buttonText}
          >
            View Applicants
          </Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* 🔥 HEADER */}
      <Text style={styles.title}>
        Brand Dashboard
      </Text>

      {/* 🔥 POST BUTTON */}
      <TouchableOpacity
        style={styles.postBtn}
        onPress={() =>
          navigation.navigate("Post")
        }
      >
        <Text style={styles.postBtnText}>
          + Post Campaign
        </Text>
      </TouchableOpacity>

      {/* 🔥 CAMPAIGNS */}
      <FlatList
        data={campaigns}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={
          renderCampaign
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <Text
            style={styles.emptyText}
          >
            No campaigns yet
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    paddingTop: 60,
  },

  // 🔥 TITLE
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // 🔥 POST BUTTON
  postBtn: {
    backgroundColor: "#E1306C",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 25,
  },

  postBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // 🔥 CARD
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  cardDesc: {
    color: "#aaa",
    marginTop: 6,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },

});