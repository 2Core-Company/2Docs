// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const database = getDatabase(app);