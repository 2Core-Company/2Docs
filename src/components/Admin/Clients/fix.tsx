import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Users, DataUser } from '../../../types/interfaces'

  async function Fix(props:{user:DataUser, users:Users[], FilterFixed:Function, setUsersFilter:Function}) {                                                                            
    const userFixed = props.user
    const users =  [...props.users]
    try{
        await updateDoc(doc(db, 'users', userFixed.id_company, "Clientes", userFixed.id), {
            fixed: true
        })
        const index = users.findIndex(user => user.id == userFixed.id)
        console.log(index)
        users[index].fixed = true
        console.log(users)
        props.setUsersFilter(props.FilterFixed(users))
    } catch(e) {
        console.log(e)
        throw toast.error("Não foi possivél fixar este usuário.")
    }
}

export default Fix