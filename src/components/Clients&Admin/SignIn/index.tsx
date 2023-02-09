import * as Tabs from '@radix-ui/react-tabs';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState, useContext} from 'react';
import AppContext from '../AppContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../../firebase'
import ErrorFirebase from '../ErrorFirebase'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../../public/image/2core.png'
import { toast } from 'react-toastify';
import { signOut} from "firebase/auth";

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

  function SignIn(e: { preventDefault: () => void; }) {
    e.preventDefault()
    context.setLoading(true)
    signInWithEmailAndPassword(auth, dataUser.email, dataUser.password)
    .then((userCredential) => {
      if(userCredential.user.emailVerified){
        router.push("/Admin")
      } else {
        context.setLoading(false)
        signOut(auth)
        toast.error("Você não concluiu o cadastro da sua empresa.")
      }
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

    return (
      <section className="bg-primary w-screen min-h-screen h-full flex flex-col justify-center items-center text-black">
        <Image src={Logo} alt="Logo da empresa" priority height={150} width={150} className='rounded-full'/>
        <Tabs.Root  className="w-[400px] max-lsm:w-[320px]" defaultValue="tab1">
          <p className="text-[40px] font-poiretOne">Login</p>
          <p className="text-[25px]  font-poiretOne">Entre com os dados enviados</p>
          <Tabs.Content className="mt-[20px]" value="tab1">
            <form onSubmit={SignIn} className="outline-none">
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
        </Tabs.Root>
      </section>
  )
}

export default Signin;
