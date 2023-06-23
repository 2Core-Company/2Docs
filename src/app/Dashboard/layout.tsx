'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, {useState, useEffect, useContext} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { getDoc, doc } from "firebase/firestore";
import { userContext } from '../Context/contextUser'
import { adminContext } from '../Context/contextAdmin'
import { companyContext } from '../Context/contextCompany';
import { stripe } from '../../../lib/stripe'
import {  DataUserContext } from '../../types/users';
import { toast, ToastContainer } from 'react-toastify';



export default function DashboardLayout({ children}: {children: React.ReactNode}) {
  const {dataUser, setDataUser} = useContext(userContext);
  const { setDataAdmin } = useContext(adminContext);  
  const {setDataCompany} = useContext(companyContext);
  const [onLoad, setOnLoad] = useState(false);
  const router = useRouter();
  const [propsNavBar, setPropsNavBar] = useState({urlImage: '', permission: 0, name:''});
  const url = usePathname();
  
  //Verificação se o usuário esta logado e se é um admin ou um cliente
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return router.push("/")
      }
      
      const idTokenResult = await auth.currentUser?.getIdTokenResult()

      const {data} = await stripe.customers.search({
        query: 'metadata[\'id_company\']:\'' +user.displayName+ '\'',
        limit: 1,
        expand: ['data.subscriptions']
      })
      .catch(err => err)

      const status = data[0]?.subscriptions.data[0]?.status

      if(status != 'active'){
        signOut(auth)
        router.replace('/')
        throw  toast.error("Você não tem um plano do 2Docs ativo.")
      }

      await Promise.all([
        GetUser(user, idTokenResult?.claims.permission),
        GetDataCompanyUser({id_company:user.displayName, data})
      ])

      VerifyPermision(idTokenResult?.claims.permission)

      if(!onLoad){
        setOnLoad(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(dataUser.id.length > 0){
      VerifyPermision(dataUser.permission)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  async function VerifyPermision(permission){
    if(permission > 0 && url?.includes('/Dashboard/Clientes')){
      return router.replace("/Dashboard/Admin")
    }

    if(permission === 0 && url?.includes('/Dashboard/Admin')){
      router.replace("/Dashboard/Clientes")
    }
  }

  //Pegando credenciais dos usuários
  async function GetUser(user, permission){
    try{
      if(dataUser.id_company === '' && user.displayName){
        const docRef = doc(db, "companies", user.displayName, "clients", user.uid);
        const docSnap = await getDoc(docRef);
        setPropsNavBar({urlImage: docSnap.data()?.photo_url, permission: permission, name:docSnap.data()?.name})        
        var allDataUser:DataUserContext = {
          email:docSnap.data()?.email,  
          id:docSnap.data()?.id, 
          id_company:docSnap.data()?.id_company, 
          name:docSnap.data()?.name,     
          permission:permission, 
          phone:docSnap.data()?.phone, 
          enterprises:docSnap.data()?.enterprises,
        }

        if(allDataUser.permission === 0) {
          setDataUser(allDataUser)
        } else {
          setDataAdmin(allDataUser)
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  async function GetDataCompanyUser({id_company, data}){
    const maxSize = await SearchCostumer({data})
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDataCompany({
        id:docSnap?.data().id, 
        name:docSnap.data().name,
        contact:docSnap.data().contact, 
        questions:docSnap.data().questions,
        maxSize:maxSize
      })
    }
  }

  async function SearchCostumer({data}) {
    const id = data[0]?.subscriptions.data[0]?.plan.id

    if(id == 'price_1MX5uXBC8E6EzctJ1TMCPSoE') {
      return 20000000000
    } else if (id == 'price_1MX5uXBC8E6EzctJ1qaXp8ho') {
      return 20000000000
    } else if (id == 'price_1MX5u3BC8E6EzctJlS8NCOJF') {
      return 10000000000
    } else if (id == 'price_1MX5u3BC8E6EzctJLblqdVuF') {
      return 10000000000
    } else if (id == 'price_1MX5tXBC8E6EzctJCEiUGV4h') {
      return 5000000000
    } else {
      return 5000000000
    }
  }

  if(onLoad)
    return (
      <section className='flex'>
        <ToastContainer autoClose={3000} />
        <NavBar image={propsNavBar.urlImage} permission={propsNavBar.permission} name={propsNavBar.name}/>
        <main className='w-full'>{children}</main>
      </section>
    );
}