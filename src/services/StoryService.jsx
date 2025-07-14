import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";


const storysRef = collection(db, "stories");

export const createStory = async ({ title, content, categoryId, subcategoryId }) => {
  return await addDoc(storysRef, { title, content, categoryId, subcategoryId });
};

export const addStory = async (story) => {
  return await addDoc(storysRef, story);
};

export const getStories = async () => {
  const snapshot = await getDocs(storysRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

