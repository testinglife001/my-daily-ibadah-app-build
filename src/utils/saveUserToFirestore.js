// src/utils/saveUserToFirestore.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserToFirestore = async (user) => {
  if (!user?.uid) return;

  const userRef = doc(db, "providers", user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    providerId: user.providerData[0]?.providerId,
    createdAt: serverTimestamp(),
  }, { merge: true });
};
