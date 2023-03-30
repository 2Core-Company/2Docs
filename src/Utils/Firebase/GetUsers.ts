import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { FilterFixed } from "../Other/Filters";

interface PropsGetUsers{
  id_company:string
  setPages:Function
  setUsers:Function
  setUsersFilter:Function
}

export async function GetUsers({id_company, setPages, setUsers, setUsersFilter}:PropsGetUsers) {
    const getUsers: Array<{ checked?: boolean }> = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", "==", 0), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const a = querySnapshot.forEach((doc) => getUsers.push(doc.data()));
    for (var i = 0; i < getUsers.length; i++) {
      getUsers[i].checked = false;
    }
    setPages(Math.ceil(getUsers.length / 10));
    setUsers(FilterFixed(getUsers));
    setUsersFilter(FilterFixed(getUsers));
}
