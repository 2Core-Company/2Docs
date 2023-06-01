import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/users'

interface Props{
    user:DataUser, 
    users:DataUser[], 
    FilterFixed:Function, 
    setUsers:Function
}

  async function Fix({user, users, FilterFixed, setUsers}:Props) {                                                                            
    try{
        await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
            fixed: true
        })
        const index = users.findIndex((userFind) => user.id == userFind.id)
        users[index].fixed = true
        setUsers(FilterFixed(users))
    } catch(e) {
        console.log(e)
        throw toast.error("Não foi possível fixar este usuário.")
    }
}

export default Fix