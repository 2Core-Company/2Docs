import { UploadIcon } from '@radix-ui/react-icons';
import React, { useContext, useEffect, useState } from 'react'
import { companyContext } from '../../../app/Context/contextCompany';
import { userContext } from '../../../app/Context/contextUser';
import { VerifyFiles } from '../../../Utils/Other/VerifyFiles';
import UploadFiles from '../Files/UploadFiles';

function UploadFile({id_event, id_folder, id_enterprise}:Record<string, string>) {
  const [files, setFiles] = useState()
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)

  const handleDrop = async (e) => {
    e.preventDefault();

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
    const result = await UploadFiles({ id_event, id_folder, id_company:dataUser.id_company, id_user:dataUser.id, id_enterprise, files, from:'user', maxSize:dataCompany.maxSize, ChildToActiontUpload})
  }

  
  return (
    <label onDrop={handleDrop} onDragOver={handleDragOver} className='px-[30px] cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[1px] border-[#9E9E9E] rounded-[12px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] flex flex-col items-center justify-center'>
      <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]' />
      <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou <br /> faça um <span className='text-hilight underline'>upload</span></p>
      <input onChange={(e) => OnChangeInputFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
    </label>
  )
}

export default UploadFile