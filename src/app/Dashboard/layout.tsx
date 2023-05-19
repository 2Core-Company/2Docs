'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, User } from "firebase/auth";
import React, {useState, useEffect, useContext} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { getDoc, doc } from "firebase/firestore";
import { userContext } from '../Context/contextUser'
import { companyContext } from '../Context/contextCompany';
import { stripe } from '../../../lib/stripe'
import {  DataUserContext } from '../../types/users';
import { loadingContext } from '../Context/contextLoading';



export default function DashboardLayout({ children}: {children: React.ReactNode}) {
  const {dataUser, setDataUser} = useContext(userContext)
  const {setLoading} = useContext(loadingContext)
  const {setDataCompany} = useContext(companyContext)
  const [onLoad, setOnLoad] = useState(false)
  const router = useRouter()
  const [urlImageProfile, setUrlImageProfile] = useState('')
  const url = usePathname()
  
  //Verificação se o usuário esta logado e se é um admin ou um cliente
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return router.push("/")
      }
      const page = window.location.pathname
      const idTokenResult = await auth.currentUser?.getIdTokenResult()
      await GetUser(user, idTokenResult?.claims.permission)
      const plan = await SearchCostumer({id_company:user.displayName})
      await GetDataCompanyUser({id_company:user.displayName, plan:plan})

      setOnLoad(true)
      setLoading(false)
      
      if(idTokenResult?.claims.permission > 0 && page.includes('/Dashboard/Clientes')){
        return router.replace("/Dashboard/Admin")
      }

      if(idTokenResult?.claims.permission === 0 && page.includes('/Dashboard/Admin')){
        router.replace("/Dashboard/Clientes")
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[url])

  //Pegando credenciais dos usuários
  async function GetUser(user, permission){
    try{
      if(dataUser.id_company === '' && user.displayName){
        const docRef = doc(db, "companies", user.displayName, "clients", user.uid);
        const docSnap = await getDoc(docRef);
        setUrlImageProfile(docSnap.data()?.photo_url)
        var allDataUser:DataUserContext = {
          cnpj:docSnap.data()?.cnpj, 
          email:docSnap.data()?.email,  
          id:docSnap.data()?.id, 
          id_company:docSnap.data()?.id_company, 
          name:docSnap.data()?.name, 
          password:docSnap.data()?.password,     
          permission:permission, 
          phone:docSnap.data()?.phone, 
          enterprises:docSnap.data()?.enterprises,
        }
        setDataUser(allDataUser)
      }
    }catch(e){
      console.log(e)
    }
  }

  async function GetDataCompanyUser({id_company, plan}){
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDataCompany({
        id:docSnap.data().id, 
        contact:docSnap.data().contact, 
        questions:docSnap.data().questions,
      })
    }
  }

  async function SearchCostumer({id_company}) {
    const {data} = await stripe.customers.search({
        query: 'metadata[\'id_company\']:\'' +id_company+ '\'',
        limit: 1,
        expand: ['data.subscriptions']
    })
    .catch(err => err)
    const id = data[0]?.subscriptions.data[0]?.plan.id

    if(id == 'price_1MX5uXBC8E6EzctJ1TMCPSoE') {
      return 'Empresarial'
    } else if (id == 'price_1MX5uXBC8E6EzctJ1qaXp8ho') {
      return 'Empresarial'
    } else if (id == 'price_1MX5u3BC8E6EzctJlS8NCOJF') {
      return 'Profissional - Mensal'
    } else if (id == 'price_1MX5u3BC8E6EzctJLblqdVuF') {
      return 'Profissional'
    } else if (id == 'price_1MX5tXBC8E6EzctJCEiUGV4h') {
      return 'Inicial'
    } else {
      return 'Inicial'
    }
  }

  if(onLoad)
    return (
      <section>
        <NavBar image={urlImageProfile} permission={dataUser?.permission}/>
        <main className='w-full'>{children}</main>
      </section>
    );
}