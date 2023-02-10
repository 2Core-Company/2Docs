'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import AppContext from '../../Clients&Admin/AppContext';
import React, {useState, useEffect, useContext} from 'react'
import ErrorFirebase from '../../Clients&Admin/ErrorFirebase';
import { auth, storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { collection, where, getDocs, query } from "firebase/firestore";
import axios from 'axios';
import { toast } from 'react-toastify';
import {DataUser} from '../../../types/interfaces'


function EditUser(props:{closedWindow:Function, childToParentEdit:Function, user:DataUser}){
  const context = useContext(AppContext)
  const user = props.user
  const imageMimeType : RegExp = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState<DataUser>({name: user.name, email:user.email, cnpj: user.cnpj, phone:user.phone, password:user.password, nameImage: user.nameImage, photo_url: user.photo_url})
  const [file, setFile] : Array<{name:string}> | any  = useState({name: "padrao.png"})
  const [fileDataURL, setFileDataURL] = useState(user.photo_url);
  const [eye , setEye] = useState(false)
  const domain = new URL(window.location.href).origin
  const [right, setRight] = useState("right-[-600px]")

  useEffect(() =>{
    setRight("right-0")
  },[])

  async function VerifyCnpj(e: { preventDefault: () => void; }){
    e.preventDefault()
    if(dataUser.cnpj != user.cnpj){
      let user:{} = undefined
      const q = query(collection(db, "users"), where("cnpj", "==", dataUser.cnpj));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {user = doc.data() });
      if(user != undefined){
        toast.error("Este CNPJ já está cadastrado.")
      } else {
        UpdateDataUser()
      }
    } else {
      UpdateDataUser()
    }

  }

  async function UpdateDataUser() {
    if(dataUser.email != user.email){
      const result:{data:{uid?:string, message: string; code: string; }} = await axios.post(`${domain}/api/users/updateUser`, {userId: user.id, data:{email: dataUser.email}, uid: auth.currentUser.uid})
      if(result.data.uid){
        UpdatePhoto()
      } else {
        ErrorFirebase(result.data)
      }
    } else {
      UpdatePhoto()
    }
  }

  function UpdatePhoto(){
    if(fileDataURL != user.photo_url){
      const referencesFile:string = Math.floor(Math.random() * 65536) + file.name;
      if(file.name != "padrao.png"){
        DeletePhoto()
        const storageRef = ref(storage, context.dataUser.id_company +  "/images/" + referencesFile);
        uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(ref(storage, context.dataUser.id_company + '/images/' + referencesFile))
          .then((url) => {
            console.log(url)
              UpdateBdUser({nameImage: referencesFile, photo_url: url})
          })
          .catch((error) => {
            console.log(error)
          }); 
        })
        .catch((error) => {
          ErrorFirebase(error)
        });
      } else {
        getDownloadURL(ref(storage, context.dataUser.id_company + '/images/' + referencesFile))
        .then((url) => {
          UpdateBdUser({nameImage: "padrao.png", photo_url: url})
        })
        .catch((error) => {
            // Handle any errors
        });
      }
    } else {
      UpdateBdUser({nameImage: user.nameImage, photo_url: user.photo_url})
    }
  }

  function DeletePhoto(){
    if(user.nameImage != "padrao.png"){
      const desertRef = ref(storage, context.dataUser.id_company + '/images/' + user.nameImage);
      deleteObject(desertRef).then((result) => {
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async function UpdateBdUser(data:{photo_url: string, nameImage: string}){
    console.log(data)
    const userAfterEdit = {
      id: props.user.id,
      name: dataUser.name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      photo_url: data.photo_url,
      nameImage: data.nameImage,
      status: user.status,
      created_date: user.created_date,
      checked: false
    }

    await toast.promise(updateDoc(doc(db, 'users', context.dataUser.id_company, "Clientes", user.id), {
      name: dataUser.name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      photo_url: data.photo_url,
      nameImage: data.nameImage,
    }),{pending:"Editando usuário...", success:"Usuário editado com sucesso", error:"Não foi possivel editar o usuário"})
    props.childToParentEdit(userAfterEdit)
  }
  
  const phoneMask = (value:string) => {
    if(value != undefined){
      return value
      .replaceAll("(", "")
      .replaceAll("(", "")
      .replaceAll("-", "")
      .replaceAll("-", "")
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/^(\d{2})(\d)/g,"($1) $2")
      .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    }
    return ""
  }

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      return toast.error("Não é permitido armazenar este tipo de arquivo, escolha uma imagem.")
    }
    setFile(file);
  }

  useEffect(() => {
    if(file.name != "padrao.png"){
      let fileReader: FileReader, isCancel = false;
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
            <DoubleArrowRightIcon onClick={() => props.closedWindow()} className='text-black cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
            <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Editar</p>
          </div>
          <form  onSubmit={VerifyCnpj} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>

          <label className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
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
                <input required type="text" value={dataUser.password} disabled={true} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
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
                <input maxLength={18} required  value={cnpjMask(dataUser.cnpj)} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o CNPJ'/>
              </label>

              <label className='flex flex-col dark:text-white'>
                Telefone
                <input required  maxLength={15} value={phoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black dark:border-white rounded-[8px]' placeholder='Digite o telefone'/>
              </label>
            </div>
            <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Salvar
            </button>
          </form>
        </div>
      </>
  )
  }


export default EditUser;

