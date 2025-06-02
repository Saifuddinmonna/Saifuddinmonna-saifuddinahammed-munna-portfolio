import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_authDomain,
  projectId: process.env.REACT_APP_FIREBASE_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_appId,
};

// Validate Firebase configuration
const validateConfig = config => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(", ")}`);
  }
};

let app;
let auth;

try {
  validateConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { auth };
export default app;
