import { ref, deleteObject} from "firebase/storage";
import {db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query,  where, collection, getDocs} from "firebase/firestore";
import axios from 'axios'
import { toast } from 'react-toastify';
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { useState } from 'react'
import Modals from '../../Clients&Admin/Modals'
import { Modal, Users } from '../../../types/interfaces'
import DeletFiles from "../Files/DeletFiles";

  interface Props{
    selectUsers:Users
    usersFilter:Users[]
    menu:boolean
    childToParentDelet:Function
  }

function DeletUser({selectUsers, usersFilter, menu, childToParentDelet}:Props) {
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })

  //Confirmação de deletar usuário
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

  //Resposta da confirmação
  const childModal = () => {
    toast.promise(DeleteAuth(), {pending:"Deletando o usuário...", success:"O usuário foi deletado com sucesso.", error:"Não foi possivel deletar o usuário."});
    setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })
  }

  //Deletando o auth do usuário
  async function DeleteAuth(){
    const domain:string = new URL(window.location.href).origin
    const result = await axios.post(`${domain}/api/users/deleteUser`, {users: selectUsers[0], uid: auth.currentUser.uid})
    console.log(result)
    if(result.status === 200){
      await DeletePhoto()
    } else {
      ErrorFirebase(result.data)
    }
  }

  //Deletando a photo de perfil do usuário
  async function DeletePhoto(){
    try{
      if(selectUsers[0].nameImage != "padraoCliente.png"){
        const desertRef = ref(storage, selectUsers[0].id_company + '/images/' + selectUsers[0].nameImage);
        const result = await deleteObject(desertRef)
      }
      await DeletFile()
    } catch(e){
      console.log(e)
    }
  }

  //Deletando o arquivo do usuário
  async function DeletFile(){
    const users = [...usersFilter]
    const result = await deleteDoc(doc(db, "companies", selectUsers[0].id_company, "clients", selectUsers[0].id))
    const index = users.findIndex(user => user.id === selectUsers[0].id)
    users.splice(index, 1);
    await Promise.all([GetFiles(selectUsers[0].id), DeletEvents()]).then((values) => {
      childToParentDelet(users)
    });
  }

  //Puxando arquivos dos usuários
  async function GetFiles(id:string) {
    const getFiles:Array<{id_file?:string}> = []
    var q = query(collection(db, "files", selectUsers[0].id_company, "documents"), where("id_user", "==", id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((doc) => {
      getFiles.push(doc.data())
    })
    await DeletFiles({selectFiles:getFiles})
  } 

  //Puxando eventos dos usuários
  async function GetEvents() {
    const events = []
    var q = query(collection(db, "companies", selectUsers[0].id_company, "events"), where("id_user", "==", selectUsers[0].id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((doc) => {
      events.push(doc.data())
    }); 
    return events
  }

  //Deletando eventos dos usuários
  async function DeletEvents() {
    const events = await GetEvents()
    for(let i = 0; i < events.length; i++){
      const response = await deleteDoc(doc(db, "companies", selectUsers[0].id_company, "events", events[i].id));
    }
  }

  return(
    <>
      <button onClick={() =>  ConfirmationDeleteUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-red/60 dark:bg-red/60 border-red text-white" : "bg-hilight dark:bg-black/20 border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""} cursor-pointer`}>
        Deletar
      </button>
      {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} user={modal.user} childModal={childModal}/> : <></>}
    </>

  )
}

export default DeletUser