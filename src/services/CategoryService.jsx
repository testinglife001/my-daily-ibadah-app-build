// src/services/CategoryService.js

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";





const categoryRef = collection(db, 'categories');
const categoriesRef = collection(db, 'categories');

// src/services/CategoryService.js

export const addCategory = async (name, parentId = null) => {
    return await addDoc(collection(db, 'categories'), {
      name,
      parentId,
    });
  };
  
  export const updateCategory = async (id, name, parentId = null) => {
    const categoryDoc = doc(db, 'categories', id);
    await updateDoc(categoryDoc, { name, parentId });
  };
  

// export const addCategory = async (name) => {
//  return await addDoc(categoryRef, { name });
// };

export const getCategories = async () => {
  const data = await getDocs(categoryRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const deleteCategory = async (id) => {
  const categoryDoc = doc(db, 'categories', id);
  await deleteDoc(categoryDoc);
};

// export const updateCategory = async (id, name) => {
//  const categoryDoc = doc(db, 'categories', id);
//  await updateDoc(categoryDoc, { name });
// };



export const addCategoryAlt = async (name, parentId = null) => {
  return await addDoc(categoriesRef, { name, parentId });
};

export const getCategoriesAlt = async () => {
  const snapshot = await getDocs(categoriesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateCategoryAlt = async (id, newName) => {
  const docRef = doc(db, 'categories', id);
  return await updateDoc(docRef, { name: newName });
};

export const deleteCategoryAlt = async (id) => {
  const docRef = doc(db, 'categories', id);
  return await deleteDoc(docRef);
};

export const addCategoryNew = async (category) => {
  const docRef = await addDoc(collection(db, 'categories'), {
    name: category.name,
    parentId: category.parentId || null,
    // tag: category.tag || '',
    // color: category.color || ''
  });
};

export const updateCategoryNew = async (id, category) => {
  const categoryDocRef = doc(db, "categories", id);
  await updateDoc(categoryDocRef, {
    name: category.name,
    parentId: category.parentId || null,
    // tag: category.tag || '',
    // color: category.color || ''
  });
};

export const getCategoriesNew = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteCategoryNew = async (id) => {
  const categoryRef = doc(db, "categories", id);
  await deleteDoc(categoryRef);
};

