import React, { useState, useContext } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TrashIcon } from '@radix-ui/react-icons';
import { Enterprise, Modal } from '../../../types/others'
import { DataUser } from '../../../types/users';
import RenameIcon from '../../../../public/icons/rename.svg'
import Image from 'next/image'
import Rename from './rename';
import ModalDelete from '../../../Utils/Other/ModalDelete';
import { toast } from 'react-toastify';
import { db } from '../../../../firebase'
import { doc, updateDoc, query, collection, getDocs, where, writeBatch} from "firebase/firestore";
import axios from 'axios';
import updateSizeCompany from '../../../Utils/Other/updateSizeCompany';
 
interface Props{
  index:number
  user:DataUser,
  enterprise:Enterprise
  setUser:Function
  setEnterprise: Function
}

function Options({index, user, enterprise, setUser, setEnterprise}: Props){
  const [rename, setRename] = useState(false)
  const [modal, setModal] = useState<Modal>({status: false, title:'', subject:'', target:''})
  const batch = writeBatch(db);
  const domain = window.location.origin
  const messageModal = {status: true, title: "Deletar Empresa", subject:'a empresa', target:enterprise.name}

  //Resposta do modal
  const childModal = () => {
    setModal({status: false, title:'', subject:'', target:''})
    toast.promise(DeletEnterprise(),{pending:"Deletando empresa...", success:"Empresa deletada com sucesso."}, {position: "bottom-right"})
  }

  //Deletando pastas e empresa
  async function DeletEnterprise(){
    const enterprises = [...user.enterprises]
    const entrepisesUpdated = enterprises.filter((data) => enterprise.id != data.id)
    try{
      await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
        enterprises: entrepisesUpdated,
      })
      setRename(false)
      await Promise.all([DeletEvents(), DeletFiles(entrepisesUpdated)])
    } catch(e) {
      console.log(e)
      throw toast.error("Não foi possível deletar esta empresa.", {position: "bottom-right"})
    }
  }

  //Puxando arquivos para deletar daquela empresa
  async function DeletFiles(entrepisesUpdated){
    var q = query(collection(db, "files", user.id_company, user.id, 'user', 'files'), where("id_enterprise", "==", enterprise.id))
    var size = 0
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((file) => {
        size += file.data().size
        const laRef = doc(db, "files", user.id_company, user.id, 'user', 'files', file.data().id);
        batch.delete(laRef)
      }); 
      
      await Promise.all([
        batch.commit(), 
        axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/${enterprise.id}`})
      ])

      await updateSizeCompany({id_company:user.id_company, size, action:'subtraction'})

      setEnterprise(entrepisesUpdated[0])
      setUser({...user, enterprises:entrepisesUpdated})
    } catch(e){
      console.log(e)
      throw toast.error("Não foi possível deletar esta empresa.")
    }
  }

  async function DeletEvents() {
    var q = query(collection(db, "companies", user.id_company, "events"), where("id_enterprise", "==", enterprise.id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((event) => {
      const laRef = doc(db, "companies", user.id_company, "events", event.data().id);
      batch.delete(laRef)
    }); 
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
              <button onClick={() => setModal(messageModal)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <TrashIcon width={22} height={22} className='text-[250px]'/>
                Excluir
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {modal.status ? <ModalDelete modal={modal} childModal={childModal} setModal={setModal}/> : <></>}
    </>
  );
};

export default Options;