import {db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore"; 
import { DataUser } from '../../../types/interfaces' 

interface Props{
    user:DataUser,
    name:string
    id:string
    id_company:string
    id_enterprise:string
    setUser:Function, 
    setFoldersFilter:Function
}

//Função de deletar pasta
async function DeletFolder({user, name, id, setUser, setFoldersFilter, id_company, id_enterprise}:Props) {
    const folders = user.folders
    const index = folders.findIndex(folder => folder.name === name && folder.id_enterprise === id_enterprise)
    folders.splice(index, 1);
    try{
        await updateDoc(doc(db, 'companies', id_company, "clients", id), {
            folders: folders
        })
    } catch(err){
        console.log(err)
    }
    setFoldersFilter(folders)
    setUser({...user, folders:folders})
}

export default DeletFolder