import React, { useRef, useState } from 'react'
import { UploadIcon } from '@radix-ui/react-icons';
import ModalSelectUpload from './modalSelectUpload';
import { VerifyFiles } from '../../../../Utils/Other/VerifyFiles';

function UploadFast() {
  const [files, setFiles] = useState()
  const fileInputRef = useRef<any>(null);

  const handleDrop = async (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    const result = await VerifyFiles({files})
    setFiles(result)
    fileInputRef.current.value = ''
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  async function GetFiles(files){
    const result = await VerifyFiles({files})
    setFiles(result)
    fileInputRef.current.value = ''
  }

  return (
    <div className='max-2xl:mt-[20px]'>
      <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px]'>Upload Rápido</p>
      <label onDrop={handleDrop} onDragOver={handleDragOver} className='cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[1px] border-[#9E9E9E] rounded-[12px] w-[560px] max-sm:w-[410px] max-lsm:w-[340px] h-[250px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] flex flex-col items-center justify-center'>
          <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]'/>
          <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou faça um <span className='text-hilight underline'>upload</span></p>
          <input ref={fileInputRef} onChange={(e) => GetFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
      </label>
      <ModalSelectUpload setFiles={setFiles} files={files}/>
    </div>
  )
}

export default UploadFast