import { ref, deleteObject } from "firebase/storage";
import { db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query, where, collection, getDocs, writeBatch } from "firebase/firestore";
import axios from 'axios'
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { DataUser } from '../../../types/users'
import deleteFiles from "../../Clients&Admin/Files/deleteFiles";
import { getAllFilesOfUser } from "@/src/Utils/Firebase/Files/getFiles";

interface Props {
  user: DataUser
  users: DataUser[]
  domain: string
  ResetConfig: Function
}

async function deletUser({ user, users, domain, ResetConfig }: Props) {
  const batch = writeBatch(db);
  if (user.verifiedEmail) {
    await DeleteAuth()
  } else {
    await Promise.all([DeletePhoto(), DeletFile(), GetFiles(), DeletEvents()])
      .then(async(values) => {
        await batch.commit();
        const allUsers = [...users]
        const index = allUsers.findIndex((data) => data.id === user.id)
        allUsers.splice(index, 1);
        ResetConfig(allUsers)
      });
  }


  //Deletando o auth do usuário
  async function DeleteAuth() {
    try {
      const result = await axios.post(`${domain}/api/users/deleteUser`, { users: user, uid: auth.currentUser?.uid })
      if (result.status === 200) {
        const result = await Promise.all([DeletePhoto(), DeletFile(), GetFiles(), DeletEvents()])
          .then(async (values) => {
            await batch.commit();
            const allUsers = [...users]
            const index = allUsers.findIndex((data) => data.id === user.id)
            allUsers.splice(index, 1);
            ResetConfig(allUsers)
          });
      } else {
        ErrorFirebase(result.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Deletando a photo de perfil do usuário
  async function DeletePhoto() {
    try {
      if (user.nameImage != "") {
        const result = await deleteObject(ref(storage, user.id_company + '/images/' + user.nameImage))
      }
    } catch (e) {
      console.log(e)
    }
  }

  //Deletando o arquivo do usuário
  async function DeletFile() {
    try {
      const result = await deleteDoc(doc(db, "companies", user.id_company, "clients", user.id))
    } catch (e) {
      console.log(e)
    }
  }

  async function GetFiles(){
    const result = await getAllFilesOfUser({id_company:user.id_company, id_user:user.id})
    if(result){
      await deleteFiles({selectedFiles: result, id_company:user.id_company})
    }
  }

  async function DeletEvents() {
    var q = query(collection(db, "companies", user.id_company, "events"), where("id_user", "==", user.id))
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((event) => {
      const laRef = doc(db, "companies", user.id_company, "events", event.data().id);
      batch.delete(laRef)
    });
  }
}

export default deletUser

