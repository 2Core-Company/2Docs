'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, { useState, useEffect, useContext, useRef } from 'react'
import ErrorFirebase from '../../../Utils/Firebase/ErrorFirebase';
import { storage, db } from '../../../../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataUser, DataUserContext } from '../../../types/users'
import { v4 as uuidv4 } from 'uuid';
import { PhoneMask, lineLandMask } from '../../../Utils/Other/Masks';
import { Enterprise } from '../../../types/others';
import { companyContext } from '@/src/app/Context/contextCompany';

interface Props {
  contextAdmin: DataUserContext
  childToParentCreate: Function
  closedWindow: Function
}

function CreateUser({ childToParentCreate, closedWindow, contextAdmin }: Props) {
  const imageMimeType: RegExp = /image\/(png|jpg|jpeg)/i;
  const { dataCompany } = useContext(companyContext)
  const [loading, setLoading] = useState(false)
  const [dataUser, setDataUser] = useState<DataUser>({ id: "", name: "", email: "", phone: "", id_company: "", permission: 0, photo_url: '', created_date: 0, pendencies: 0, enterprises: [], admins: [], verifiedEmail: false })
  const [file, setFile] = useState<any>()
  const [optionsNumberPhone, setOptionsNumberPhone] = useState({ cellPhone: true, landLine: false })
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
    verifyCellNumber()
    setLoading(true)
    toast.promise(StartSignUp(), { pending: "Criando usuário...", success: "Usuário criado com sucesso" })
  }

  async function StartSignUp() {
    const response = await axios.post(`${domain}/api/users/getUserByEmail`, { email: dataUser.email })

    if (response.data.emailExist) {
      setLoading(false)
      throw toast.error('Este email já foi cadastrado no 2Docs.')
    } else {
      await UploadPhoto()
    }
  }

  //Armazena a foto de perfil do usuário
  async function UploadPhoto() {
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
      disabled: false,
      verifiedEmail: false,
      permission: 0,
      fixed: false,
      pendencies: 0,
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

    ActiveSendEmail({ email: dataUser.email, id: user.id, id_company: contextAdmin.id_company })
    childToParentCreate({ ...data, checked: false })
  }

  async function ActiveSendEmail({ email, id, id_company }: Record<string, string>) {
    try {
      const result = await axios.post('/api/users/confirmEmail', {
        email: email,
        company: dataCompany.name,
        id_user: id,
        id_company: id_company
      })
      if (result.data === 'success') {
        toast.success('Enviamos uma confirmação para este email, verifique a caixa de span!')
      } else {
        toast.error('Erro ao enviar a confirmação de email, crie este usuário novamente. Caso o erro persista, entre em contato com o suporte.')
      }

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

  function changeCellNumber(type: 'cellPhone' | 'landLine') {
    if (type === 'cellPhone' && !optionsNumberPhone.cellPhone) {
      setOptionsNumberPhone({ cellPhone: true, landLine: false })
    }

    if (type === 'landLine' && !optionsNumberPhone.landLine) {
      setOptionsNumberPhone({ cellPhone: false, landLine: true })
    }
  }

  function verifyCellNumber() {
    if (dataUser.phone) {
      if (dataUser.phone.length < 11 && optionsNumberPhone.cellPhone) {
        throw toast.error('O número de telefone tem que ter no mínimo 11 digítos.')
      }

      if (dataUser.phone.length < 8 && optionsNumberPhone.landLine) {
        throw toast.error('O número de telefone tem que ter no mínimo 8 digítos.')
      }
    }
  }
  return (
    <>
      <div onClick={() => !loading && closedWindow()} className='w-screen h-screen left-0 top-0 fixed bg-black/30 z-10' />
      <div className={`w-[600px] z-10 max-sm:z-50 top-0 max-sm:w-screen fixed min-h-screen h-full overflow-y-auto bg-[#DDDDDD] dark:bg-[#121212] right-0 flex flex-col items-center drop-shadow-[0_0px_10px_rgba(0,0,0,0.50)]`}>
        <div className='bg-[#D2D2D2] dark:bg-white/10 flex items-center min-h-[132px] max-md:min-h-[117px] max-sm:min-h-[80px] border-b-[2px] border-terciary dark:border-dterciary w-full relative'>
          <button disabled={loading ? true : false} onClick={() => closedWindow()} className='absolute disabled:bg-[#-d2d2d2]'>
            <DoubleArrowRightIcon className='text-black dark:text-white cursor-pointer h-[40px] w-[40px] max-sm:w-[35px] max-sm:h-[35px]' />
          </button>
          <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex dark:text-white mx-auto'>Cadastrar</p>
        </div>
        <form onSubmit={OnToast} className='w-full h-full px-[10%] flex flex-col text-[20px] max-sm:text-[18px]'>
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
            {optionsNumberPhone.cellPhone ?
              <label className='mt-[20px] max-sm:mt-[10px] flex flex-col max-sm:w-full dark:text-white'>
                Celular
                <input type='text' disabled={loading} minLength={15} maxLength={15} required value={PhoneMask(dataUser.phone)} onChange={(Text) => setDataUser({ ...dataUser, phone: Text.target.value.replaceAll(/\D/g, '') })} className='mt-[8px] max-sm:mt-[5px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o telefone' />
              </label>
              :
              <label className='mt-[20px] max-sm:mt-[10px] flex flex-col max-sm:w-full dark:text-white'>
                Telefone Fixo
                <input disabled={loading} autoComplete="off" minLength={9} maxLength={9} required value={lineLandMask(dataUser.phone)} onChange={(Text) => setDataUser({ ...dataUser, phone: Text.target.value.replaceAll(/\D/g, '') })} type="text" className='mt-[8px] max-sm:mt-[5px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Digite o telefone' />
              </label>}

            <label className='mt-[20px] max-sm:mt-[10px] flex flex-col max-sm:w-full dark:text-white'>
              Empresa
              <input disabled={loading} minLength={4} maxLength={30} autoComplete="off" required onChange={(Text) => setEnterprise({ ...enterprise, name: Text.target.value })} type="text" className='mt-[8px] max-sm:mt-[5px] outline-none w-full py-[8px] px-[12px] bg-transparent border-[1px] border-black dark:border-white rounded-[8px] dark:placeholder:text-gray-500' placeholder='Nome da empresa' />
            </label>
          </div>

          <div className='flex items-center mt-[10px]'>
            <input checked={optionsNumberPhone.cellPhone} onChange={(e) => changeCellNumber('cellPhone')} type="checkbox" className={`${!optionsNumberPhone.cellPhone && 'appearance-none'} accent-gray-600 dark:accent-dhilight w-[15px] h-[15px] border-[1px] border-[#686868] dark:border-dhilight rounded-[3px] cursor-pointer`} />
            <p className='ml-[5px] text-[#757575] text-[18px]'>Celular</p>
          </div>

          <div className='flex items-center'>
            <input checked={optionsNumberPhone.landLine} onChange={(e) => changeCellNumber('landLine')} type="checkbox" className={`${!optionsNumberPhone.landLine && 'appearance-none'} accent-gray-600 dark:accent-dhilight w-[15px] h-[15px] border-[1px] border-[#686868] dark:border-dhilight rounded-[3px] cursor-pointer`} />
            <p className='ml-[5px] text-[#757575] text-[18px]'>Telefone Fixo</p>
          </div>

          {loading ?
            <div className='hover:from-[#009456] hover:to-[#108d63] mt-auto mb-[50px] text-white cursor-pointer text-[22px] flex justify-center items-center self-center bg-gradient-to-br from-[#00B268] to-[#119E70] rounded-[8px] w-[200px] h-[50px]'>
              <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" style={{ strokeWidth: 4 }} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            :
            <button disabled={loading} type="submit" className='hover:from-[#009456] hover:to-[#108d63] mb-[20px] mt-[50px] text-white cursor-pointer text-[22px] flex justify-center items-center self-center bg-gradient-to-br from-[#00B268] to-[#119E70] rounded-[8px] w-[200px] h-[50px]'>
              Salvar
            </button>
          }
        </form>
      </div>
    </>
  )
}

export default CreateUser;
