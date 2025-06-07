import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3H-W55_AE0Ylb9k4avtoTyk4DP6QWsJ8",
  authDomain: "personal-portfolio-9719d.firebaseapp.com",
  projectId: "personal-portfolio-9719d",
  storageBucket: "personal-portfolio-9719d.firebasestorage.app",
  messagingSenderId: "864843274496",
  appId: "1:864843274496:web:f7af471d7deb3e17b3fbe5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
