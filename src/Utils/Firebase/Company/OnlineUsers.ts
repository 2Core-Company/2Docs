import { ref, onValue, onDisconnect, set } from "firebase/database"
import { database } from '../../../../firebase'

type usersStats = {
    img: string
    name: string
}

type usersProps = {
    [key: string] : usersStats
}

interface PropsGetSizeCompany{
    id_company:string,
    stateChange: React.Dispatch<React.SetStateAction<usersProps>>
}

export async function getOnlineUsers({id_company, stateChange}:PropsGetSizeCompany){
    const starCountRef = ref(database, `/onlines/${id_company}`);

    onValue(starCountRef, (snapshot) => {
        stateChange(snapshot.val())
    });
}

interface PropsSetSizeCompany{
    id_company:string,
    id_user: string,
    img: string,
    name: string
}

export async function setOnlineUsers({id_company, id_user, img, name}:PropsSetSizeCompany){

    set(ref(database, `/onlines/${id_company}/${id_user}`), {
        img,
        name
    })

    onDisconnect(ref(database, `/onlines/${id_company}/${id_user}`)).remove()
}
