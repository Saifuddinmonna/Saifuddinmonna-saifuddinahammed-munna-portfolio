const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { uid } = data;

  try {
    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: "Admin role set successfully" };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
