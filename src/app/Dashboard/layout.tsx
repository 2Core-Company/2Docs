'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, User } from "firebase/auth";
import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { getDoc, doc } from "firebase/firestore";
import { userContext } from '../contextUser'

export default function DashboardLayout({ children}: {children: React.ReactNode}) {
    const contextUser = useContext(userContext)
    const [onLoad, setOnLoad] = useState(false)
    const router = useRouter()
    const [urlImageProfile, setUrlImageProfile] = useState(null)
    
    //Verificação se o usuário esta logado e se é um admin ou um cliente
    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          return router.push("/")
        }
        const page = window.location.pathname
        const idTokenResult = await auth.currentUser.getIdTokenResult()

        GetUser(user)
        setOnLoad(true)
        
        if(idTokenResult.claims.admin && page.includes('/Dashboard/Clientes')){
          return router.replace("/Dashboard/Admin")
        }

        if(!idTokenResult.claims.admin && page.includes('/Dashboard/Admin')){
          router.replace("/Dashboard/Clientes")
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[router])

    //Pegando credenciais dos usuários
    async function GetUser(user:User){
      if(!contextUser.lenght){
        const docRef = doc(db, "companies", user.displayName, "clients", user.uid);
        const docSnap = await getDoc(docRef);
        setUrlImageProfile(docSnap.data().photo_url)
        const allDataUser = docSnap.data()
        contextUser.setDataUser(allDataUser)
      }
    }

  if(onLoad)
    return (
      <section>
        <NavBar image={urlImageProfile} user={"Admin"}/>
        <main className='w-full'>{children}</main>
      </section>
    );
}