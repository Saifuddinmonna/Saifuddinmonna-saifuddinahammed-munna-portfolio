import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await getAndStoreToken(user);
      toast.success("Account created successfully!");
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await getAndStoreToken(user);
      toast.success("Signed in successfully!");
      return user;
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
      const user = result.user;
      await getAndStoreToken(user);
      toast.success("Signed in with Google successfully!");
      return user;
    } catch (error) {
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
      } else {
        setToken(null);
        localStorage.removeItem("authToken");
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    token,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
