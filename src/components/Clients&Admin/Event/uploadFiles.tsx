import { UploadIcon } from '@radix-ui/react-icons';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { companyContext } from '../../../app/Context/contextCompany';
import { userContext } from '../../../app/Context/contextUser';
import { UpdateStatusDelivered } from '../../../Utils/Firebase/Events/UpdateStatusDelivered';
import { VerifyFiles } from '../../../Utils/Other/VerifyFiles';
import { UploadFiles } from '../Files/UploadFiles';
import { Event } from '../../../types/event';
import { UpdateLastModify } from '../../../Utils/Firebase/Events/UpdateLastModify';
import CreateNotification from '../../../Utils/Firebase/Notification/CreateNotification';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../../types/notification';
import { toast } from 'react-toastify';
import { Files } from '@/src/types/files';

interface Props {
  messageDisabled:string
  uploadDisabled:boolean
  id_event:string
  id_folder:string
  id_enterprise:string
  event:Event
  setEvent: Function
  setFiles:React.Dispatch<React.SetStateAction<Files[]>>
  files: Files[]
}

function UploadFile({messageDisabled, uploadDisabled, id_folder, id_enterprise, event, setEvent, setFiles, files}:Props) {
  const [filesUpload, setFilesUpload] = useState()
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)
  const fileInputRef = useRef<any>(null);

  const handleDrop = async (e) => {
    e.preventDefault();
    if(uploadDisabled){
      return toast.error(messageDisabled)
    }

    const files = Array.from(e.dataTransfer.files);
    const result = await VerifyFiles({ files })
    if(result){
      setFilesUpload(result)
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  async function OnChangeInputFiles(files){
    if(uploadDisabled){
      return toast.error(messageDisabled)
    }
    const result = await VerifyFiles({ files })
    if(result){
      setFilesUpload(result)
    }
  }

  useEffect(() => {
    if(filesUpload){
      UploadFilesHere()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filesUpload])

  useEffect(() => {
    async function update() {
      await UpdateStatusDelivered({id_company:dataCompany.id, id_event:event.id, status:true})
    }

    if(event.delivered === false && files.length >= event.tasks.filter((task) => task.isRequired == true).length) {
      update()
      
      const dateNow = new Date().getTime()

      setEvent((event) => {
        return {...event, delivered: files.length >= event.tasks.filter((task) => task.isRequired == true).length ? true : false, lastModify:dateNow}
      })
    }
  }, [files])

  async function UploadFilesHere(){
    const result = await UploadFiles({ id_event:event.id, id_folder, id_company:dataUser.id_company, id_user:dataUser.id, id_enterprise, files:filesUpload, from:'user', maxSize:dataCompany.maxSize})

    fileInputRef.current.value = ''

    if(result?.status === 200){
      const dateNow = new Date().getTime()

      await UpdateLastModify({id_company:dataCompany.id, id_event:event.id, date:dateNow})

      setFilesUpload(undefined)

      setFiles((files) => {
        return result.files.concat(files)
      })
    }
  }

  async function CreateNotificationAfterDeliveredEvent(){
    const data:Notification = {
      id:uuidv4(),
      photo_url:dataUser.photo_url,
      nameSender:dataUser.name,
      description:`Entregou o evento ${event.title}`,
      date:new Date().getTime()
    }
  await CreateNotification({notification:data, id_company:dataCompany.id, addressee:dataCompany.id})
  }
  
  return (
    <label onDrop={handleDrop} onDragOver={handleDragOver} className='xl:mt-[42px] max-xl:w-full py-[50px] px-[30px] cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[1px] border-[#9E9E9E] rounded-[12px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] flex flex-col items-center justify-center'>
      <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]' />
      <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou <br /> faça um <span className='text-hilight underline'>upload</span></p>
      <input ref={fileInputRef} onChange={(e) => OnChangeInputFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
    </label>
  )
}

export default UploadFile

