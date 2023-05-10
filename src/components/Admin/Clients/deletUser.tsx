import { ref, deleteObject} from "firebase/storage";
import {db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query,  where, collection, getDocs, writeBatch} from "firebase/firestore";
import axios from 'axios'
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { DataUser } from '../../../types/users'

  interface Props{
    user:DataUser
    users:DataUser[]
    ResetConfig:Function
  }

async function DeletUser({user, users, ResetConfig}:Props) {
  await DeleteAuth()

  //Deletando o auth do usuário
  async function DeleteAuth(){
    try{
      const domain:string = new URL(window.location.href).origin
      const result = await axios.post(`${domain}/api/users/deleteUser`, {users: user, uid: auth.currentUser?.uid})
      if(result.status === 200){
        await Promise.all([DeletePhoto(), DeletFile(), DeletFiles(),  DeletEvents()])
        .then((values) => {
          const allUsers = [...users]
          const index = allUsers.findIndex(user => user.id === user.id)
          allUsers.splice(index, 1);
          ResetConfig(allUsers)
        });
      } else {
        ErrorFirebase(result.data)
      }
    }catch(e){
      console.log(e)
    }

  }

  //Deletando a photo de perfil do usuário
  async function DeletePhoto(){
    try{
      if(user.nameImage != "padraoCliente.png"){
        const result = await deleteObject(ref(storage, user.id_company + '/images/' + user.nameImage))
      }
    } catch(e){
      console.log(e)
    }
  }

  //Deletando o arquivo do usuário
  async function DeletFile(){
    try{
      const result = await deleteDoc(doc(db, "companies", user.id_company, "clients", user.id))
    }catch(e){
      console.log(e)
    }
  }


  //Deletando arquivos do usuario
  async function DeletFiles(){
    try{
      const domain:string = new URL(window.location.href).origin
      const response = axios.post(`${domain}/api/files/deletCollection`, {path: `files/${user.id_company}/${user.id}`})
      const response2 = axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/`})
    } catch(e) {
      console.log(e)
    }
  }


  //Puxando eventos dos usuários
  async function DeletEvents() {
    const batch = writeBatch(db);
    var q = query(collection(db, "companies", user.id_company, "events"), where("id_user", "==", user.id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((event) => {
      const laRef = doc(db, "companies", user.id_company, "events", event.data().id);
      batch.delete(laRef)
    }); 
    await batch.commit();
  }
}

export default DeletUser