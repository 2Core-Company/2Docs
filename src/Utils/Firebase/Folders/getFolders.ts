import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Folders } from "../../../types/folders";

interface getFolderProps {
    id_company:string
    id_user:string
    id_enterprise:string
    id_folder:string
}

export async function getFolder({id_company, id_user, id_enterprise, id_folder}: getFolderProps){
    try{
        const docRef = doc(db, "companies", id_company, "clients", id_user);
        const docSnap = await getDoc(docRef);
        let enterprises =  docSnap.data()?.enterprises
        let enterprise = enterprises.find((data) => data.id === id_enterprise)
        let folder: Folders = enterprise.folders.find((folder) => folder.id === id_folder);
        return folder
    }catch(e){
        console.log(e)
    }
}

interface getFoldersProps {
    id_company:string
    id_user:string
    id_enterprise:string
}

export async function getFolders({id_company, id_user, id_enterprise}: getFoldersProps){
    try{
        const docRef = doc(db, "companies", id_company, "clients", id_user);
        const docSnap = await getDoc(docRef);
        let enterprises =  docSnap.data()?.enterprises
        let enterprise = enterprises.find((data) => data.id === id_enterprise)
        let folders = enterprise.folders
        return folders
    }catch(e){
        console.log(e)
    }

}
