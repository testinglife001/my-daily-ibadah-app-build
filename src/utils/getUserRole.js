// src/utils/getUserRole.js
import React from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


export const getUserRole = async (uid) => {
  // const userRef = doc(db, "users", uid);
  // const userSnap = await getDoc(userRef);

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  // return userSnap.exists() ? userSnap.data().role : null;
  if (docSnap.exists()) {
    return docSnap.data().role; // 'admin' or 'user'
  }
  return "guest";

};
