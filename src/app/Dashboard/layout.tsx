'use client'
import NavBar from '../../components/Clients&Admin/NavBar'
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { useState, useEffect, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { getDoc, doc } from "firebase/firestore";
import { userContext } from '../Context/contextUser'
import { adminContext } from '../Context/contextAdmin'
import { companyContext } from '../Context/contextCompany';
import { stripe } from '@/lib/stripe'
import { toast, ToastContainer } from 'react-toastify';
import { setOnlineUsers } from '../../Utils/Firebase/Company/OnlineUsers';
import { GetUser } from '../../Utils/Firebase/Users/GetUsers';
import AddToHomeScreen from '@/src/components/AddToHomeScreen/AddToHomeScreen';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setDataUser } = useContext(userContext);
  const { setDataAdmin } = useContext(adminContext);
  const { setDataCompany } = useContext(companyContext);
  const [onLoad, setOnLoad] = useState(false);
  const router = useRouter();
  const [propsNavBar, setPropsNavBar] = useState({ urlImage: '', permission: 0, name: '' });
  const url = usePathname();

  //Verificação se o usuário esta logado e se é um admin ou um cliente
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return router.push("/")
      }

      const idTokenResult = await auth.currentUser?.getIdTokenResult()

      const { data } = await stripe.customers.search({
        query: 'metadata[\'id_company\']:\'' + user.displayName + '\'',
        limit: 1,
        expand: ['data.subscriptions']
      })
        .catch(err => err)

      const status = data[0]?.subscriptions.data[0]?.status

      if (status != 'active' && status != 'trialing' && data.length != 0) {
        signOut(auth)
        toast.error("Você não tem um plano do 2Docs ativo.")
        return router.replace('/')
      }

      await Promise.all([
        GetDataUser(user, idTokenResult?.claims.permission),
        GetDataCompanyUser({ id_company: user.displayName, data })
      ])

      if (!onLoad) {
        setOnLoad(true)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    VerifyPermision()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])


  async function VerifyPermision() {
    const idTokenResult = await auth.currentUser?.getIdTokenResult()
    if (idTokenResult?.claims.permission > 0 && url?.includes('/Dashboard/Clientes')) {
      return router.replace("/Dashboard/Admin")
    }

    if (idTokenResult?.claims.permission === 0 && url?.includes('/Dashboard/Admin')) {
      router.replace("/Dashboard/Clientes")
    }
  }

  //Pegando credenciais dos usuários
  async function GetDataUser(user, permission) {
    try {
      if (user.displayName) {
        const allDataUser = await GetUser({ id_company: user.displayName, id_user: user.uid })
        setPropsNavBar({ urlImage: allDataUser.photo_url, permission: permission, name: allDataUser.name })

        if (allDataUser.permission === 0) {
          setDataUser(allDataUser)

          setOnlineUsers({
            id_company: allDataUser.id_company,
            id_user: allDataUser.id,
            img: allDataUser.photo_url,
            name: allDataUser.name
          })

        } else {
          setDataAdmin(allDataUser)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }


  async function GetDataCompanyUser({ id_company, data }) {
    const maxSize = await SearchCostumer({ data })
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (docSnap?.data().id && docSnap?.data().name) {
        setDataCompany({
          id: docSnap?.data().id,
          name: docSnap.data().name,
          contact: docSnap.data().contact,
          questions: docSnap.data().questions,
          maxSize: maxSize,
          domain: docSnap.data().domain
        })
      } else {
        signOut(auth)
        return router.replace('/')
      }
    }
  }


  async function SearchCostumer({ data }) {
    const id = data[0]?.subscriptions.data[0]?.plan.id

    if (id == 'price_1MX5uXBC8E6EzctJ1TMCPSoE') {
      return 21474836480
    } else if (id == 'price_1MX5uXBC8E6EzctJ1qaXp8ho') {
      return 21474836480
    } else if (id == 'price_1MX5u3BC8E6EzctJlS8NCOJF') {
      return 10737418240
    } else if (id == 'price_1MX5u3BC8E6EzctJLblqdVuF') {
      return 10737418240
    } else if (id == 'price_1MX5tXBC8E6EzctJCEiUGV4h') {
      return 5368709120
    } else if (id == 'price_1MX5tXBC8E6EzctJiSSGnlWw') {
      return 5368709120
    } else {
      return  157286400
    }
  }

  if (onLoad)
    return (
      <section className='flex'>
        <AddToHomeScreen />
        <ToastContainer autoClose={3000} />
        <NavBar image={propsNavBar.urlImage} permission={propsNavBar.permission} name={propsNavBar.name} />
        <main className='w-full px-[50px] max-md:px-[10px]'>{children}</main>
      </section>
    );
}
