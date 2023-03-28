import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Users, UsersFilter} from '../../../types/interfaces'

interface Props{
    user:UsersFilter, 
    users:Users[], 
    FilterFixed:Function, 
    setUsersFilter:Function
}

  async function Fix({user, users, FilterFixed, setUsersFilter}:Props) {                                                                            
    try{
        await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
            fixed: true
        })
        const index = users.findIndex(user => user.id == user.id)
        users[index].fixed = true
        setUsersFilter(FilterFixed(users))
    } catch(e) {
        console.log(e)
        throw toast.error("Não foi possivél fixar este usuário.")
    }
}

export default Fix