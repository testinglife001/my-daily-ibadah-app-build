// src/firebase/index.js
import { initializeApp } from 'firebase/app';
import { getAuth, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    setPersistence, 
    browserLocalPersistence, 
    browserSessionPersistence 
} from 'firebase/auth';
import { getMessaging } from "firebase/messaging";
import { getToken, onMessage } from "firebase/messaging";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA2XJgV4NWdky78AFQ3psfLD-C6EQz4RD4",
  authDomain: "my-daily-ibadah-app-build.firebaseapp.com",
  projectId: "my-daily-ibadah-app-build",
  storageBucket: "my-daily-ibadah-app-build.firebasestorage.app",
  messagingSenderId: "433450793916",
  appId: "1:433450793916:web:52c33230e0c03aaf0b49b9",
  measurementId: "G-E5CRV1ZVDM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const db = getFirestore(app);
const storage = getStorage(app);

// const firebase = initializeApp(firebaseConfig)

export const messaging = getMessaging(app);



export { auth, googleProvider, facebookProvider, db, storage };
// export default firebase;
