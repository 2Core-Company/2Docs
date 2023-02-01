import * as Tabs from '@radix-ui/react-tabs';
import styles from "./signIn.module.css"
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState, useContext} from 'react';
import AppContext from '../AppContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db} from '../../../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import ErrorFirebase from '../ErrorFirebase'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../public/image/2core.png'
import { toast } from 'react-toastify';

function Signin(){
  const context = useContext(AppContext)
  const [dataUser, setDataUser] = useState<DataUser>({email: "", password: "", cnpj:"", checked: false})
  const [eye, setEye] = useState(false)
  const router = useRouter()
  
  interface DataUser{
    email: string,
    password: string,
    cnpj: string,
    checked: boolean
  }

  function SignInEmail(e: { preventDefault: () => void; }){
    e.preventDefault()
    context.setLoading(true)
    SignIn(dataUser.email)
  }

  async function SignInCnpj(e: { preventDefault: () => void; }){
    e.preventDefault()
    context.setLoading(true)
    const q = query(collection(db, "users"), where("cnpj", "==", dataUser.cnpj))
    const data = await getDocs(q);
    if(data.docs[0] === undefined){
      context.setLoading(false)
      toast.error("Este usuário não foi cadastrado.")
    } else {
      data.forEach((doc) => {
        SignIn(doc.data().email)
      });
    }
  }
  
  function SignIn(email:string){
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

  const cnpjMask = (value:string) => {
    return value
    .replace(/\D+/g, '')
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
  }

  async function AlterPasswordCnpj(){
    if(dataUser.cnpj === ""){
      return toast.error("Preencha o campo de cnpj.")
    }
    context.setLoading(true)
    const q = query(collection(db, "users"), where("cnpj", "==", dataUser.cnpj))
    const data = await getDocs(q);
    if(data.docs[0] === undefined){
      context.setLoading(false)
      toast.error("Este usuário não foi cadastrado.")
    } else {
      data.forEach((doc) => {
        AlterPassword(doc.data().email)
      });
    }
  }

    return (
      <section className="bg-primary w-screen min-h-screen h-full flex flex-col justify-center items-center text-black">
        <Image src={Logo} alt="Logo da empresa" priority height={150} width={150} className='rounded-full'/>
        <Tabs.Root  className="w-[400px] max-lsm:w-[320px]" defaultValue="tab1">
  
          <p className="text-[40px] font-poiretOne">Login</p>
          <p className="text-[25px]  font-poiretOne">Entre com os dados enviados</p>
          <Tabs.List className="w-full mt-[20px] border-b-2 border-black flex justify-between" aria-label="Manage your account">
            <Tabs.Trigger id={styles.tabsTrigger1} className={`text-[22px] w-[50%] rounded-tl-[8px] py-[5px]}`}value="tab1">
              Email
            </Tabs.Trigger>
            <Tabs.Trigger id={styles.tabsTrigger2} className={`text-[22px] w-[50%] rounded-tr-[8px] py-[5px]`}value="tab2">
              CNPJ
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="mt-[20px]" value="tab1">
            <form onSubmit={SignInEmail} className="outline-none">
              <fieldset className="flex flex-col">
                <label className="text-[18px]" htmlFor="Email">
                  Email
                </label>
                <input required type="email" value={dataUser.email} name="Email" onChange={(Text) => setDataUser({...dataUser, email: Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px] border-[1px] border-black rounded-[8px] pl-[5px]" placeholder='Digite seu email' />
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px]" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                  <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                </div>
              </fieldset>
              <button type="button" onClick={() => AlterPassword(dataUser.email)} className='w-full flex justify-end underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</button>
              <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Entrar
              </button>
            </form>
          </Tabs.Content>
          <Tabs.Content className="mt-[20px] TabsContent" value="tab2">
          <form onSubmit={SignInCnpj} className="">
              <fieldset className="flex flex-col">
                <label className='text-[18px]'>
                  Cnpj
                  <input maxLength={18} required  value={cnpjMask(dataUser.cnpj)} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className='w-full text-[18px] bg-[#0000] outline-none py-[10px] flex pl-[5px] border-[1px] border-black rounded-[8px]' placeholder='Digite o CNPJ'/>
                </label>
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px]" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                  <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                </div>
              </fieldset>
              <button type="button" onClick={() => AlterPasswordCnpj()} className='w-full flex justify-end underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</button>
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
