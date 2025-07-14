// utils.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed

/**
 * Fetch the displayName of a user by UID from Firestore
 * @param {string} uid - The UID of the user
 * @returns {Promise<string|null>} displayName or null if not found
 */
export const getUserDisplayName = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.displayName || null;
    }
    return null;
  } catch (err) {
    console.error("Error fetching user displayName:", err);
    return null;
  }
};
