import axios from "axios";
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../../../firebase";
import { Files } from "../../../types/files";
import { Enterprise } from "../../../types/others";
import { DataUser } from "../../../types/users";
import { GetAllFilesOfEnterprise } from "../../../Utils/Firebase/Files/GetFiles";
import deletFiles from "../Files/DeletFiles";

interface Props {
    user:DataUser
    enterprise: Enterprise
    setUser:React.Dispatch<React.SetStateAction<DataUser>>
    setEnterprise:React.Dispatch<React.SetStateAction<Enterprise>>
}

export async function deleteEnterprise({ user, enterprise, setUser, setEnterprise }:Props) {
    const batch = writeBatch(db);
    const domain = window.location.origin

    if(user.enterprises.length <= 1){
        throw toast.error('Você não pode deletar todas as empresas de um usuário.')
    }

    const response = await DeleteEnterpriseInFireStore() 

    //Deletando pastas e empresa
    async function DeleteEnterpriseInFireStore() {
        const enterprises = [...user.enterprises]
        const entrepisesUpdated = enterprises.filter((data) => enterprise.id != data.id)
        try {
            await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
                enterprises: entrepisesUpdated,
            })

            await Promise.all([DeletEvents(), GetFilesToDelete()])
            await batch.commit()
            setEnterprise(entrepisesUpdated[0])
            setUser({ ...user, enterprises: entrepisesUpdated })
        } catch (e) {
            console.log(e)
            throw toast.error("Não foi possível deletar esta empresa.")
        }
    }

    //Puxando arquivos daquela empresa para deletar
    async function GetFilesToDelete() {
        try {
            const result = await GetAllFilesOfEnterprise({ id_company: user.id_company, id_user: user.id, id_enterprise: enterprise.id })
            if(result){
                const response = await DeleteFilesInStorageAndStore(result)
            }

        } catch (e) {
            console.log(e)
            throw toast.error("Não foi possível deletar esta empresa.")
        }
    }

    async function DeleteFilesInStorageAndStore(files:Files[]){
        await Promise.all([
            axios.post(`${domain}/api/files/deletFolder`, { path: `${user.id_company}/files/${user.id}/${enterprise.id}`}),
            deletFiles({selectFiles:files, id_company:user.id_company})
        ])
        
    }

    async function DeletEvents() {
        try {
            var q = query(collection(db, "companies", user.id_company, "events"), where("id_enterprise", "==", enterprise.id))
            const querySnapshot = await getDocs(q);
            const a = querySnapshot.forEach((event) => {
                const laRef = doc(db, "companies", user.id_company, "events", event.data().id);
                batch.delete(laRef)
            });
        }catch (e){
            console.log(e)
            throw e
        }
    }
}