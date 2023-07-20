import { UploadIcon } from '@radix-ui/react-icons';
import React, { useContext, useEffect, useState } from 'react'
import { companyContext } from '../../../app/Context/contextCompany';
import { userContext } from '../../../app/Context/contextUser';
import { UpdateStatusDelivered } from '../../../Utils/Firebase/Events/UpdateStatusDelivered';
import { VerifyFiles } from '../../../Utils/Other/VerifyFiles';
import UploadFiles from '../Files/UploadFiles';
import { Event } from '../../../types/event';
import { UpdateLastModify } from '../../../Utils/Firebase/Events/UpdateLastModify';
import CreateNotification from '../../../Utils/Firebase/Notification/CreateNotification';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../../types/notification';
import { toast } from 'react-toastify';

interface Props {
  messageDisabled:string
  uploadDisabled:boolean
  id_event:string
  id_folder:string
  id_enterprise:string
  event:Event
  setEvent: Function
}

function UploadFile({messageDisabled, uploadDisabled, id_folder, id_enterprise, event, setEvent}:Props) {
  const [files, setFiles] = useState()
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)

  const handleDrop = async (e) => {
    e.preventDefault();
    if(uploadDisabled){
      return toast.error(messageDisabled)
    }

    const files = Array.from(e.dataTransfer.files);
    const result = await VerifyFiles({ files })
    if(result){
      setFiles(result)
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
      setFiles(result)
    }
  }

  function ChildToActiontUpload(){
    setFiles(undefined)
  }

  useEffect(() => {
    if(files){
      UploadFilesHere()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[files])

  async function UploadFilesHere(){
    const result = await UploadFiles({ id_event:event.id, id_folder, id_company:dataUser.id_company, id_user:dataUser.id, id_enterprise, files, from:'user', maxSize:dataCompany.maxSize, ChildToActiontUpload})
    if(result?.status === 200){
      const dateNow = new Date().getTime()
      await UpdateLastModify({id_company:dataCompany.id, id_event:event.id, date:dateNow})
      if(event.delivered === false){
        await UpdateStatusDelivered({id_company:dataCompany.id, id_event:event.id, status:true})
        await CreateNotificationAfterDeliveredEvent()
      }
      setEvent((event) => {
        return {...event, delivered:true, lastModify:dateNow}
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
    <label onDrop={handleDrop} onDragOver={handleDragOver} className='max-2xl:w-full py-[50px] px-[30px] cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[1px] border-[#9E9E9E] rounded-[12px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] flex flex-col items-center justify-center'>
      <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]' />
      <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou <br /> faça um <span className='text-hilight underline'>upload</span></p>
      <input onChange={(e) => OnChangeInputFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
    </label>
  )
}

export default UploadFile

