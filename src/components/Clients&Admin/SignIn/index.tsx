'use client'
import * as Tabs from '@radix-ui/react-tabs';
import { EyeClosedIcon, EyeOpenIcon} from '@radix-ui/react-icons';
import { useState, useContext, useEffect } from 'react';
import { loadingContext } from '../../../app/Context/contextLoading'
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../../firebase'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';import { signOut} from "firebase/auth";
import { useTheme } from "../../../hooks/useTheme"
import { stripe } from '../../../../lib/stripe'
import Logo2CorePretoSemFundo from '../../../../public/image/Logo2CorePretoSemFundo.svg'
import Logo2CoreBrancoSemFundo from '../../../../public/image/Logo2CoreBrancoSemFundo.svg'

function Signin(){
  const contextLoading = useContext(loadingContext)
  const [loginUser, setLoginUser] = useState({email: '', password: ''});
  const [loading , setLoading] = useState<boolean>(true)
  const [eye, setEye] = useState<boolean>(false)
  const router = useRouter()

  //Verifica se o usuário ja esta logado
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified && auth.currentUser) {
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims.permission){
            return router.replace("/Dashboard/Admin")
          } else {
            return router.replace("/Dashboard/Clientes")
          }
        })
      } else {
        setLoading(false)
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function OnToastLogin(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(SignIn(),{pending:'Entrando...', success:'Você esta logado.'})
  }

  //Funçaõ de login
  async function SignIn() {
    try{
      const userCredential = await signInWithEmailAndPassword(auth, loginUser.email, loginUser.password)
      const {data} = await stripe.customers.search({
        query: 'metadata[\'id_company\']:\'' +userCredential.user.displayName+ '\'',
        limit: 1,
        expand: ['data.subscriptions']
      })
      .catch(err => err)
      const status = data[0]?.subscriptions.data[0]?.status

      if(!userCredential.user.emailVerified){
        signOut(auth)
        throw toast.error("Seu email não foi confirmado.")
      }

      if(status != 'active'){
        signOut(auth)
        throw  toast.error("Você não tem um plano do 2Docs ativo.")
      }

      const idTokenResult = await auth.currentUser?.getIdTokenResult()
      if(idTokenResult?.claims.permission > 0){
        router.replace("/Dashboard/Admin")      
      }  else {
        router.replace("/Dashboard/Clientes")    
      }

    } catch(e){
      contextLoading.setLoading(false)
      ErrorFirebase(e)
      throw e
    }
  }

  //Funçaõ de recuperar senha
  async function AlterPassword(email:string){
    if(loginUser.email === ""){
      return toast.error("Preencha o campo de email.")
    }
    try{
      const result = await sendPasswordResetEmail(auth, email)
      contextLoading.setLoading(false)
      toast.success(`Enviamos um link para o email: ${email}, Verifique a caixa de SPAN.`)
    }catch(e){
      contextLoading.setLoading(false)
      ErrorFirebase(e)
    }
  }

  const { theme } = useTheme();

  if(loading){return <></>}
    return(
      <section className="bg-primary dark:bg-dprimary w-full min-h-screen h-full flex flex-col  items-center text-black">
        <ToastContainer autoClose={3000} />
        {theme == "light" || theme == undefined ? (
          <Image src={Logo2CorePretoSemFundo} alt="Logo da empresa" priority height={3000} width={3000} className='max-md:h-[250px] max-md:w-[250px]'/>
        ) : (
          <Image src={Logo2CoreBrancoSemFundo} alt="Logo da empresa" priority  className='w-[300px]'/>
        )}
        <Tabs.Root  className="w-[400px] max-lsm:w-[320px] pb-[15px]" defaultValue="tab1">
          <p className="text-[40px] font-poiretOne dark:text-white">Login</p>
          <p className="text-[25px]  font-poiretOne dark:text-white">Entre com os dados enviados</p>
          <Tabs.Content className="mt-[20px]" value="tab1">
            <form onSubmit={OnToastLogin} className="outline-none">
              <fieldset className="flex flex-col">
                <label className="text-[18px] dark:text-white" htmlFor="Email">
                  Email
                </label>
                <input required type="email" autoComplete='email' value={loginUser.email} name="Email" onChange={(Text) => setLoginUser({...loginUser, email: Text.target.value})} className="w-full text-[18px] dark:text-white bg-[#0000] outline-none py-[10px] border-[1px] border-black dark:border-white rounded-[8px] pl-[5px]" placeholder='Digite seu email' />
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px] dark:text-white" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center dark:border-white'>
                  <input required minLength={8} autoComplete='current-password' type={eye ? "text" : "password"} onChange={(Text) => setLoginUser({...loginUser, password:Text.target.value})} className="w-full text-[18px] dark:text-white bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? (
                  <EyeOpenIcon onClick={() => setEye(false)} width={20} height={20} className="w-[40px] cursor-pointer dark:text-white"/>
                  ) : (
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer dark:text-white"/>
                  )}
                </div>
              </fieldset>
              <button type="button" onClick={() => AlterPassword(loginUser.email)} className='w-full flex justify-end underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</button>
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
