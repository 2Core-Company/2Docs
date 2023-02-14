/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useEffect, useContext} from 'react'
import ErrorFirebase from '../../Clients&Admin/ErrorFirebase';
import { auth, storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { collection, where, getDocs, query } from "firebase/firestore";
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/interfaces'
import AppContext from '../../Clients&Admin/AppContext';

  interface Props{
    childToParentCreate:Function
    closedWindow:Function
  }

function CreateUser({childToParentCreate, closedWindow}:Props){
  const context = useContext(AppContext)
  const imageMimeType : RegExp = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState<DataUser>({name: "", email:"", cnpj: "", phone:"", password:"", id_company:""})
  const [file, setFile] = useState<{name: string} | any>({name: "padrao.png"})
  const [fileDataURL, setFileDataURL] = useState<string>(undefined);
  const [eye , setEye] = useState(true)
  const domain:string = new URL(window.location.href).origin
  const [right, setRight] = useState("right-[-600px]")

  useEffect(() =>{
    setRight("right-0")
  },[])

  async function VerifyCnpj(e: { preventDefault: () => void; }){
    e.preventDefault()
    var user = undefined
    const q = query(collection(db, "users"), where("cnpj", "==", dataUser.cnpj));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {user = doc.data() });
    if(user != undefined){
      toast.error("Este CNPJ já está cadastrado.")
    } else {
      toast.promise(SignUp(),{pending: "Criando usuário.", success:"Usuário criado com sucesso", error:"Não foi possivel criar um usuário"})
    }
  }

  async function UploadPhoto(id:string) {
    const referencesFile = Math.floor(Math.random() * 65536) + file.name;
    if(file.name != "padrao.png"){
      const storageRef = ref(storage, `${context.dataUser.id_company }/images/` + referencesFile);
      uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(ref(storage, `${context.dataUser.id_company }/images/` + referencesFile))
        .then((url) => { SignUpDb({url: url, referencesFile: referencesFile, id: id}) })
        .catch((error) => {
          console.log(error)
        }); 
      })
      .catch((error) => {
        ErrorFirebase(error)
      });
    } else {
      getDownloadURL(ref(storage, 'padrao.png'))
      .then((url) => {
        SignUpDb({url: url, referencesFile: "padrao.png", id: id})
      })
      .catch((error) => {
        console.log(error)
      });
    }
  }
  
  async function SignUpDb(user:{id:string, url:string, referencesFile:string}){
    var name = (dataUser.name[0].toUpperCase() + dataUser.name.substring(1))
    var date = new Date() + ""
    const data = {
      id: user.id,
      name: name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      id_company: context.dataUser.id_company,
      photo_url: user.url,
      nameImage: user.referencesFile,
      created_date: date,
      status: false,
      checked: false,
      permission: 0,
      fixed:false,
      folders: [
        {color:"#005694", name: "Cliente"},
        {color:"#C7A03C", name: "Favoritos"}
      ]
    }
    childToParentCreate(data)
    try {
      const docRef = await setDoc(doc(db, "users", context.dataUser.id_company, "Clientes", user.id), {
        id: user.id,
        name: name,
        email: dataUser.email,
        cnpj: dataUser.cnpj,
        password: dataUser.password,
        phone: dataUser.phone,
        id_company: context.dataUser.id_company,
        photo_url: user.url,
        nameImage: user.referencesFile,
        created_date: date,
        status: false,
        permission: 0,
        fixed:false,
        folders: [        
          {color:"#005694", name: "Cliente"},
          {color:"#C7A03C", name: "Favoritos"}
        ]
      });
    } catch (e) {
      console.log(e)
      toast.error("Não foi possivel criar o usuário.")
    }
  }

  async function SignUp() {
    const data ={
      email: dataUser.email,
      password: dataUser.password,
      id_company:context.dataUser.id_company
    }
    try{
      const result = await axios.post(`${domain}/api/users/createUser`, {data: data, uid: auth.currentUser.uid})
      if(result.data.uid){
        const id = result.data.uid
        UploadPhoto(id)
      } else {
        ErrorFirebase(result.data)
        throw Error
      }
    } catch (e){
      console.log(e)
      throw Error
    }
  }

  const phoneMask = (value:string) => {
  return value
    .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
    .replace(/^(\d{2})(\d)/g,"($1) $2")
    .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
  }

  const changeHandler = (e : any) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      return toast.error("Não é permitido armazenar este tipo de arquivo, escolha uma imagem.")
    }
    setFile(file);
  }

  useEffect(() => {
    if(file.name != "padrao.png"){
      let fileReader, isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setFileDataURL(result)
          }
        }
        fileReader.readAsDataURL(file);
      }
      return () => {
        isCancel = true;
        if (fileReader && fileReader.readyState === 1) {
          fileReader.abort();
        }
      }
    }
  }, [file]);

  useEffect(() => {
    const password = dataUser.name.substr(0, 5).replace(/\s+/g, '') + Math.floor(Math.random() * 100000)
    setDataUser({...dataUser, password: password})
  },[dataUser.name])

  const cnpjMask = (value:string) => {
    return value
    .replace(/\D+/g, '')
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
  }

