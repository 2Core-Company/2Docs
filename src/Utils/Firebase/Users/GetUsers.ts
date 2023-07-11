import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { DataUser, DataUserContext } from "../../../types/users";

interface PropsGetUsers{  
  id_company:string
}

export async function GetUsers({id_company}:PropsGetUsers) {
  try{
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", "==", 0), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.forEach((doc) => 
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
        pendencies: doc.data()?.pendencies
      })
    );

  return getUsers
  
  }catch(e){
    console.log(e)
  }
}


interface PropsGetUsersWithPendencies{  
  id_company:string
}

export async function GetUsersWithPendencies({id_company}:PropsGetUsersWithPendencies) {
  try{
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where('pendencies', '>', 0), where("permission", "==", 0),orderBy('pendencies'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.forEach((doc) => 
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
        pendencies: doc.data()?.pendencies
      })
    );
    return getUsers
  }catch(e){
    console.log(e)
    throw e
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
      checked:false,
      pendencies: doc.data()?.pendencies
    }))

    setAllAdmins(getAdmins)
  }catch(e){
    console.log(e)
  }
}