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
import { DataUser, DataUserContext } from '../../../types/users'
import { PhoneMask } from '../../../Utils/Other/Masks';

  interface Props{
    contextAdmin:DataUserContext
    user:DataUser
    closedWindow:Function
    childToParentEdit:Function
  }

function EditUser({closedWindow, childToParentEdit, user, contextAdmin}:Props){
  const imageMimeType : RegExp = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState<DataUser>({id:user.id, id_company:user.id_company, permission:0, name: user.name, email:user.email, phone:user.phone, nameImage: user.nameImage, pendencies:user.pendencies, photo_url: user.photo_url, enterprises: user.enterprises, admins: [], verifiedEmail:user.verifiedEmail, created_date:user.created_date})
  const [file, setFile] = useState<any>()
  const domain = new URL(window.location.href).origin
  const genericUrl = `https://ui-avatars.com/api/?name=${dataUser.name}&background=10b981&color=262626&format=svg`

  async function OnToast(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(UpdateDataUserAuth(), {pending:"Editando usuário...", success:"Usuário editado com sucesso"})
  }

  async function UpdateDataUserAuth() {
    if(dataUser.email != user.email){
      if(!user.verifiedEmail){
        throw toast.error('Não é possivel editar o email de um usuário pendente.')
      }

      try{  
        const result = await axios.post(`${domain}/api/users/updateUser`, {userId: user.id, data:{email: dataUser.email}, uid: auth.currentUser?.uid})
        if(result.data.uid){
          await UpdatePhoto()
        } else {
          ErrorFirebase(result.data)
          throw Error
        }
      }catch(e){
        console.log(e)
        throw Error
      }
    } else {
      await UpdatePhoto()
    }
  }

  async function UpdatePhoto(){
    if(dataUser.photo_url != user.photo_url){
      if(user.nameImage != ''){
        await DeletePhoto()
      }
      if(file){
        const referencesFile:string = Math.floor(Math.random() * 65536) + file.name;
        try{
          const storageRef = ref(storage, contextAdmin.id_company +  "/images/" + referencesFile);
          const result = await uploadBytes(storageRef, file)
          const url = await GetUrlPhoto({result}) 
          await UpdateBdUser({nameImage: referencesFile, photo_url: url})
        }catch(e){
          console.log(e)
        }
      } else {
        await UpdateBdUser({nameImage: '', photo_url: genericUrl})
      }

    } else {
      await UpdateBdUser({nameImage: user.nameImage, photo_url: user.photo_url})
    }
  }

  //Pega url da foto de perfil
  async function GetUrlPhoto({result}:{result:{metadata:{fullPath:string}}}) {
    try{
      const url  = await getDownloadURL(ref(storage, result.metadata.fullPath))
      return url
    }catch(e){
      return genericUrl
    }
  }

  async function DeletePhoto(){
    if(user.nameImage != "padraoCliente.png"){
      try{
        const desertRef = ref(storage, contextAdmin.id_company + '/images/' + user.nameImage);
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
    const userAfterEdit: DataUser = {
      id: user.id,
      id_company:user.id_company,
      permission:0,
      enterprises:user.enterprises,
      name: dataUser.name,
      email: dataUser.email,
      verifiedEmail:user.verifiedEmail,
      phone: dataUser.phone,
      photo_url: data.photo_url,
      nameImage: data.nameImage,
      disabled: user.disabled,
      created_date: user.created_date,
      pendencies:user.pendencies,
      admins: user.admins
    }

    await updateDoc(doc(db, 'companies', contextAdmin.id_company, "clients", user.id), {...userAfterEdit})

    childToParentEdit({...userAfterEdit, checked: false})
  }
  
  //Trocar foto de perfil
  async function ChangePhoto(photos){
    for await (const photo of photos.files) {
      if(photo.size < 9216){
        photo.value = null
        return toast.error("Está imagem é muito pequena")
      }

      if(photo.size > 10485760){
        photo.value = null
        return toast.error("Está imagem é grande, só é permitido imagens de até 10mb")
      }

      if(photo.size < 9216){
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
    if(file){
      let fileReader: any, isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e: { target: { result: any; }; }) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setDataUser({...dataUser, photo_url:result})
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);


  return (
    <div className={`w-[600px] h-full z-10 max-sm:z-50 max-sm:w-screen fixed bg-[#DDDDDD] dark:bg-[#121212] min-h-screen pb-[100px] right-0 duration-300 flex flex-col items-center top-0 drop-shadow-[0_0px_10px_rgba(0,0,0,0.50)]`}>
        <div className='bg-[#D2D2D2] dark:bg-white/10 flex justify-center items-center h-[155px] max-md:h-[135px] max-sm:h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full'>
          <DoubleArrowRightIcon onClick={() => closedWindow()} className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
          <p  className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Editar</p>
        </div>
        <form  onSubmit={OnToast} className='w-full h-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
          <div className='flex justify-center'> 
            <label className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
              <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={(e) => ChangePhoto(e.target)} />
              <Image src={dataUser.photo_url} width={180} height={180} alt="preview" className='w-full h-full rounded-full border-[2px] border-secondary dark:border-dsecondary' /> 
            </label>
            <div onClick={()=> (setFile(undefined), setDataUser({...dataUser, photo_url:genericUrl}))} className='w-[30px] h-[30px] flex items-center justify-center mt-[15px]'>
              <div className='z-10 cursor-pointer  w-[25px] h-[2px] bg-strong rotate-45 after:w-[25px] after:h-[2px] after:bg-strong after:block after:rotate-90 '/>
            </div>
          </div>


          <label  className='flex flex-col max-sm dark:text-white'>
            Nome
            <input autoComplete="off" type="text" maxLength={30} value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px]' placeholder='Digite o nome do cliente'/>
          </label>

          <label className='flex flex-col dark:text-white'>
            Email
            <input autoComplete="off" required  value={dataUser.email} maxLength={40} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full text-[18px] py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px]' placeholder='Digite o email'/>
          </label>

          <label className='flex flex-col dark:text-white'>
            Telefone
            <input autoComplete="off" required  maxLength={15} minLength={15} value={PhoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full text-[18px] py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px]' placeholder='Digite o telefone'/>
          </label>

          <button type="submit" className='hover:brightness-[.85] mt-auto mb-[50px] text-white cursor-pointer text-[22px] flex justify-center items-center self-center bg-gradient-to-br from-[#00B268] to-[#119E70] rounded-[8px] w-[200px] h-[50px]'>
              Salvar
          </button>
        </form>
      </div>
  )
}

export default EditUser;

