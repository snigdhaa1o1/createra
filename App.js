import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  AuthContext,
  AuthProvider,
} from "./context/AuthContext";

// Screens
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import PostScreen from "./screens/PostScreen";
import ProfileScreen from "./screens/ProfileScreen";
import BrandDashboard from "./screens/BrandDashboard";
import ApplicantsScreen from "./screens/ApplicantsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import CreatorProfileScreen from "./screens/CreatorProfileScreen";

const Stack =
  createNativeStackNavigator();

// 🔥 APP NAVIGATOR
function AppNavigator() {

  const {
    user,
    loading,
  } = useContext(AuthContext);

  // 🔥 WAIT FOR FIREBASE
  if (loading) {
    return null;
  }

  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* 🔥 NOT LOGGED IN */}
        {!user ? (

          <>

            <Stack.Screen
              name="Splash"
              component={SplashScreen}
            />

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Signup"
              component={SignupScreen}
            />

          </>

        ) : (

          <>
            {/* 👤 CREATOR */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="Post"
              component={PostScreen}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            />

            {/* 🏢 BRAND */}
            <Stack.Screen
              name="BrandDashboard"
              component={BrandDashboard}
            />

            <Stack.Screen
              name="Applicants"
              component={ApplicantsScreen}
            />

            {/* 👤 EDIT PROFILE */}
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
            />

            <Stack.Screen
              name="CreatorProfile"
              component={CreatorProfileScreen}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
}

// 🔥 MAIN APP
export default function App() {

  return (

    <AuthProvider>

      <AppNavigator />

    </AuthProvider>
  );
}