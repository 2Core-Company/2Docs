import React, { useState, useContext } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TrashIcon } from '@radix-ui/react-icons';
import { DataUser, Modal } from '../../../types/interfaces'
import RenameIcon from '../../../../public/icons/rename.svg'
import Image from 'next/image'
import Rename from './rename';
import Modals from '../../Clients&Admin/Modals'
import { toast } from 'react-toastify';
import { db } from '../../../../firebase'
import { doc, updateDoc, query, collection, getDocs, where} from "firebase/firestore";
import { loadingContext } from '../../../app/Context/contextLoading';
import DeletFiles from '../Files/DeletFiles';
 
interface Props{
  user:DataUser,
  index:number
  setUser:Function
  setEnterprise: Function
}

function Options({user, index, setUser, setEnterprise}: Props){
  const [rename, setRename] = useState(false)
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: "", user:""})
  const {setLoading} = useContext(loadingContext)

  //Confirmação de deletar empresa
  function ConfirmationDeleteEmpresa(){
    setModal({...modal, status:true, message: "Tem certeza que deseja excluir a empresa:", subMessage1: "Você excluirá todos arquivos dela.", subMessage2:"Será permanente.", user:user.enterprises[index].name})
  }

  //Resposta do modal
  const childModal = () => {
    setLoading(true)
    setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:""})
    toast.promise(DeletEnterprise(),{pending:"Deletando empresa...", success:"Empresa deletada com sucesso."}, {position: "bottom-right"})
  }

  //Deletando pastas e empresa
  async function DeletEnterprise(){
    const allFolders = [...user.folders]
    const enterprises = [...user.enterprises]
    const folders = allFolders.filter(folder => folder.id_enterprise != user.enterprises[index].id || folder.name === 'Cliente' || folder.name === 'Favoritos')
    enterprises.splice(index, 1)
    try{
      await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
        enterprises: enterprises,
        folders:folders
      })
      setEnterprise(enterprises[0])
      setUser({...user, enterprises:enterprises})
      setRename(false)
      await GetFilesToDelet()
    } catch(e) {
      console.log(e)
      setLoading(false)
      throw toast.error("Não foi possivél deletar esta empresa.", {position: "bottom-right"})
    }
  }

  //Puxando arquivos para deletar daquela empresa
  async function  GetFilesToDelet(){
    try{
      const getFiles = []
      var q = query(collection(db, "files", user.id_company, "documents"), where("id_user", "==", user.id), where("id_enterprise", "==", user.enterprises[index].id))
      const querySnapshot = await getDocs(q);
      const a = querySnapshot.forEach((doc) => {
        getFiles.push(doc.data())
      }); 
      DeletFiles({selectFiles:getFiles})
      setLoading(false)
    } catch(e){
      setLoading(false)
      console.log(e)
      throw toast.error("Não foi possivél deletar esta empresa.")
    }
  }


  return (
    <>
     {rename ? <Rename user={user} index={index} setUser={setUser} setRename={setRename}/> : <></>}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='flex justify-center items-center ml-[10px]'>
          <button className="flex  cursor-pointer w-[20px] h-[20px] justify-between" aria-label="Customise options">
            <div className='w-[5px] h-[5px] bg-black rounded-full'></div>
            <div className='w-[5px] h-[5px] mx-[2px] bg-black rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black rounded-full'></div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="bg-primary text-black text-[18px] rounded-[6px] flex flex-col gap-[5px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            
            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => setRename(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image className="dark:invert" src={RenameIcon} width={22} height={22} alt={"Copiar documentos"}/>
                Renomear
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none rounded-b-[6px] hover:bg-red/30">
              <div onClick={() => ConfirmationDeleteEmpresa()} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <TrashIcon width={22} height={22} className='text-[250px]'/>
                Excluir
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} user={modal.user} childModal={childModal}/> : <></>}
    </>
  );
};

export default Options;