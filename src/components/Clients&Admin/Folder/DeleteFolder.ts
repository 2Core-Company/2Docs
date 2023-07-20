import {db } from '../../../../firebase'
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"; 
import { DataUser } from '../../../types/users' 
import axios from 'axios';
import { Enterprise } from '../../../types/others';
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany';
import { GetAllFilesOfFolder } from '../../../Utils/Firebase/Files/GetFiles';
import deletFiles from '../Files/DeletFiles';

interface Props{
    user:DataUser,
    id_folder:string
    id_company:string
    enterprise:Enterprise
    setUser:Function
}

async function DeletFolder({user, id_folder, id_company, enterprise, setUser}:Props) {
    const folders = enterprise.folders
    const domain:string = window.location.origin

    const index = folders.findIndex(folder => folder.id === id_folder)
    enterprise.folders.splice(index, 1)

    const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index2] = enterprise

    try{
        await Promise.all([
            updateDoc(doc(db, 'companies', id_company, "clients", user.id), {
                enterprises: user.enterprises
            })
        ])
    } catch(err){
        console.log(err)
    }

    const allFiles = await GetAllFilesOfFolder({id_company, id_user:user.id, id_enterprise:enterprise.id, id_folder})

    try{
        await Promise.all([
            deletFiles({selectFiles:allFiles, id_company}),
            axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/${enterprise.id}/${id_folder}`})
        ])
    } catch(e){
        console.log(e)
    }

    setUser({...user, enterprises:user.enterprises})
}

export default DeletFolder