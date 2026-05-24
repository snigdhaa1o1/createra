import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = ["All", "Fashion", "Tech", "Food"];

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const theme = darkMode ? darkTheme : lightTheme;

  const scrollRef = useRef(null);
  const scales = useRef(
    CATEGORIES.reduce((acc, key) => {
      acc[key] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const categoryImages = {
    Fashion: [
      "https://i.pinimg.com/originals/85/75/58/857558b2486dacb40fbdda359da24a69.jpg",
      "https://thumbs.dreamstime.com/b/professional-photoshoot-fashionable-creative-studio-setup-backstage-photographer-captures-model-chic-fashion-centric-382193460.jpg",
    ],
    Tech: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    ],
    Food: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1550547660-d9450f859349",
    ],
    Fitness: [
      "https://as2.ftcdn.net/jpg/09/42/84/97/1000_F_942849755_HHDqm8XGDWLa0OYG9prvDaIaFjC1VMOd.jpg"
    ],
    Beauty: [
      "https://cdn.pixabay.com/photo/2024/03/11/14/31/ai-generated-8626807_1280.png"
    ]
  };

  const getImage = (category) => {
    const arr = categoryImages[category];
    return arr ? arr[Math.floor(Math.random() * arr.length)] : null;
  };

  useEffect(() => {
    fetchCampaigns();
    fetchApplied();
  }, [user]);

  const fetchCampaigns = async () => {
    const snapshot = await getDocs(collection(db, "campaigns"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCampaigns(data);
    setFilteredCampaigns(data);
  };

  const fetchApplied = async () => {
    if (!user) return;

    const q = query(
      collection(db, "applications"),
      where("userEmail", "==", user.email)
    );

    const snap = await getDocs(q);
    setAppliedIds(snap.docs.map((d) => d.data().campaignId));
    setLoading(false);
  };

  const handleApply = async (item) => {
  if (appliedIds.includes(item.id)) return;

  try {

    await addDoc(collection(db, "applications"), {
      campaignId: item.id,

      // 🔥 campaign info
      title: item.title,
      category: item.category,

      // 🔥 creator info
      userEmail: user.email,
      creatorId: user.uid,

      // 🔥 brand info
      brandId: item.brandId,

      // 🔥 future-ready
      status: "pending",
      createdAt: new Date(),
    });

    setAppliedIds([...appliedIds, item.id]);

  } catch (error) {
    console.log(error);
  }
};

  const filterCampaigns = (cat, index) => {
    setSelectedCategory(cat);

    if (cat === "All") setFilteredCampaigns(campaigns);
    else setFilteredCampaigns(campaigns.filter((c) => c.category === cat));

    scrollRef.current?.scrollTo({ x: index * 85, animated: true });
  };

  const pressIn = (cat) => {
    Animated.spring(scales[cat], {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = (cat) => {
    Animated.spring(scales[cat], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }) => {
    const isApplied = appliedIds.includes(item.id);
    const imageUrl = item.image || getImage(item.category);

    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <View style={styles.overlayContainer}>
            <View style={styles.gradient} />
            <View style={styles.overlayText}>
              <Text style={styles.overlayTitle}>{item.title}</Text>
              <Text style={styles.overlayCat}>{item.category}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.desc, { color: theme.subText }]}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            isApplied && { backgroundColor: "#444" },
          ]}
          onPress={() => handleApply(item)}
        >
          <Text style={styles.buttonText}>
            {isApplied ? "Applied ✅" : "Apply"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Createra</Text>

        <View style={styles.rightIcons}>
          <Switch value={darkMode} onValueChange={setDarkMode} />

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={[styles.icon, { color: theme.text }]}>👤</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Post")}>
            <Text style={[styles.icon, { color: theme.text }]}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CATEGORY SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={{
          paddingVertical: 12,
          paddingLeft: 4,
        }}
      >
        {CATEGORIES.map((item, index) => {
          const isActive = selectedCategory === item;

          return (
            <Animated.View
              key={item}
              style={{ transform: [{ scale: scales[item] }] }}
            >
              <TouchableOpacity
                onPress={() => filterCampaigns(item, index)}
                onPressIn={() => pressIn(item)}
                onPressOut={() => pressOut(item)}
                style={styles.categoryWrapper}
              >
                <LinearGradient
                  colors={
                    isActive ? ["#E1306C", "#ff6a88"] : ["#222", "#222"]
                  }
                  style={styles.categoryCard}
                >
                  <Image
                    source={{ uri: getImage(item) }}
                    style={styles.categoryImage}
                  />

                  <Text
                    style={[
                      styles.categoryLabel,
                      isActive && styles.activeLabel,
                    ]}
                  >
                    {item}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator color="#E1306C" />
      ) : (
        <FlatList
          data={filteredCampaigns}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

// THEMES
const darkTheme = { bg: "#000", subText: "#aaa", text: "#fff" };
const lightTheme = { bg: "#fff", subText: "#666", text: "#000" };

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10, // 🔥 FIX
  },

  logo: { fontSize: 28, fontWeight: "bold", color: "#E1306C" },

  rightIcons: { flexDirection: "row", alignItems: "center" },

  icon: { fontSize: 20, marginLeft: 10 },

  categoryWrapper: {
    marginRight: 12,
    justifyContent: "center", // 🔥 FIX
  },

  categoryCard: {
    padding: 6, // 🔥 reduced
    borderRadius: 40,
    alignItems: "center",
  },

  categoryImage: {
    width: 55, // 🔥 reduced
    height: 55,
    borderRadius: 30,
  },

  categoryLabel: {
    fontSize: 13,
    marginTop: 5,
    color: "#ccc",
  },

  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: { marginVertical: 10 },

  imageWrapper: { position: "relative" },

  image: { width: "100%", height: 180, borderRadius: 15 },

  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  overlayText: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },

  overlayTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  overlayCat: {
    color: "#E1306C",
    fontSize: 12,
  },

  desc: { marginTop: 8 },

  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E1306C",
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "600" },
});