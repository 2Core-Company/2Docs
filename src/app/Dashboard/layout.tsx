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



export default function DashboardLayout({ children}: {children: React.ReactNode}) {
  const {dataUser, setDataUser} = useContext(userContext)
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

      await GetUser(user, idTokenResult?.claims.admin)
      const plan = await SearchCostumer({id_company:user.displayName})
      await GetDataCompanyUser({id_company:user.displayName, plan:plan})

      setOnLoad(true)
      
      if(idTokenResult?.claims.admin && page.includes('/Dashboard/Clientes')){
        return router.replace("/Dashboard/Admin")
      }

      if(!idTokenResult?.claims.admin && page.includes('/Dashboard/Admin')){
        router.replace("/Dashboard/Clientes")
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[url])

  //Pegando credenciais dos usuários
  async function GetUser(user:User, permission:number){
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
            permission:docSnap.data()?.number, 
            phone:docSnap.data()?.phone, 
          }
          allDataUser.permission = permission
          setDataUser(allDataUser)
        }
      }catch(e){
        console.log(e)
      }
      
  }

  async function GetDataCompanyUser({id_company, plan}){
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);
    var gbAll = 0
    if(plan === "Inicial"){
      gbAll = 5242880
    } 
    if(plan === 'Profissional'){
      gbAll = 10485760
    }
    if(plan === 'Empresarial'){
      gbAll = 20971520
    }
  
    if (docSnap.exists()) {
      var type = 'Mb'
      var sizeOfFiles = docSnap.data().size / 1024 //Transformando em megabyte
      if(sizeOfFiles >= 1000){
        sizeOfFiles = parseFloat((sizeOfFiles / 1024).toFixed(1))
        type = 'Gb'
      } else {
        sizeOfFiles = Math.ceil(sizeOfFiles)
      }
  
      
      var porcentage = (Math.ceil((docSnap.data().size * 100) / gbAll))

      if(porcentage > 100){
        porcentage = 100
      }
  
      const maxSize = gbAll / 1048576
      setDataCompany({
        id:docSnap.data().id, 
        contact:docSnap.data().contact, 
        questions:docSnap.data().questions,
        gbFiles:{type:type, size:sizeOfFiles, porcentage:porcentage},
        plan:{name:plan, maxSize:maxSize}
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
    const id = data[0].subscriptions.data[0].plan.id

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