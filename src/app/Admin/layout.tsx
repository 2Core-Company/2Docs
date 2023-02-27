'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, User } from "firebase/auth";
import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { getDoc, doc } from "firebase/firestore";
import AppContext from '../../components/Clients&Admin/AppContext';

export default function DashboardLayout({ children,}: {children: React.ReactNode}) {
    const context = useContext(AppContext)
    const [onLoad, setOnLoad] = useState(false)
    const router = useRouter()
    const [urlImageProfile, setUrlImageProfile] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims.admin){
            setOnLoad(true)
            GetUsers(user)
          } else {
            router.push("/Clientes")
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
    const allDataUser = docSnap.data()
    context.setDataUser({
      cnpj: allDataUser.cnpj, 
      created_date:allDataUser.created_user, 
      email: allDataUser.email, 
      id:allDataUser.id, 
      id_company: allDataUser.id_company,
      name:allDataUser.name,
      nameImage:allDataUser.nameImage,
      password:allDataUser.password,   
      permission:allDataUser.permission,
      folders: allDataUser.folders,
      phone:allDataUser.phone,
      photo_url:allDataUser.photo_url,
      status:allDataUser.status,
      fixed:allDataUser.fixed,
      enterprises:allDataUser.enterprises
    })
  }

    return (
      <section>
        {onLoad ? 
        <>
          <NavBar image={urlImageProfile} user={"Admin"}/>
          <main>{children}</main>
        </>
        : <></>}
      </section>
    );
  }