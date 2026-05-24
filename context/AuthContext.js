import React, {
  createContext,
  useState,
  useEffect,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  // 🔥 USER STATE
  const [user, setUser] =
    useState(null);

  // 🔥 LOADING STATE
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    // 🔥 FIREBASE AUTH LISTENER
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};