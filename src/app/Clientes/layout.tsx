'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, User } from "firebase/auth";
import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { collection, where, getDocs, doc, getDoc, query } from "firebase/firestore";
import AppContext from '../../components/Clients&Admin/AppContext';

export default function DashboardLayout({children}: {children: React.ReactNode,}) {
  const context = useContext(AppContext)
  const [onLoad, setOnLoad] = useState(false)
  const router = useRouter()
  const [urlImageProfile, setUrlImageProfile] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims.admin){
            router.push("/Admin")
          } else {
            setOnLoad(true)
            GetUsers(user)
            GetFiles(user)
          }
        })
      } else {
        router.push("/")
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function GetUsers(user: User){
    const docRef = doc(db, "users", user.displayName, "Clientes", user.uid);
    const docSnap = await getDoc(docRef);
    setUrlImageProfile(docSnap.data().photo_url)
    context.setDataUser(docSnap.data())
  }

  async function GetFiles(user:User){
    const files = []
    const q = query(collection(db, "files", user.displayName, "Arquivos"), where("id_user", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      files.push(doc.data())
    });
    context.setAllFiles(files)
  }

    return (
      <section>
        {onLoad ? 
        <>
          <NavBar image={urlImageProfile} user={"Clients"}/>
          <main>{children}</main>
        </>
        : <></>}
      </section>
    );
  }