import {db } from '../../../../firebase'
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"; 
import { DataUser } from '../../../types/users' 
import axios from 'axios';
import { Enterprise } from '../../../types/others';
import AlterSizeCompany from '../../Clients&Admin/Files/alterSizeCompany';
import { DataCompanyContext } from '../../../types/dataCompany';
import { GetSizeCompany } from '../../../Utils/files/GetSizeCompany';

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
    const domain:string = window.location.origin
    const batch = writeBatch(db);
    const querySnapshot = await getDocs(q);

    const index = folders.findIndex(folder => folder.id === id_folder)
    enterprise.folders.splice(index, 1)

    const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index2] = enterprise

    var size = 0

    querySnapshot.forEach((file:any) => {
        size = size + file.data().size
        const laRef = doc(db, "files", id_company, user.id, 'user', 'files', file.data().id);
        batch.delete(laRef)
    })

    try{
        await Promise.all([
            updateDoc(doc(db, 'companies', id_company, "clients", user.id), {
                enterprises: user.enterprises
            })
        ])
    } catch(err){
        console.log(err)
    }


    try{
        await Promise.all([
            await batch.commit(),
            await axios.post(`${domain}/api/files/deletFolder`, {path:`${user.id_company}/files/${user.id}/${enterprise.id}/${id_folder}`})
        ])
    } catch(e){
        console.log(e)
    }

    const sizeCompany = await GetSizeCompany({id_company:id_company})

    size =  sizeCompany - size

    await AlterSizeCompany({size, id_company})
    setUser({...user, enterprises:user.enterprises})
}

export default DeletFolder