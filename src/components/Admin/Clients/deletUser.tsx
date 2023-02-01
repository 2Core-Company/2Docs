import { ref, deleteObject} from "firebase/storage";
import {db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query,  where, collection, getDocs} from "firebase/firestore";
import axios from 'axios'
import { toast } from 'react-toastify';
import ErrorFirebase from "../../ErrorFirebase";


async function DeletUser({childToParentDelet, selectUsers, usersFilter}) {
  DeleteAuth()
  async function DeleteAuth(){
    const domain:string = new URL(window.location.href).origin
    const result:any = await axios.post(`${domain}/api/users/deleteUser`, {users: selectUsers, uid: auth.currentUser.uid})
    if(result.data.type === 'success'){
      DeletePhoto()
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
      toast.promise(DeleteFile(), {pending:"Deletando o usuários", success:"Os usuários foram deletados.", error:"Não foi possivel deletar os usuários"});
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
      DeleteFiles(selectUsers[i].id)
    }
    childToParentDelet(users)
  }

  async function DeleteFiles(id:string){
    const getFiles:Array<{id_file?:string}> = []
    var q = query(collection(db, "files"), where("id_user", "==", id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((doc) => {
      getFiles.push(doc.data())
    }); 
    for(let i = 0; i < getFiles.length; i++){
      const desertRef = ref(storage, 'files/' + getFiles[i].id_file);
      const result = await deleteObject(desertRef)
      const response = await deleteDoc(doc(db, "files", getFiles[i].id_file));
    }
  }   
}

export default DeletUser