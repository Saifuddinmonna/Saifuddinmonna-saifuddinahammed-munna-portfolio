import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { toast } from "react-toastify";
import { getCurrentUserProfile } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Function to get and store the token
  const getAndStoreToken = async user => {
    try {
      const token = await user.getIdToken();
      setToken(token);
      localStorage.setItem("authToken", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      if (user) {
        const token = await user.getIdToken(true);
        localStorage.setItem("authToken", token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  // Set up token refresh interval (every 6 days)
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(refreshToken, 6 * 24 * 60 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Firebase signUp success, userCredential:", userCredential);
      const firebaseUser = userCredential.user;
      await getAndStoreToken(firebaseUser);
      toast.success("Account created successfully!");
      return userCredential;
    } catch (error) {
      console.error("Firebase signUp error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await getAndStoreToken(firebaseUser);
      const profile = await getCurrentUserProfile();
      setDbUser(profile);
      toast.success("Signed in successfully!");
      return userCredential;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase signInWithGoogle success, result:", result);
      const firebaseUser = result.user;
      await getAndStoreToken(firebaseUser);
      toast.success("Signed in with Google successfully!");
      return result;
    } catch (error) {
      console.error("Firebase signInWithGoogle error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      setToken(null);
      localStorage.removeItem("authToken");
      setDbUser(null);
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        await getAndStoreToken(currentUser);
        try {
          const profile = await getCurrentUserProfile();
          setDbUser(profile);
        } catch (dbError) {
          console.error("Error fetching DB user profile:", dbError);
          setDbUser(null);
        }
      } else {
        setToken(null);
        localStorage.removeItem("authToken");
        setDbUser(null);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const value = {
    user,
    dbUser,
    token,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    loading,
    setDbUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
