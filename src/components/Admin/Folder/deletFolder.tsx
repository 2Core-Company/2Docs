import {db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore"; 
import { DataUser } from '../../../types/interfaces' 

interface Props{
    user:DataUser,
    name:string
    id:string
    id_company:string
    setUser:Function, 
    setFoldersFilter:Function
}

async function DeletFolder({user, name, id, setUser, setFoldersFilter, id_company}:Props) {
    const folders = user.folders
    const index = folders.findIndex(folder => folder.name === name)
    folders.splice(index, 1);
    try{
        await updateDoc(doc(db, 'users', id_company, "Clientes", id), {
            folders: folders
        })
    } catch(err){
        console.log(err)
    }
    setFoldersFilter(folders)
    setUser({...user, folders:folders})
}

export default DeletFolder