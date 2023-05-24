import {db } from '../../../../firebase'
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"; 
import { DataUser } from '../../../types/users' 
import axios from 'axios';
import { Enterprise } from '../../../types/others';

interface Props{
    user:DataUser,
    id_folder:string
    id_company:string
    enterprise:Enterprise
    setUser:Function, 
}

async function DeletFolder({user, id_folder, id_company, enterprise, setUser}:Props) {
    const folders = enterprise.folders
    const q = query(collection(db, "files", id_company, user.id, 'user', 'files'), where("id_enterprise", "==", enterprise.id), where("id_folder", "==", id_folder));
    const domain:string = new URL(window.location.href).origin
    const batch = writeBatch(db);
    const querySnapshot = await getDocs(q);

    const index = folders.findIndex(folder => folder.id === id_folder)
    enterprise.folders.splice(index, 1)

    const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index2] = enterprise


    try{
        await Promise.all([
            querySnapshot.forEach((file) => {
                const laRef = doc(db, "files", id_company, user.id, 'user', 'files', file.data().id);
                batch.delete(laRef)
            }),
            updateDoc(doc(db, 'companies', id_company, "clients", user.id), {
                enterprises: user.enterprises
            })
        ])
    } catch(err){
        console.log(err)
    }


    try{
        await Promise.all([
            batch.commit(),
            axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/${enterprise.id}/${id_folder}`})
        ])
    } catch(e){
        console.log(e)
    }


    setUser({...user, enterprises:user.enterprises})
}

export default DeletFolder