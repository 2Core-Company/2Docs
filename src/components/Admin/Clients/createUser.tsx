'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, { useState, useEffect, useContext } from 'react'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase';
import { storage, db } from '../../../../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataUser, DataUserContext } from '../../../types/users'
import { v4 as uuidv4 } from 'uuid';
import { PhoneMask } from '../../../Utils/Other/Masks';
import { Enterprise } from '../../../types/others';
import { loadingContext } from '../../../app/Context/contextLoading';


interface Props {
  contextAdmin: DataUserContext
  childToParentCreate: Function
  closedWindow: Function
}

function CreateUser({ childToParentCreate, closedWindow, contextAdmin }: Props) {
  const imageMimeType: RegExp = /image\/(png|jpg|jpeg)/i;
  const {loading, setLoading} = useContext(loadingContext)
  const [dataUser, setDataUser] = useState<DataUser>({ id: "", name: "", email: "", phone: "", id_company: "", permission: 0, photo_url: '', created_date:0, pendencies:0, enterprises: [], admins: [], verifiedEmail: false })
  const [file, setFile] = useState<any>()
  const genericUrl = `https://ui-avatars.com/api/?name=${dataUser.name}&background=10b981&color=262626&format=svg`
  const [enterprise, setEnterprise] = useState<Enterprise>({
    name: "",
    id: uuidv4(),
    folders: [
      { color: "#005694", name: "Cliente", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() },
      { color: "#C7A03C", name: "Favoritos", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() },
      { color: "#9E9E9E", name: "Lixeira", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() }
    ]
  })
  const domain = window.location.origin

  //Acionar o toast
  async function OnToast(e: { preventDefault: () => void; }) {
    e.preventDefault()
    const response = await axios.post(`${domain}/api/users/getUserByEmail`, { email: dataUser.email })

    if (response.data.emailExist) {
      return toast.error('Este email já foi cadastrado no 2Docs.')
    } else {
      toast.promise(UploadPhoto(), { pending: "Criando usuário...", success: "Usuário criado com sucesso" })
    }
  }

  //Armazena a foto de perfil do usuário
  async function UploadPhoto() {
    setLoading(true)
    const id = uuidv4()
    if (file) {
      var referencesFile = Math.floor(Math.random() * 65536).toString() + file.name;
      const storageRef = ref(storage, `${contextAdmin.id_company}/images/` + referencesFile);
      try {
        const result = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(ref(storage, result.metadata.fullPath))
        await SignUpFireStore({ url: url, referencesFile: referencesFile, id: id })
      } catch (e) {
        ErrorFirebase(e)
        console.log(e)
      }
    } else {
      await SignUpFireStore({ url: genericUrl, referencesFile: '', id: id })
    }
    setLoading(false)
  }

  //Armazena o arquivo no firestore
  async function SignUpFireStore(user: { id: string, url: string, referencesFile: string }) {
    var name = (dataUser.name[0].toUpperCase() + dataUser.name.substring(1))
    var date = new Date().getTime()

    let data: DataUser = {
      id: user.id,
      name: name,
      email: dataUser.email,
      phone: dataUser.phone,
      id_company: contextAdmin.id_company,
      photo_url: user.url,
      nameImage: user.referencesFile,
      created_date: date,
      status: false,
      verifiedEmail: false,
      permission: 0,
      fixed: false,
      pendencies:0,
      enterprises: [
        enterprise
      ],
      admins: []
    }

    try {
      const docRef = await setDoc(doc(db, "companies", contextAdmin.id_company, "clients", user.id), data);
    } catch (e) {
      console.log(e)
      toast.error("Não foi possível criar o usuário.")
    }

    const result = await ActiveSendEmail({ email: dataUser.email, id: user.id, id_company: contextAdmin.id_company })
    childToParentCreate({ ...data, checked: false })
  }

  async function ActiveSendEmail({ email, id, id_company }: Record<string, string>) {
    try {
      const result = await axios.post('/api/users/confirmEmail', {
        email: email,
        id_user: id,
        id_company: id_company
      })
      toast.success('Enviamos uma confirmação para este email, verifique a caixa de span!')
    } catch (e) {
      console.log(e)
    }

  }

  //Trocar foto de perfil
  async function ChangePhoto(photos) {
    const photo = await photos.files[0]

    if (photo.size < 9216) {
      photo.value = null
      return toast.error("Está imagem é muito pequena")
    }

    if (photo.size > 10485760) {
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

  //Trocar foto de perfil
  useEffect(() => {
    if (file) {
      let fileReader, isCancel = false;
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setDataUser({ ...dataUser, photo_url: result })
        }
      }
      fileReader.readAsDataURL(file);
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
    <div className={`w-[600px] h-full z-10 max-sm:z-50 top-0 max-sm:w-screen absolute bg-[#DDDDDD] dark:bg-[#121212] min-h-screen right-0 flex flex-col items-center drop-shadow-[0_0px_10px_rgba(0,0,0,0.50)]`}>
      <div className='bg-[#D2D2D2] dark:bg-white/10 flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full'>
        <button disabled={loading ? true : false} onClick={() => closedWindow()}>
          <DoubleArrowRightIcon className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px] max-sm:h-[35px] absolute left-[5px]' />
        </button>
        <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white'>Cadastrar</p>
      </div>
      <form onSubmit={OnToast} className='w-full h-full px-[10%] flex flex-col gap-y-[5px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
        {dataUser.photo_url.length > 0 ?
          <div className='self-center w-[180px] h-[180px] max-sm:w-[150px] max-sm:h-[150px] mt-[10px] max-sm:mt-[10px] relative'>
            <Image src={dataUser.photo_url} width={180} height={180} alt="preview" className='border-[2px] w-full h-full rounded-full' />
            <button onClick={() => (setFile(undefined), setDataUser({ ...dataUser, photo_url: '' }))} disabled={loading ? true : false} className='absolute right-[-30px] top-[5px] w-[30px] h-[30px] flex items-center justify-center'>
              <div className='z-10 cursor-pointer  w-[30px] h-[2px] bg-strong rotate-45 after:w-[30px] after:h-[2px] after:bg-strong after:block after:rotate-90 ' />
            </button>
          </div>
          :
          <label className={`cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] rounded-full mt-[10px] max-sm:mt-[10px]`}>
            <input disabled={loading} type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={(e) => ChangePhoto(e.target)} />
            <Image src={genericUrl} width={180} height={180} alt="preview" className='border-[2px] w-full h-full rounded-full' />
          </label>
        }

        <label className='mt-[20px] flex flex-col dark:text-white'>
          Nome
          <input disabled={loading} type="text" autoComplete="off" maxLength={30} value={dataUser.name} required onChange={(Text) => setDataUser({ ...dataUser, name: Text.target.value })} className='mt-[8px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o nome da empresa' />
        </label>

        <label className='mt-[20px] max-sm:mt-[10px] flex flex-col dark:text-white'>
          Email
          <input disabled={loading} required autoComplete="off" maxLength={40} value={dataUser.email} onChange={(Text) => setDataUser({ ...dataUser, email: Text.target.value })} type="email" className='mt-[8px] max-sm:mt-[5px] outline-none w-full  py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white dark:placeholder:text-gray-500 rounded-[8px]' placeholder='Digite o email' />
        </label>

        <div className='gap-x-[25px] flex max-sm:flex-col justify-between w-full'>
          <label className='mt-[20px] max-sm:mt-[10px] flex flex-col max-sm:w-full dark:text-white'>
            Telefone
            <input disabled={loading} maxLength={15} autoComplete="off" minLength={15} required value={PhoneMask(dataUser.phone)} onChange={(Text) => setDataUser({ ...dataUser, phone: Text.target.value })} type="text" className='mt-[8px] max-sm:mt-[5px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o telefone' />
          </label>

          <label className='mt-[20px] max-sm:mt-[10px] flex flex-col max-sm:w-full dark:text-white'>
            Empresa
            <input disabled={loading} maxLength={30} autoComplete="off" required onChange={(Text) => setEnterprise({ ...enterprise, name: Text.target.value })} type="text" className='mt-[8px] max-sm:mt-[5px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Nome da empresa' />
          </label>
        </div>

        <button disabled={loading} type="submit" className='hover:brightness-[.85] mt-auto mb-[50px] text-white cursor-pointer text-[22px] flex justify-center items-center self-center bg-gradient-to-br from-[#00B268] to-[#119E70] rounded-[8px] w-[200px] h-[50px]'>
          Salvar
        </button>
      </form>
    </div>
  )
}

export default CreateUser;