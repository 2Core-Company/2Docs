import { ref, onValue, get, child } from "firebase/database";
import { database } from '../../../../firebase'

interface PropsGetSizeCompanyRealTime{
    id_company:string
    childGetSizeCompany:Function
}

export function GetSizeCompanyRealTime({id_company, childGetSizeCompany}:PropsGetSizeCompanyRealTime){
    const starCountRef = ref(database, `/usage/${id_company}`);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if(data){
            childGetSizeCompany(data)
        }
    });
}


interface PropsGetSizeCompany{
    id_company:string
}

export async function GetSizeCompany({id_company}:PropsGetSizeCompany){
    const dbRef = ref(database);
    const result = await get(child(dbRef, `/usage/${id_company}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return 'Não foi possivel localizar sua empresa!'
        }
    }).catch((error) => {
        console.error(error);
    });

    return result.size
}
