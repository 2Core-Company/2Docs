'use client'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState, useContext, useEffect, useRef, useReducer } from 'react';
import { loadingContext } from '../../../app/Context/contextLoading'
import { signInWithEmailAndPassword, onAuthStateChanged, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db } from '../../../../firebase'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify'; import { signOut } from "firebase/auth";
import { themeContext } from "../../../hooks/useTheme"
import { stripe } from '@/lib/stripe'
import axios from 'axios';
import { adminContext } from '@/src/app/Context/contextAdmin';
import { userContext } from '@/src/app/Context/contextUser';
import { doc, getDoc } from 'firebase/firestore';
import getCompany from '@/src/Utils/Firebase/Company/getCompany';

function Signin() {
  const contextLoading = useContext(loadingContext)
  const { setDataUser } = useContext(userContext)
  const { setDataAdmin } = useContext(adminContext)
  const [loginUser, setLoginUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(true)
  const [eye, setEye] = useState<boolean>(false)
  const checkbox = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const toastResetPassword = { pending: 'Resetando a senha', success: 'Enviamos um email para você redefinir sua senha.' }

  //Verifica se o usuário ja esta logado
  useEffect(() => {
    setDataUser({ id: '', created_date: 0, email: '', id_company: '', name: '', nameImage: '', verifiedEmail: true, permission: 0, phone: '', photo_url: '', fixed: false, enterprises: [], checked: false, admins: [], pendencies: 0 })
    setDataAdmin({ id: '', email: '', id_company: '', name: '', nameImage: '', verifiedEmail: true, photo_url: '', disabled: true, fixed: true, permission: 0, phone: '', pendencies: 0 })

    onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified && auth.currentUser) {
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.permission) {
            return router.replace("/Dashboard/Admin")
          } else {
            return router.replace("/Dashboard/Clientes")
          }
        })
      } else {
    setLoading(false)
        auth.setPersistence(browserSessionPersistence)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function OnChangePersistenceLogin(e) {
    if (e.target.checked) {
      checkbox?.current?.classList?.remove('appearance-none')
      auth.setPersistence(browserLocalPersistence)
    } else {
      checkbox?.current?.classList?.add('appearance-none')
      auth.setPersistence(browserSessionPersistence)
    }
  }

  function OnToastLogin(e: { preventDefault: () => void; }) {
    e.preventDefault()
    toast.promise(SignIn(), { pending: 'Entrando...', success: 'Você esta logado.' })
  }

  //Funçaõ de login
  async function SignIn() {
    try {
      await signInWithEmailAndPassword(auth, loginUser.email, loginUser.password)
    } catch (e) {
      contextLoading.setLoading(false)
      ErrorFirebase(e)
      throw e
    }
  }


  //Funçaõ de recuperar senha
  async function AlterPassword(email: string) {
    if (loginUser.email === "") {
      throw toast.error("Preencha o campo de email.")
    }
    const result = await axios.post('/api/users/resetPassword', {
      email: email
    })

    if (result.data != 'success') {
      ErrorFirebase({ message: result.data.message, code: result.data.code })
    }
  }


  const contextTheme = useContext(themeContext);

  if (loading) { return <></> }
  return (
    <section className="bg-primary dark:bg-dprimary w-full min-h-screen h-full flex flex-col  items-center justify-center text-black">
      <ToastContainer autoClose={3000} />

      {contextTheme.theme == "light" ? (
        <Image src={'/image/Logo2CorePretoSemFundo.svg'} width={150} height={150} alt="Logo da empresa" priority quality={100} className='max-lg:w-[130px] max-lg:h-[130px] max-sm:w-[110px] max-sm:h-[110px]' />
      ) : (
        <Image src={'/image/Logo2CoreBrancoSemFundo.svg'} width={150} height={150} alt="Logo da empresa" priority quality={100} className='w-[150px] h-[150px]' />
      )}
      <div className="w-[400px] max-lsm:w-[330px] mt-[20px]" defaultValue="tab1">
        <p className="text-[40px] font-poiretOne dark:text-white">Login</p>
        <p className="text-[25px]  font-poiretOne dark:text-white mt-[5px]">Entre com os dados enviados</p>
        <form onSubmit={OnToastLogin} className="outline-none mt-[20px]">
          <fieldset className="flex flex-col">
            <label className="text-[18px] dark:text-white" htmlFor='divEmail'>
              Email
            </label>
            <input id='divEmail' required type="email" autoComplete={"off"} value={loginUser.email} name="Email" onChange={(Text) => setLoginUser({ ...loginUser, email: Text.target.value })} className="w-full text-[18px] bg-transparent dark:text-white outline-none py-[10px] max-sm:py-[6px] border-[1px] border-black dark:border-white rounded-[8px] px-[15px] mt-[6px] placeholder-[#9E9E9E]" placeholder='Digite seu email' />
          </fieldset>
          <fieldset className="flex flex-col mt-[20px]">
            <label className="text-[18px] dark:text-white" htmlFor='divPassword'>
              Senha
            </label>
            <div className='flex py-[10px] max-sm:py-[6px] px-[15px] border-[1px] border-black rounded-[8px] items-center dark:border-white mt-[6px]'>
              <input id='divPassword' required minLength={8} autoComplete='current-password' type={eye ? "text" : "password"} onChange={(Text) => setLoginUser({ ...loginUser, password: Text.target.value })} className="w-full text-[18px] bg-transparent dark:text-white outline-none  placeholder-[#9E9E9E]" placeholder='Digite sua senha' />
              {eye ? (
                <EyeOpenIcon onClick={() => setEye(false)} width={20} height={20} className="w-[40px] cursor-pointer dark:text-white" />
              ) : (
                <EyeClosedIcon onClick={() => setEye(true)} width={20} height={20} className="w-[40px] cursor-pointer dark:text-white" />
              )}
            </div>
          </fieldset>
          <div className='flex justify-between mt-[15px]'>
            <div className='flex items-center'>
              <input id='checkBoxLogin' ref={checkbox} onChange={(e) => OnChangePersistenceLogin(e)} type="checkbox" className="appearance-none accent-gray-600 dark:accent-dhilight w-[20px] h-[20px] border-[1px] border-[#686868] dark:border-dhilight rounded-[3px] cursor-pointer max-sm:w-[18px] max-sm:h-[18px]" />
              <p className='ml-[5px] text-[#686868] text-[18px] max-lsm:text-[16px] dark:text-dhilight '>Lembrar de mim</p>
            </div>
            <button type="button" onClick={() => toast.promise(AlterPassword(loginUser.email), toastResetPassword)} className='hover:brightness-[.85] underline text-[18px] max-lsm:text-[16px]  text-dblue cursor-pointer'>
              Esqueci a senha
            </button>
          </div>

          <button type="submit" className='mb-[10px] hover:brightness-[.85] text-[#fff] cursor-pointer text-[22px] max-sm:text-[20px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
            Entrar
          </button>
        </form>
      </div>
    </section>
  )
}

export default Signin;
