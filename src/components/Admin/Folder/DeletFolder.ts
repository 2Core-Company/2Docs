import {db } from '../../../../firebase'
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"; 
import { DataUser } from '../../../types/users' 
import axios from 'axios';
import { Enterprise } from '../../../types/others';

interface Props{
    user:DataUser,
    name:string
    id:string
    id_company:string
    enterprise:Enterprise
    setUser:Function, 
}

async function DeletFolder({user, name, id, id_company, enterprise, setUser}:Props) {
    const folders = enterprise.folders
    const q = query(collection(db, "files", id_company, user.id), where("id_enterprise", "==", enterprise.id), where("folder", "==", name));
    const domain:string = new URL(window.location.href).origin
    const batch = writeBatch(db);
    const querySnapshot = await getDocs(q);

    const index = folders.findIndex(folder => folder.name === name)
    enterprise.folders.splice(index, 1)

    const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index2] = enterprise

    console.log(user.enterprises)
    try{
        await Promise.all([
            querySnapshot.forEach((file) => {
                const laRef = doc(db, "files", id_company, user.id, file.data().id_file);
                batch.delete(laRef)
            }),
            
            updateDoc(doc(db, 'companies', id_company, "clients", id), {
                enterprises: user.enterprises
            })
        ])
    } catch(err){
        console.log(err)
    }


    try{
        await Promise.all([
            batch.commit(),
            axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/${enterprise.id}/${name}`})
        ])
    } catch(e){
        console.log(e)
    }


    setUser({...user, enterprises:user.enterprises})
}

export default DeletFolder