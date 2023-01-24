import {db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  

async function DeletFolder(props:{folders:Array<{name:string}>, name:string, id:string, setFoldersFilter:any, setFolders:any}) {
    const folders = props.folders
    const index = folders.findIndex(folder => folder.name === props.name)
    folders.splice(index, 1);
    try{
        await updateDoc(doc(db, 'users', props.id), {
            folders: folders
        })
    } catch(err){
        console.log(err)
    }
    props.setFoldersFilter(folders)
    props.setFolders(folders)
}

export default DeletFolder