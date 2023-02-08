import * as Tabs from '@radix-ui/react-tabs';
import styles from "./signIn.module.css"
import { EyeClosedIcon, EyeOpenIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useState, useContext} from 'react';
import AppContext from '../AppContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db} from '../../../../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import ErrorFirebase from '../ErrorFirebase'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoPretoSemFundo from '../../../../public/image/Logo2CoreBrancoSemFundo.png'
import LogoBrancoSemFundo from '../../../../public/image/Logo2CorePretoSemFundo.png'
import { toast } from 'react-toastify';
import { useTheme } from "../../../hooks/useTheme"

function Signin(){
  const context = useContext(AppContext)
  const [dataUser, setDataUser] = useState<DataUser>({email: "", password: "", checked: false})
  const [eye, setEye] = useState(false)
  const router = useRouter()

  interface DataUser {
    email: string,
    password: string,
    checked: boolean
  }

  function SignInEmail(e: { preventDefault: () => void; }) {
    e.preventDefault()
    context.setLoading(true)
    SignIn(dataUser.email)
  }

  function SignIn(email: string) {
    signInWithEmailAndPassword(auth, email, dataUser.password)
    .then((userCredential) => {
      context.setLoading(false)
      router.push("/Admin")
    })
    .catch((error) => {
      context.setLoading(false)
      ErrorFirebase(error)
    });
  }

  function AlterPassword(email:string){
    if(dataUser.email === ""){
      return toast.error("Preencha o campo de email.")
    }
    sendPasswordResetEmail(auth, email)
    .then((data) => {
      context.setLoading(false)
      toast.success(`Enviamos um link para o email: ${email}, Verifique a caixa de SPAN.`)
    })
    .catch((error) => {
      context.setLoading(false)
      ErrorFirebase(error)
    });
  }

  const { theme, setTheme } = useTheme();

    return (
      <section className="bg-primary dark:bg-dprimary w-screen min-h-screen h-full flex flex-col justify-center items-center text-black">
        {theme == "light" ? (
        <Image src={LogoPretoSemFundo} alt="Logo da empresa" priority height={300} width={300} className='rounded-full'/>
        ) : (
        <Image src={LogoBrancoSemFundo} alt="Logo da empresa" priority height={300} width={300} className='rounded-full'/>
        )}
        <Tabs.Root  className="w-[400px] max-lsm:w-[320px]" defaultValue="tab1">
          <p className="text-[40px] font-poiretOne dark:text-white">Login</p>
          <p className="text-[25px]  font-poiretOne dark:text-white">Entre com os dados enviados</p>
          <Tabs.Content className="mt-[20px]" value="tab1">
            <form onSubmit={SignInEmail} className="outline-none">
              <fieldset className="flex flex-col">
                <label className="text-[18px] dark:text-white" htmlFor="Email">
                  Email
                </label>
                <input required type="email" value={dataUser.email} name="Email" onChange={(Text) => setDataUser({...dataUser, email: Text.target.value})} className="w-full text-[18px] dark:text-white bg-[#0000] outline-none py-[10px] border-[1px] border-black dark:border-white rounded-[8px] pl-[5px]" placeholder='Digite seu email' />
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px] dark:text-white" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center dark:border-white'>
                  <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] dark:text-white bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? (
                  <EyeOpenIcon onClick={() => setEye(false)} width={20} height={20} className="w-[40px] cursor-pointer dark:text-white"/>
                  ) : (
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer dark:text-white"/>
                  )}
                </div>
              </fieldset>
              <button type="button" onClick={() => AlterPassword(dataUser.email)} className='w-full flex justify-end underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</button>
              <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Entrar
              </button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </section>
  )
}

export default Signin;
