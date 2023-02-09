
'use client'
import {Poiret_One, Poppins } from '@next/font/google'
import { useEffect, useState } from 'react';
import "../../styles/globals.css";
import AppContext from '../components/Clients&Admin/AppContext'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase'
import Loading from '../components/Clients&Admin/Loading'
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { DataUser, Files } from '../types/interfaces'

const poiretOne = Poiret_One({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poiretOne',
})

const poppins = Poppins({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poppins',
})

export default function RootLayout({children,}: {children: React.ReactNode}) {
  
const [loading, setLoading] = useState(false)
const [dataUser, setDataUser] = useState<DataUser>()
const [allFiles, setAllFiles] = useState<Files[]>()
const router =  useRouter()

useEffect(() => {
  const page = window.location.pathname
  onAuthStateChanged(auth, (user) => {
    if (user?.emailVerified) {
      if(page === "/"){
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims.admin){
            router.push("/Admin")
          } else {
            router.push("/Clientes")
          }
        })
      }
    } else {
      if(page != "/"){
        router.push("/")
      }
    }
  });
},[router, children])


  return (
    <html lang="pt-br">
      <title>Software para auxiliar o gerenciamento dos arquivos.</title>
      <head />
      <body className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
      <AppContext.Provider value={{
        loading, setLoading,
        dataUser, setDataUser,
        allFiles, setAllFiles
        }}>
          <Loading />
          {children}
      </AppContext.Provider>
      <ToastContainer
      autoClose={3000}
      />
      </body>
    </html>
  )
}
