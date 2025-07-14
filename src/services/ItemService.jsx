// itemService.js

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";




const itemsRef = collection(db, 'items');

export const addItem = async (name, parentId = null) => {
  return await addDoc(itemsRef, { name, parentId });
};

export const getItems = async () => {
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateItem = async (id, newName) => {
  const docRef = doc(db, 'items', id);
  return await updateDoc(docRef, { name: newName });
};

export const deleteItem = async (id) => {
  const docRef = doc(db, 'items', id);
  return await deleteDoc(docRef);
};

export const getAllItems = async () => {
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMainItems = (all) => all.filter(item => !item.parentId);

export const getSubItemsByParent = (all, parentId) =>
  all.filter(item => item.parentId === parentId);


