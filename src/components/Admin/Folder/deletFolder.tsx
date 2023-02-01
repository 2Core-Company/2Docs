import {db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore"; 
import { Folders } from '../../../types/interfaces' 

async function DeletFolder(props:{user:{folders?:Folders[]}, name:string, id:string, setUser:Function, setFoldersFilter:Function, id_company:string}) {
    const folders = props.user.folders
    const index = folders.findIndex(folder => folder.name === props.name)
    folders.splice(index, 1);
    try{
        await updateDoc(doc(db, 'users', props.id_company, "Clientes", props.id), {
            folders: folders
        })
    } catch(err){
        console.log(err)
    }
    props.setFoldersFilter(folders)
    props.setUser({...props.user, folders:folders})
}

export default DeletFolder