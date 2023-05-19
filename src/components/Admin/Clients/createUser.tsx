'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase';
import { auth, storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/users'
import { v4 as uuidv4 } from 'uuid';
import { CNPJMask } from '../../../Utils/Other/Masks';
import { PhoneMask } from '../../../Utils/Other/Masks';
import { Enterprise } from '../../../types/others';

interface Props{
  contextUser:DataUser
  childToParentCreate:Function
  closedWindow:Function
}

function CreateUser({childToParentCreate, closedWindow, contextUser}:Props){
  const imageMimeType : RegExp = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState<DataUser>({id:"", name: "", email:"", cnpj: "", phone:"", password:"", id_company:"", permission:0, photo_url:'', enterprises:[]})
  const [file, setFile] = useState<{name: string} | any>({name: "padraoCliente.png"})
  const [fileDataURL, setFileDataURL] = useState<string | undefined>(undefined);
  const [eye , setEye] = useState(true)
  const domain:string = new URL(window.location.href).origin
  const [enterprise, setEnterprise] = useState<Enterprise>({
    name:"", 
    id:uuidv4(), 
    folders:[        
      {color:"#005694", name: "Cliente", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, docs:0, id:uuidv4()}, 
      {color:"#C7A03C", name: "Favoritos", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, docs:0, id:uuidv4()},
      {color:"#9E9E9E", name: "Lixeira", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, docs:0, id:uuidv4()} 
    ]
  })

  //Acionar o toast
  async function OnToast(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(SignUp(),{pending: "Criando usuário...", success:"Usuário criado com sucesso", error:"Não foi possível criar este usuário"})
  }

  //Cria o usuário no auth
  async function SignUp() {
    const data ={
      email: dataUser.email,
      password: dataUser.password,
      id_company:contextUser.id_company
    }
    try{
      const result = await axios.post(`${domain}/api/users/createUser`, {data: data, uid: auth.currentUser?.uid})
      if(result.data.uid){
        const id = result.data.uid
        await UploadPhoto(id)
      } else {
        ErrorFirebase(result.data)
        throw Error
      }
    } catch (e){
      console.log(e)
      throw Error
    }
  }

  //Armazena a foto de perfil do usuário
  async function UploadPhoto(id:string) {
    var referencesFile 
    try{
      if(file.name != "padraoCliente.png"){
        referencesFile = Math.floor(Math.random() * 65536) + file.name;
        const storageRef = ref(storage, `${contextUser.id_company }/images/` + referencesFile);
        const result = await uploadBytes(storageRef, file)
      } else {
        referencesFile = "padraoCliente.png"
        const url = 'https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/padraoCliente.png?alt=media&token=ccd2b303-b4f2-49a0-a1b3-e78ed0921b8f'
        SignUpDb({url: url, referencesFile: "padraoCliente.png", id: id})
      }
    }catch(e){
      ErrorFirebase(e)
      console.log(e)
      throw e
    } finally {
      if(file.name != "padraoCliente.png"){
        await GetUrlPhoto(referencesFile, id)
      }
    }

  }

  //Pega url da foto de perfil
  async function GetUrlPhoto(referencesFile:string, id:string) {
    var url = ""
    try{
      url  = await getDownloadURL(ref(storage, `${contextUser.id_company }/images/` + referencesFile))
    }catch(e){
      ErrorFirebase(e)
      console.log(e)
      url = 'https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/padraoCliente.png?alt=media&token=ccd2b303-b4f2-49a0-a1b3-e78ed0921b8f'
      throw e
    } finally {
      SignUpDb({url: url, referencesFile: referencesFile, id: id})
    }
  }
  
  //Armazena o arquivo no firestore
  async function SignUpDb(user:{id:string, url:string, referencesFile:string}){
    var name = (dataUser.name[0].toUpperCase() + dataUser.name.substring(1))
    var date = new Date() + ""
    
    let data: DataUser = {
      id: user.id,
      name: name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      id_company: contextUser.id_company,
      photo_url: user.url,
      nameImage: user.referencesFile,
      created_date: date,
      status: false,
      permission: 0,
      fixed:false,
      enterprises:[
        enterprise
      ]
    }

    childToParentCreate({...data, checked: false})

    try {
      const docRef = await setDoc(doc(db, "companies", contextUser.id_company, "clients", user.id), data);
    } catch (e) {
      console.log(e)
      toast.error("Não foi possível criar o usuário.")
    }
  }

  //Trocar foto de perfil
  async function ChangePhoto(photos){
    for await (const photo of photos.files) {
      if(photo.size < 9000){
        photo.value = null
        return toast.error("Está imagem é muito pequena")
      }

      if(photo.size > 10000000){
        photo.value = null
        return toast.error("Está imagem é grande, só é permitido imagens de até 10mb")
      }
  
      if (!photo.type.match(imageMimeType)) {
        photo.value = null
        return toast.error("Não é permitido armazenar este tipo de arquivo, escolha uma imagem.")
      }
      setFile(photo);
      photo.value = null
    }
  }

  //Trocar foto de perfil
  useEffect(() => {
    if(file.name != "padraoCliente.png"){
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

  //gerar senha aleatório
  useEffect(() => {
    const password = dataUser.name.substr(0, 5).replace(/\s+/g, '') + Math.floor(Math.random() * 100000)
    setDataUser({...dataUser, password: password})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dataUser.name])

  return (
    <div className={`w-[600px] max-sm:w-screen absolute bg-[#DDDDDD] dark:bg-[#121212] min-h-screen pb-[100px] right-0 flex flex-col items-center`}>
      <div className='bg-[#D2D2D2] dark:bg-white/10 flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full max-sm:z-50'>
        <DoubleArrowRightIcon onClick={() => closedWindow()} className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px] max-sm:h-[35px] absolute left-[5px]'/>
        <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Cadastrar</p>
      </div>
      <form  onSubmit={OnToast} className='w-full px-[10%] flex flex-col gap-y-[5px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
        {fileDataURL != undefined ?
          <div className='self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[10px] max-sm:mt-[10px] relative'>
            <Image src={fileDataURL} width={180} height={180} alt="preview" className='border-[2px] w-full h-full rounded-full'/> 
            <div onClick={()=> (setFileDataURL(undefined), setFile({name:"padraoCliente.png"}))} className='cursor-pointer absolute right-[-10px] top-[5px] w-[30px] h-[4px] bg-strong rotate-45 after:w-[30px] after:h-[4px] after:bg-strong after:block after:rotate-90 '></div>
          </div>
        : 
          <label  className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] bg-gradient-to-b from-[#D2D2D2] to-[#9E9E9E] border-secondary dark:border-dsecondary rounded-full mt-[10px] max-sm:mt-[10px]'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={ (e) => ChangePhoto(e.target)}/>
          </label>
        }

        <label  className='flex flex-col dark:text-white'>
          Nome
          <input type="text" maxLength={30} value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o nome da empresa'/>
        </label>

        <label className='flex flex-col dark:text-white'>
          Email
          <input required  maxLength={40} value={dataUser.email} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full  p-[5px] bg-transparent border-2 border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o email'/>
        </label>

        <div className='flex max-sm:flex-col justify-between gap-[5px] w-full'>
          <label className='flex flex-col w-[50%] max-sm:w-full dark:text-white'>
            CNPJ
            <input maxLength={18} minLength={18} required  value={dataUser.cnpj} onChange={Text => CNPJMask({value:Text.target.value, setDataUser})} type="text"   className=' outline-none w-full  p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o CNPJ'/>
          </label>

          <label className='flex flex-col w-[50%] max-sm:w-full dark:text-white'>
            Telefone
            <input maxLength={15} minLength={15} required  value={PhoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o telefone'/>
          </label>
        </div>

        <div className='flex max-sm:flex-col justify-between gap-[5px] w-full'>
          <label className='flex flex-col w-[50%] max-sm:w-full dark:text-white'>
            Empresa
            <input maxLength={30} required onChange={(Text) => setEnterprise({...enterprise, name:Text.target.value})} type="text"   className=' outline-none w-full  p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Nome da empresa'/>
          </label>

          <label className='flex flex-col w-[50%] dark:text-white'>
            Senha
            <div className='border-2 border-black dark:border-white rounded-[8px] flex items-center'>
              <input required type={eye ? "text" : "password"} value={dataUser.password} minLength={8} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className='outline-none w-full p-[5px] bg-transparent dark:placeholder:text-gray-500' placeholder='Senha'/>
              {eye ?
                <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              : 
                <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              }
            </div>
          </label>
        </div>

        <button type="submit" className='hover:scale-105 text-white cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
          Salvar
        </button>
      </form>
    </div>
  )
}

export default CreateUser;