return (
    <>
      <div className={`w-[600px] max-sm:w-screen absolute bg-[#DDDDDD] dark:bg-[#121212] min-h-screen pb-[100px] ${right} duration-300 flex flex-col items-center`}>
        <div className='bg-[#D2D2D2] dark:bg-white/10 flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full max-sm:z-50'>
          <DoubleArrowRightIcon onClick={() => closedWindow()} className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px] max-sm:h-[35px] absolute left-[5px]'/>
          <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Cadastrar</p>
        </div>
        <form  onSubmit={VerifyCnpj} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
        {fileDataURL != undefined ?
          <div className='self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
            <Image src={fileDataURL} width={180} height={180} alt="preview" className='border-[2px] w-full h-full rounded-full'/> 
            <div onClick={()=> (setFileDataURL(undefined), setFile({name:"padrao.png"}))} className='cursor-pointer absolute right-[-10px] top-[5px] w-[30px] h-[4px] bg-strong rotate-45 after:w-[30px] after:h-[4px] after:bg-strong after:block after:rotate-90 '></div>
          </div>
        : 
          <label  className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] bg-gradient-to-b from-[#D2D2D2] to-[#9E9E9E] border-secondary dark:border-dsecondary rounded-full mt-[30px] max-sm:mt-[15px]'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
          </label>
        }

          <label  className='flex flex-col max-sm dark:text-white'>
            Nome
            <input type="text" maxLength={30} value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o nome da empresa'/>
          </label>

          <label className='flex flex-col dark:text-white'>
            Email
            <input required  maxLength={40} value={dataUser.email} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full  p-[5px] bg-transparent border-2 border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o email'/>
          </label>

          <label className='flex flex-col w-full dark:text-white'>
            Senha
            <div className='border-2 border-black dark:border-white rounded-[8px] flex items-center'>
              <input required type="text" value={dataUser.password} minLength={8} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className='outline-none w-full p-[5px] bg-transparent dark:placeholder:text-gray-500' placeholder='Senha'/>
              {eye ?
                <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              : 
                <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              }
            </div>
          </label>

          <div className='flex max-sm:flex-col justify-between gap-[5px] w-full'>
            <label className='flex flex-col w-[50%] max-sm:w-full dark:text-white'>
              Cnpj
              <input maxLength={18} required  value={cnpjMask(dataUser.cnpj)} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className=' outline-none w-full  p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o CNPJ'/>
            </label>

            <label className='flex flex-col w-[50%] max-sm:w-full dark:text-white'>
              Telefone
              <input maxLength={15} required  value={phoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o telefone'/>
            </label>
          </div>
          <button type="submit" className='hover:scale-105 text-white cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
              Salvar
          </button>
        </form>
      </div>
    </>
  )
  }

export default CreateUser;