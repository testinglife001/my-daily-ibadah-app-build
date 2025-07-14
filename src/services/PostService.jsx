import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";


const postRef = collection(db, 'blogposts');

export const createPost = async (post) => {
  return await addDoc(postRef, post);
};

export const getPosts = async () => {
  const snapshot = await getDocs(postRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
