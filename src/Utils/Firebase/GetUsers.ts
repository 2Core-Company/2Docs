import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { FilterFixed } from "../Other/Filters";
import { DataUser } from "../../types/users";

interface PropsGetUsers{
  id_company:string
  setPages:Function
  setUsers:Function
}

export async function GetUsers({id_company, setPages, setUsers}:PropsGetUsers) {
  try{
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", "==", 0), orderBy('name'));
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
      phone:doc.data()?.phone,
      admins: doc.data()?.admins,
    }));

    setPages(Math.ceil(getUsers.length / 10));
    setUsers(FilterFixed(getUsers));
  }catch(e){
    console.log(e)
  }
}
