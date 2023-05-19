import { doc, getDoc, getDocs } from "firebase/firestore";
import { q } from "vitest/dist/types-0373403c";
import { db } from "../../../firebase";
import { Folders } from "../../types/folders";

interface GetFolder{
    id_company:string
    id_user:string
    id_enterprise:string
    id_folder:string
}

export async function GetFolder({id_company, id_user, id_enterprise, id_folder}:GetFolder){
    try{
        const docRef = doc(db, "companies", id_company, "clients", id_user);
        const docSnap = await getDoc(docRef);
        let enterprises =  docSnap.data()?.enterprises
        let enterprise = enterprises.find((data) => data.id === id_enterprise)
        let folder: Folders = enterprise.folders.find((folder) => folder.id == id_folder);
        return folder
    }catch(e){
        console.log(e)
    }

}

interface GetFolders{
    id_company:string
    id_user:string
    id_enterprise:string
}

export async function GetFolders({id_company, id_user, id_enterprise}:GetFolders){
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