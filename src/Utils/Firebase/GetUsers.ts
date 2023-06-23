import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { FilterFixed } from "../Other/Filters";
import { DataUser, DataUserContext } from "../../types/users";

interface PropsGetUsers{  
  setPages: Function
  setUsers: Function
  dataAdmin: DataUserContext
}

export async function GetUsers({setPages, setUsers, dataAdmin}:PropsGetUsers) {
  try{
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", dataAdmin.id_company, "clients"), where("permission", "==", 0), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.forEach((doc) => 
    {if(doc.data()?.admins.length === 0 || doc.data()?.admins.findIndex((id) => id === dataAdmin.id) !== -1 || dataAdmin.permission === 3) {
      getUsers.push({
        id:doc.data()?.id, 
        name: doc.data()?.name,
        email:doc.data()?.email,
        permission:doc.data()?.permission,
        enterprises: doc.data()?.enterprises,
        photo_url:doc.data()?.photo_url,
        status:doc.data()?.status, 
        verifiedEmail:doc.data()?.verifiedEmail,
        checked:false,
        created_date:doc.data()?.created_date,
        fixed: doc.data()?.fixed,
        id_company: doc.data()?.id_company,
        nameImage:doc.data()?.nameImage,
        phone:doc.data()?.phone,
        admins: doc.data()?.admins,
      })
    }});

    setPages(Math.ceil(getUsers.length / 10));
    setUsers(FilterFixed(getUsers));
  }catch(e){
    console.log(e)
  }
}

type getAdminsProps = {
  id_company: string,
  setAllAdmins: Function
}

export async function getAdmins({id_company, setAllAdmins}:getAdminsProps) {
  try{
    const getAdmins: DataUserContext[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", ">", 0));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => getAdmins.push({
      id:doc.data()?.id, 
      created_date:doc.data()?.created_date,
      email:doc.data()?.email,
      id_company: doc.data()?.id_company,
      name: doc.data()?.name,
      verifiedEmail:doc.data()?.verifiedEmail,
      nameImage:doc.data()?.nameImage,
      permission:doc.data()?.permission,
      phone:doc.data()?.phone,
      photo_url:doc.data()?.photo_url,
      status:doc.data()?.status, 
      fixed: doc.data()?.fixed,
      enterprises: doc.data()?.enterprises,
      checked:false
    }))

    setAllAdmins(getAdmins)
  }catch(e){
    console.log(e)
  }
}