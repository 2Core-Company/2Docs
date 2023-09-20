// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Auth, getAuth, Unsubscribe, User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// import { getMessaging } from "firebase/messaging";
// import getToken from "messagingGetToken";
import { stripe } from '@/lib/stripe'
import { toast } from "react-toastify";
import getCompany from "./src/Utils/Firebase/Company/getCompany";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const database = getDatabase(app);

auth.beforeAuthStateChanged(async (user) => {
  const id_company = user?.displayName

  const { data } = await stripe.customers.search({
    query: 'metadata[\'id_company\']:\'' + id_company + '\'',
    limit: 1,
    expand: ['data.subscriptions']
  })
    .catch(err => err)
  const status = data[0]?.subscriptions.data[0]?.status

  if (user?.emailVerified === false) {
    throw toast.error("Seu email não foi confirmado.")
  }

  if (status != 'active' && status != 'trialing' && data.length != 0) {
    throw toast.error("Você não tem um plano do 2Docs ativo.")
  }

  const docSnap = await getCompany({ id_company: id_company! })
  

  if (docSnap.exists()) {
    if (!docSnap?.data().id || !docSnap?.data().name) {
      throw toast.error("Você não terminou de cadastrar sua empresa, acesse ao www.2docs.app e termine o cadastro")
    }
  }
});
