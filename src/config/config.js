import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to LOCAL and token expiration to 7 days
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Set custom token expiration time (7 days in milliseconds)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    auth.settings.appVerificationDisabledForTesting = false;
    auth.settings.tokenExpirationTime = sevenDaysInMs;
  })
  .catch(error => {
    console.error("Error setting persistence:", error);
  });

export { auth };
