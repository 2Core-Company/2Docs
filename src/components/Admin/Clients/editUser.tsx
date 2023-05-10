'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import { userContext } from '../../../app/Context/contextUser';
import React, {useState, useEffect, useContext} from 'react'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase';
import { auth, storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import {DataUser} from '../../../types/users'
import { PhoneMask, CNPJMask } from '../../../Utils/Other/Masks';

  interface Props{
    contextUser:DataUser
    user:DataUser
    closedWindow:Function
    childToParentEdit:Function
  }

function EditUser({closedWindow, childToParentEdit, user, contextUser}:Props){
  const imageMimeType : RegExp = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState<DataUser>({id:user.id, id_company:user.id_company, permission:0, name: user.name, email:user.email, cnpj: user.cnpj, phone:user.phone, password:user.password, nameImage: user.nameImage, photo_url: user.photo_url, enterprises: user.enterprises, folders:user.folders})
  const [file, setFile] : Array<{name:string}> | any  = useState({name: "padraoCliente.png"})
  const [fileDataURL, setFileDataURL] = useState<string>(user.photo_url);
  const [eye , setEye] = useState(false)
  const domain = new URL(window.location.href).origin
  const [right, setRight] = useState("right-[-600px]")

  useEffect(() =>{
    setRight("right-0")
  },[])

  async function OnToast(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(UpdateDataUserAuth(), {pending:"Editando usuário...", success:"Usuário editado com sucesso", error:"Não foi possivel editar o usuário"})
  }

  //
  async function UpdateDataUserAuth() {
    if(dataUser.email != user.email){
      try{  
        const result:{data:{uid?:string, message: string; code: string; }} = await axios.post(`${domain}/api/users/updateUser`, {userId: user.id, data:{email: dataUser.email}, uid: auth.currentUser?.uid})
        if(result.data.uid){
          await UpdatePhoto()
        } else {
          ErrorFirebase(result.data)
        }
      }catch(e){
        console.log(e)
      }
    } else {
      await UpdatePhoto()
    }
  }

  async function UpdatePhoto(){
    const referencesFile:string = Math.floor(Math.random() * 65536) + file.name;
    if(fileDataURL != user.photo_url){
      try{
        if(file.name != "padraoCliente.png"){
          await DeletePhoto()
          const storageRef = ref(storage, contextUser.id_company +  "/images/" + referencesFile);
          const result = await uploadBytes(storageRef, file)
        }
      }catch(e){
        console.log(e)
      }finally{
        await GetUrlPhoto(referencesFile) 
      }
      
    } else {
      await UpdateBdUser({nameImage: user.nameImage, photo_url: user.photo_url})
    }
  }

  //Pega url da foto de perfil
  async function GetUrlPhoto(referencesFile:string) {
    var url = ""
    try{
      url  = await getDownloadURL(ref(storage, `${contextUser.id_company }/images/` + referencesFile))
    }catch(e){
      ErrorFirebase(e)
      console.log(e)
    }finally{
      await UpdateBdUser({nameImage: referencesFile, photo_url: url})
    }
  }

  async function DeletePhoto(){
    if(user.nameImage != "padraoCliente.png"){
      try{
        const desertRef = ref(storage, contextUser.id_company + '/images/' + user.nameImage);
        await deleteObject(desertRef).then((result) => {
        }).catch((error) => {
          console.log(error);
        });
      }catch(e){
        console.log(e)
      }
    }
  }

  async function UpdateBdUser(data){
    const userAfterEdit = {
      id: user.id,
      id_company:user.id_company,
      permission:0,
      enterprises:user.enterprises,
      name: dataUser.name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      photo_url: data.photo_url,
      nameImage: data.nameImage,
      status: user.status,
      created_date: user.created_date,
      folders:user.folders,
    }

    await (updateDoc(doc(db, 'companies', contextUser.id_company, "clients", user.id), userAfterEdit))

    childToParentEdit({...userAfterEdit, checked: false})
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

      if(photo.size < 9000){
        photo.value = null
        return toast.error("Está imagem é muito pequena")
      }
  
      if (!photo.type.match(imageMimeType)) {
        photo.value = null
        return toast.error("Não é permitido armazenar este tipo de arquivo, escolha uma imagem.")
      }
      setFile(photo);
      photo.value = null
    }
  }

  useEffect(() => {
    if(file.name != "padraoCliente.png"){
      let fileReader: any, isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e: { target: { result: any; }; }) => {
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


  return (
    <div className={`w-[600px] max-sm:w-screen absolute bg-[#DDDDDD] dark:bg-[#121212] min-h-screen pb-[100px] ${right} duration-300 flex flex-col items-center`}>
      <div className='bg-[#D2D2D2] dark:bg-white/10 flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full max-sm:z-50'>
          <DoubleArrowRightIcon onClick={() => closedWindow()} className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
          <p  className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Editar</p>
        </div>
        <form  onSubmit={OnToast} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
          <label className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={(e) => ChangePhoto(e.target)} />
            <Image src={fileDataURL} width={180} height={180} alt="preview" className='w-full h-full rounded-full border-[2px] border-secondary dark:border-dsecondary' /> 
          </label>

          <label  className='flex flex-col max-sm dark:text-white'>
            Nome
            <input type="text" maxLength={30} value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o nome do cliente'/>
          </label>

          <label className='flex flex-col dark:text-white'>
            Email
            <input required  value={dataUser.email} maxLength={40} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o email'/>
          </label>

          <label className='flex flex-col dark:text-white'>
            Senha provisória
            <div className='border-2 border-black dark:border-white rounded-[8px] flex items-center'>
              <input required type={eye ? "text" : "password"} value={dataUser.password} disabled={true} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
              {eye ? 
              <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              :
              <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer" />
              } 
            </div>
          </label>
          <div className='flex max-sm:flex-col justify-between gap-[5px] '>
            <label className='flex flex-col dark:text-white'>
              Cnpj
              <input maxLength={18} minLength={18} required  value={dataUser.cnpj} onChange={(Text) => CNPJMask({value:Text.target.value, setDataUser})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o CNPJ'/>
            </label>

            <label className='flex flex-col dark:text-white'>
              Telefone
              <input required  maxLength={15} minLength={15} value={PhoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o telefone'/>
            </label>
          </div>
          <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
              Salvar
          </button>
        </form>
      </div>
  )
}

export default EditUser;

