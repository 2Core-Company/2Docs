// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDxZZFbHpJMge8bcvPZUpKm5PMyY1yIEBM",
  authDomain: "docs-dc26e.firebaseapp.com",
  projectId: "docs-dc26e",
  storageBucket: "docs-dc26e.appspot.com",
  messagingSenderId: "330282108027",
  appId: "1:330282108027:web:77bb9ce4d4dc14d0270ede",
  measurementId: "G-8LPJJP0644"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);