import React, { useState } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files';

interface Props{
  setFiles: React.Dispatch<React.SetStateAction<Files[]>>
  renameFile: {status: boolean, file?: Files | undefined}
  setRenameFile: React.Dispatch<React.SetStateAction<{status: boolean, file?: Files | undefined}>>
}


function Rename({renameFile, setFiles, setRenameFile}:Props) {
  const file = renameFile.file!;
  const [nameFile, setNameFile] = useState(file.name)
  const messageToast = {pending:"Alterando nome.", success:"O nome do arquivo foi alterado com sucesso."}

  async function ChangeName(){
    try{
      await updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
        name: nameFile
      })

      setFiles((files) => {
        const index = files.findIndex((indexFile) => indexFile.id === file.id);
        files[index].name = nameFile;
        return files;
      })

      setRenameFile({status: false})
    } catch(e) {
      console.log(e)
      throw toast.update("Não foi possível alterar o nome deste arquivo.")
    }
  }

  function OnToast(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(ChangeName(), messageToast)
  }

  return (
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
      <form onSubmit={OnToast} className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[15px] flex flex-col'>
        <div  className='bg-[#10B981] w-full h-[16px] rounded-t-[15px]'/>
        <div className='px-[33px]'>
          <p className='font-[500] text-[26px] mt-[18px] after:bg-[#10B981] after:w-[38px] after:h-[3px] after:block after:rounded-full'>Renomear arquivo</p>
          <div className='mt-[22px]'>
              <label htmlFor='textinput' className='text-[18px]'>Nome do arquivo:</label>
              <input id='textinput' required value={nameFile} maxLength={25} onChange={(text) => setNameFile(text.target.value)} className='w-full text-[16px] bg-transparent border border-[#9E9E9E] p-[6px] rounded-[8px] text-[#686868] placeholder:text-[#9E9E9E]/70 mt-1 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-offset-0 focus:ring-[#10B981]' placeholder='Escreva o nome do arquivo...'/>
          </div>
        </div>
        <div className='flex w-full justify-between bg-[#D9D9D9] border-t border-t-[#AAAAAA] py-[14px] px-[33px] rounded-b-[15px] mt-[25px]'>
          <button  onClick={() => setRenameFile({status: false})} className='cursor-pointer bg-transparent border border-[#686868]/70 py-[10px] px-[23px] rounded-[8px] font-[500] text-[16px] text-[#686868]'>Cancelar</button>
          <button type='submit' className={`${nameFile.trim().length > 0 ? "bg-[#10B981]/30 border-[#10B981] cursor-pointer": "bg-strong/30 border-strong disabled cursor-not-allowed text-[#686868]" } border py-[10px] px-[13px] rounded-[8px] font-[500] text-[16px] text-[#117856]`}>Renomear</button>
        </div>
      </form>
    </div>
  )
}

export default Rename