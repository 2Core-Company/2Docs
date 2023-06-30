import React, { useState } from 'react'
import { UploadIcon } from '@radix-ui/react-icons';
import ModalSelectUpload from './modalSelectUpload';
import { VerifyFiles } from '../../../../Utils/Other/VerifyFiles';

function UploadFast() {
  const [files, setFiles] = useState()

  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    VerifyFiles({files, setFiles})
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className='self-end'>
      {files && <ModalSelectUpload setFiles={setFiles} files={files}/>}
      <p className='mt-[20px] font-poiretOne text-[40px] max-sm:text-[30px]'>Upload Rápido</p>
      <label onDrop={handleDrop} onDragOver={handleDragOver} className='cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[1px] border-[#9E9E9E] rounded-[12px] w-[500px] max-sm:w-[390px] max-lsm:w-[340px] h-[250px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] flex flex-col items-center justify-center'>
          <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]'/>
          <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou faça um <span className='text-hilight underline'>upload</span></p>
          <input onChange={(e) => VerifyFiles({files:e.target.files, setFiles})} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
      </label>
    </div>
  )
}

export default UploadFast