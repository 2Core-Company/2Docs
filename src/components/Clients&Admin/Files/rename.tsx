import React, { useState } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

function  Rename({file, files, setRename, childToParentDownload}) {
    const [nameFile, setNameFile] = useState(file.name)
    const messageToast = {pending:"Alterando nome.", success:"O nome do arquivo foi alterado com sucesso.", error:"Não foi possivel alterar o nome do arquivo."}

    async function ChangeName(){
        try{
            await updateDoc(doc(db, 'files', file.id_company, "Arquivos", file.id_file), {
                name: nameFile
            })
            const index = files.findIndex(file => file.id_file == file.id_file)
            files[index].name = nameFile
            setRename(false)
            childToParentDownload(files)
        } catch(e) {
          console.log(e)
          throw toast.update("Não foi possivél alterar o nome deste arquivo.")
        }
    }

    function OnToast(e: { preventDefault: () => void; }){
      e.preventDefault()
      toast.promise(ChangeName(), messageToast)
    }

    return (
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
        <form onSubmit={OnToast} className='bg-primary dark:bg-dprimary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
          <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
          <div className='px-[10px]'>
            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Altere o nome do seu arquivo</p>
            <div className='mt-[15px] '>
                <p className='self-start text-[20px] max-lsm:text-[18px] justify-self-start text-left'>Nome do arquivo:</p>
                <input required value={nameFile} maxLength={25} onChange={(text) => setNameFile(text.target.value)} className='w-full text-[20px] max-sm:text-[18px] bg-transparent border-[2px] border-black p-[3px] rounded-[4px] ' placeholder='Digite o novo nome'/>
            </div>
          </div>
          <div className='flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
            <button  onClick={() => setRename(false)} className='bg-strong/40 dark:bg-dstrong/40 border-[2px] border-strong dark:border-dstrong hover:scale-[1.10] duration-300 p-[3px]  rounded-[8px] text-[18px] text-white '>Cancelar</button>
            <button type='submit' className={`${nameFile.trim().length > 0 ? "bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)]": "bg-strong/30 dark:bg-dstrong/20 border-strong dark:border-dstrong text-white cursor-not-allowed" } border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Alterar</button>
          </div>
        </form>
      </div>
    )
}

export default Rename