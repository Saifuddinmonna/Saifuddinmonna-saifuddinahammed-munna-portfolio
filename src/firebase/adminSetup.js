import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./config";

const auth = getAuth(app);
const functions = getFunctions(app);

const adminsData = [
  {
    email: "admin1@example.com",
    plainPassword: "123456",
    name: "Main Admin",
  },
  {
    email: "admin2@example.com",
    plainPassword: "123456",
    name: "Support Admin",
  },
];

export const setupAdminUsers = async () => {
  try {
    for (const admin of adminsData) {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        admin.email,
        admin.plainPassword
      );

      // Set custom claims for admin role
      const setAdminRole = httpsCallable(functions, "setAdminRole");
      await setAdminRole({ uid: userCredential.user.uid });

      console.log(`Admin user created: ${admin.email}`);
    }
  } catch (error) {
    console.error("Error setting up admin users:", error);
  }
};
