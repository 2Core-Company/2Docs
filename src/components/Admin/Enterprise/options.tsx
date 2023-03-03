import React, { useState, useContext } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TrashIcon } from '@radix-ui/react-icons';
import { DataUser, Modal } from '../../../types/interfaces'
import RenameIcon from '../../../../public/icons/rename.svg'
import Image from 'next/image'
import Rename from './rename';
import Modals from '../../Clients&Admin/Modals'
import { toast } from 'react-toastify';
import { db, storage } from '../../../../firebase'
import { doc, updateDoc, deleteDoc, query, collection, getDocs, where} from "firebase/firestore";
import { ref, deleteObject} from "firebase/storage";
import AppContext from '../../Clients&Admin/AppContext';


interface Props{
    user:DataUser,
    index:number
    setUser:Function
}

function Options({user, index, setUser}: Props){
  const [rename, setRename] = useState(false)
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: "", user:""})
  const context = useContext(AppContext)

    function ConfirmationDeleteEmpresa(){
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir a empresa:", subMessage1: "Você excluirá todos arquivos dela.", subMessage2:"Será permanente.", user:user.enterprises[index].name})
    }

    const childModal = () => {
        context.setLoading(true)
        setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:""})
        toast.promise(DeletEnterprise(),{pending:"Deletando empresa...", success:"Empresa deletada com sucesso."}, {position: "bottom-right"})
      }

    async function DeletEnterprise(){
        const allFolders = [...user.folders]
        const enterprises = [...user.enterprises]
        const folders = allFolders.filter(folder => folder.id_enterprise != user.enterprises[index].id)
        enterprises.splice(index, 1)
        try{
            await updateDoc(doc(db, 'users', user.id_company, "Clientes", user.id), {
                enterprises: enterprises,
                folders:folders
            })
            setUser({...user, enterprises:enterprises})
            setRename(false)
            await DeletFileEnterprise()
        } catch(e) {
          console.log(e)
          context.setLoading(false)
          throw toast.error("Não foi possivél deletar esta empresa.", {position: "bottom-right"})
        }
    }

    async function DeletFileEnterprise(){
        try{
            const getFiles = []
            var q = query(collection(db, "files", user.id_company, "Arquivos"), where("id_user", "==", user.id), where("id_enterprise", "==", user.enterprises[index].id))
            const querySnapshot = await getDocs(q);
            const a = querySnapshot.forEach((doc) => {
              getFiles.push(doc.data())
            }); 
            for(let i = 0; i < getFiles.length; i++){
              const desertRef = ref(storage, user.id_company + '/files/' + user.id + "/" + getFiles[i].id_file)
              const result = await deleteObject(desertRef)
              const response = await deleteDoc(doc(db, "files", user.id_company, "Arquivos", getFiles[i].id_file));
            }
            context.setLoading(false)
        } catch(e){
            context.setLoading(false)
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