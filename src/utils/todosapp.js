// utils/todosapp.js
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import dayjs from 'dayjs';

// Fetch categories by current user
export const fetchCategories = async (uid) => {
  const catRef = collection(db, 'category-todos');
  const q = query(catRef, where('createdBy', '==', uid), orderBy('title'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Fetch projects by category & current user
export const fetchProjectsByCategory = async (categoryId, uid) => {
  const projRef = collection(db, 'projects');
  const q = query(
    projRef,
    where('categoryId', '==', categoryId),
    where('createdBy', '==', uid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Fetch all todos by user
export const fetchAllTodos = async (userId) => {
  const q = query(
    collection(db, 'todos'),
    where('createdBy', '==', userId),
    orderBy('createdAt')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch todos by project and user
export const fetchTodosByProject = async (projectId, userId) => {
  const q = query(
    collection(db, 'todos'),
    where('projectId', '==', projectId),
    where('createdBy', '==', userId),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch todos for today by user
export const fetchTodosForToday = async (userId) => {
  const today = dayjs().startOf('day');
  const tomorrow = dayjs().add(1, 'day').startOf('day');

  const q = query(
    collection(db, 'todos'),
    where('createdBy', '==', userId),
    where('dueDate', '>=', Timestamp.fromDate(today.toDate())),
    where('dueDate', '<', Timestamp.fromDate(tomorrow.toDate())),
    orderBy('dueDate')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch todos for this week by user
export const fetchTodosForWeek = async (userId) => {
  const start = dayjs().startOf('day');
  const end = dayjs().add(7, 'day').startOf('day');

  const q = query(
    collection(db, 'todos'),
    where('createdBy', '==', userId),
    where('dueDate', '>=', Timestamp.fromDate(start.toDate())),
    where('dueDate', '<', Timestamp.fromDate(end.toDate())),
    orderBy('dueDate')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Default fetch (inbox or fallback)
export const fetchTodos = async (userId) => {
  const q = query(
    collection(db, 'todos'),
    where('createdBy', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
