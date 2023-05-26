import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '../../../firebase';
import { DataUser } from '../../../src/types/users';
import { parse } from 'url';
const url = require('url');



export default async function getUser(req, res) {
    const {id_company} = req.query
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", "==", 0), orderBy('name'));
    try{
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.forEach((doc) => getUsers.push({
        id:doc.data()?.id, 
        name: doc.data()?.name,
        email:doc.data()?.email,
        password:doc.data()?.password,
        permission:doc.data()?.permission,
        enterprises: doc.data()?.enterprises,
        photo_url:doc.data()?.photo_url,
        status:doc.data()?.status, 
        checked:false,
        created_date:doc.data()?.created_date,
        fixed: doc.data()?.fixed,
        id_company: doc.data()?.id_company,
        cnpj:doc.data()?.cnpj,
        nameImage:doc.data()?.nameImage,
        phone:doc.data()?.phone
    }));
    } catch (e){
        console.log(e)
    }
    res.json(getUsers)
}
