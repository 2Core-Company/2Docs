import { ref, deleteObject} from "firebase/storage";
import {db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query,  where, collection, getDocs} from "firebase/firestore";
import axios from 'axios'
import { toast } from 'react-toastify';
import ErrorFirebase from "../../Clients&Admin/ErrorFirebase";
import AppContext from '../../Clients&Admin/AppContext';
import { useContext, useState } from 'react'
import Modals from '../../Clients&Admin/Modals'
import { Modal } from '../../../types/interfaces'


function DeletUser({selectUsers, usersFilter, menu, childToParentDelet}) {
  const context = useContext(AppContext)
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })

  function ConfirmationDeleteUser(){
    if(selectUsers.length > 0 ){
      if(selectUsers.length === 1){
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir o usuário:", subMessage1: "Será permanente.", subMessage2:"Os documentos serão apagados também.", user: selectUsers[0].name + "?"})
      } else{
        toast.error("Só é possivel deletar um usuário por vez.")
      }
    } else {
      toast.error("Selecione um usuário para deletar.")
    }
  }


  const childModal = () => {
    toast.promise(DeleteAuth(), {pending:"Deletando o usuários", success:"Os usuários foram deletados.", error:"Não foi possivel deletar os usuários"});
    setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })
  }


  async function DeleteAuth(){
    const domain:string = new URL(window.location.href).origin
    const result:any = await axios.post(`${domain}/api/users/deleteUser`, {users: selectUsers, uid: auth.currentUser.uid})
    if(result.data.type === 'success'){
      await DeletePhoto()
    } else {
      ErrorFirebase(result)
    }
  }


  async function DeletePhoto(){
    try{
      for(let i = 0; i < selectUsers.length; i++){
        if(selectUsers[i].nameImage != "padrao.png"){
          const desertRef = ref(storage, selectUsers[0].id_company + '/images/' + selectUsers[i].nameImage);
          const result = await deleteObject(desertRef)
        }
      }
      await DeleteFile()
    } catch(e){
      console.log(e)
    }
  }

  
  async function DeleteFile(){
    const users = [...usersFilter]
    for(let i = 0; i < selectUsers.length; i++){
      const result = await deleteDoc(doc(db, "users",selectUsers[0].id_company, "Clientes", selectUsers[i].id))
      const index = users.findIndex(user => user.id === selectUsers[i].id)
      users.splice(index, 1);
      await DeleteFiles(selectUsers[i].id)
    }
    childToParentDelet(users)
  }


  async function DeleteFiles(id:string){
    const allFiles = context.allFiles
    const getFiles:Array<{id_file?:string}> = []
    var q = query(collection(db, "files", selectUsers[0].id_company, "Arquivos"), where("id_user", "==", id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((doc) => {
      getFiles.push(doc.data())
    }); 
    for(let i = 0; i < getFiles.length; i++){
      const desertRef = ref(storage, selectUsers[0].id_company + '/files/' + id + "/" + getFiles[i].id_file)
      const result = await deleteObject(desertRef)
      const response = await deleteDoc(doc(db, "files", selectUsers[0].id_company, "Arquivos", getFiles[i].id_file));
      const index = allFiles.findIndex(file => file.id_file === getFiles[i].id_file)
      allFiles.splice(index, 1)
    }
    context.setAllFiles(allFiles)
  }   

  return(
    <>
      <button onClick={() => ConfirmationDeleteUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Deletar</button>
      {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} user={modal.user} childModal={childModal}/> : <></>}
    </>

  )
}

export default DeletUser