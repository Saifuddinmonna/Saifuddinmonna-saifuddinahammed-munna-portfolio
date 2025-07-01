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
import { getCurrentUserProfile } from "../../services/apiService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_API_URL } from "../../utils/apiConfig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Custom hook for fetching user data from server - Updated for TanStack Query v5
const useUserData = (token, enabled) => {
  return useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const apiUrl = `${BASE_API_URL}/api/auth/me`;
        console.log("🔍 API URL being used:", apiUrl);
        console.log("🔍 Environment variable REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
        console.log("🔍 Token being used:", token ? "Token exists" : "No token");

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ Full response from useUserData:", response.data);

        // Extract only the data property from the response
        const userData = response.data.data;
        console.log("✅ Extracted user data for dbUser:", userData);

        return userData;
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        console.error("❌ Error response:", error.response);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          throw new Error("Authentication failed");
        }
        throw error;
      }
    },
    enabled: enabled && !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const queryClient = useQueryClient();

  // Function to get and store the token
  const getAndStoreToken = async firebaseUser => {
    try {
      const newToken = await firebaseUser.getIdToken();
      setToken(newToken);
      localStorage.setItem("authToken", newToken);
      setTokenReady(true);
      return newToken;
    } catch (error) {
      console.error("Error getting token:", error);
      setTokenReady(false);
      return null;
    }
  };

  // Fetch user data from server using TanStack Query - only when token is ready
  const {
    data: dbUser,
    isLoading: userDataLoading,
    error: userDataError,
    refetch: refetchUserData,
  } = useUserData(token, tokenReady && !!user);

  // Function to refresh token
  const refreshToken = async () => {
    try {
      if (user) {
        const newToken = await user.getIdToken(true);
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        // Refetch user data with new token
        await refetchUserData();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  // Set up token refresh interval (every 6 days)
  useEffect(() => {
    if (user && tokenReady) {
      const refreshInterval = setInterval(refreshToken, 6 * 24 * 60 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [user, tokenReady, refetchUserData]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        console.log("Firebase user authenticated:", currentUser.uid);
        await getAndStoreToken(currentUser);
      } else {
        console.log("Firebase user signed out");
        setToken(null);
        setTokenReady(false);
        localStorage.removeItem("authToken");
        // Clear user data from cache
        queryClient.removeQueries({ queryKey: ["userData"] });
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Firebase signUp success, userCredential:", userCredential);
      const firebaseUser = userCredential.user;
      const newToken = await getAndStoreToken(firebaseUser);

      // Create user profile on server
      try {
        await axios.post(
          `${BASE_API_URL}/api/auth/register`,
          {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || firebaseUser.email,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (serverError) {
        console.error("Error creating user profile on server:", serverError);
        // Continue even if server profile creation fails
      }

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

      // User data will be fetched automatically by TanStack Query
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
      const newToken = await getAndStoreToken(firebaseUser);

      // Create or update user profile on server
      try {
        await axios.post(
          `${BASE_API_URL}/api/auth/google`,
          {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (serverError) {
        console.error("Error creating/updating user profile on server:", serverError);
        // Continue even if server profile creation fails
      }

      toast.success("Signed in with Google successfully!");
      return result;
    } catch (error) {
      console.error("Firebase signInWithGoogle error:", error);
      toast.error(error.message);
      throw error;
    }
  };
  console.log("dbUser from the botton in auth context", dbUser);
  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      setToken(null);
      setTokenReady(false);
      localStorage.removeItem("authToken");

      // Clear user data from cache
      queryClient.removeQueries({ queryKey: ["userData"] });

      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Handle user data errors
  useEffect(() => {
    if (userDataError) {
      console.error("User data error:", userDataError);
      if (userDataError.message === "Authentication failed") {
        // Handle authentication failure
        setToken(null);
        setTokenReady(false);
        localStorage.removeItem("authToken");
        queryClient.removeQueries({ queryKey: ["userData"] });
      }
    }
  }, [userDataError, queryClient]);

  const value = {
    user,
    dbUser,
    token,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    loading: loading || userDataLoading,
    refetchUserData,
    userDataError,
    tokenReady,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
