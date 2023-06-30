import { ref, deleteObject } from "firebase/storage";
import { db, auth, storage } from '../../../../firebase'
import { doc, deleteDoc, query, where, collection, getDocs, writeBatch } from "firebase/firestore";
import axios from 'axios'
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { DataUser } from '../../../types/users'
import updateSizeCompany from "../../../Utils/Firebase/Company/UpdateSizeCompany";

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
    await Promise.all([DeletePhoto(), DeletFile(), DeletFilesStorage(), DeletFilesFireStore(), DeletEvents()])
      .then((values) => {
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
        await Promise.all([DeletePhoto(), DeletFile(), DeletFilesStorage(), DeletFilesFireStore(), DeletEvents()])
          .then((values) => {
            const allUsers = [...users]
            const index = allUsers.findIndex((data) => data.id === user.id)
            allUsers.splice(index, 1);
            ResetConfig(allUsers)
          });

        await batch.commit();
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

  async function DeletFilesStorage() {
    try {
      const response = await axios.post(`${domain}/api/files/deletFolder`, { path: `${user.id_company}/files/${user.id}` })
    } catch (e) {
      console.log(e)
    }
  }

  async function DeletFilesFireStore() {
    try {
      var size = 0
      const q = query(collection(db, "files", user.id_company, user.id, 'user', 'files'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((file) => {
        size += file.data().size
        const laRef = doc(db, "files", user.id_company, user.id, 'user', 'files', file.data().id);
        batch.delete(laRef)
      })

      await updateSizeCompany({ id_company: user.id_company, size, action: 'subtraction' })

    } catch (e) {
      console.log(e)
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

