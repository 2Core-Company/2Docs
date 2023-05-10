import {db } from '../../../../firebase'
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"; 
import { DataUser } from '../../../types/users' 

interface Props{
    user:DataUser,
    name:string
    id:string
    id_company:string
    id_enterprise:string
    setUser:Function, 
}

async function DeletFolder({user, name, id, id_company, id_enterprise, setUser}:Props) {
    const folders = user.folders
    const index = folders.findIndex(folder => folder.name === name && folder.id_enterprise === id_enterprise)
    const q = query(collection(db, "files", id_company, user.id), where("id_enterprise", "==", id_enterprise), where("folder", "==", folders[index].name));
    folders.splice(index, 1);
    try{
        await updateDoc(doc(db, 'companies', id_company, "clients", id), {
            folders: folders
        })
    } catch(err){
        console.log(err)
    }
    setUser({...user, folders:folders})


    const batch = writeBatch(db);
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((file) => {
        const laRef = doc(db, "files", id_company, user.id, file.data().id_file);
        batch.update(laRef, {trash:true})
    }); 

    await batch.commit();
}

export default DeletFolder