import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function ApplicantsScreen({
  route,
  navigation,
}) {

  const campaignId =
    route?.params?.campaignId;

  const [applicants, setApplicants] =
    useState([]);

  // 🔥 SAFETY CHECK
  if (!campaignId) {

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          No campaign selected
        </Text>
      </View>
    );
  }

  useEffect(() => {
    fetchApplicants();
  }, []);

  // 🔥 FETCH APPLICANTS
  const fetchApplicants =
    async () => {

      try {

        const q = query(
          collection(
            db,
            "applications"
          ),

          where(
            "campaignId",
            "==",
            campaignId
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

        setApplicants(data);

      } catch (error) {

        console.log(error);
      }
    };

  // 🔥 UPDATE STATUS
  const updateStatus =
    async (
      applicationId,
      status
    ) => {

      try {

        const ref = doc(
          db,
          "applications",
          applicationId
        );

        await updateDoc(ref, {
          status,
        });

        fetchApplicants();

      } catch (error) {

        console.log(error);
      }
    };

  // 🔥 CARD
  const renderApplicant = ({
    item,
  }) => {

    const statusColor =
      item.status === "accepted"
        ? "#16a34a"
        : item.status === "rejected"
        ? "#dc2626"
        : "#E1306C";

    return (

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(
            "CreatorProfile",
            {
              creatorId:
                item.creatorId,
            }
          )
        }
      >

        {/* 🔥 EMAIL */}
        <Text style={styles.email}>
          {item.userEmail}
        </Text>

        {/* 🔥 TITLE */}
        <Text style={styles.title}>
          {item.title}
        </Text>

        {/* 🔥 CATEGORY */}
        <Text style={styles.category}>
          {item.category}
        </Text>

        {/* 🔥 STATUS */}
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

        {/* 🔥 ACTIONS */}
        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() =>
              updateStatus(
                item.id,
                "accepted"
              )
            }
          >
            <Text style={styles.btnText}>
              Accept
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() =>
              updateStatus(
                item.id,
                "rejected"
              )
            }
          >
            <Text style={styles.btnText}>
              Reject
            </Text>
          </TouchableOpacity>

        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* 🔥 HEADER */}
      <Text style={styles.header}>
        Applicants
      </Text>

      {/* 🔥 LIST */}
      <FlatList
        data={applicants}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={
          renderApplicant
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 18,
    paddingTop: 55,
  },

  header: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#111",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  email: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  title: {
    color: "#E1306C",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
  },

  category: {
    color: "#888",
    marginTop: 4,
  },

  statusBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    marginTop: 14,
  },

  statusText: {
    fontWeight: "bold",
    textTransform:
      "capitalize",
  },

  actions: {
    flexDirection: "row",
    marginTop: 18,
  },

  acceptBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 12,
  },

  rejectBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

});
