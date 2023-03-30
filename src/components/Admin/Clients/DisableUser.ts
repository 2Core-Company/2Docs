import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, auth } from "../../../../firebase";
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { Users } from "../../../types/interfaces";

interface PropsDisableUser{
    users:Users[],
    usersFilter:Users[],
    selectUsers:Users[],
    id_company:string, 
    setUsersFilter:Function, 
    setMenu:Function, 
    setSelectUsers:Function
}

export async function DisableUser({users, usersFilter, selectUsers, id_company, setUsersFilter, setMenu, setSelectUsers}:PropsDisableUser) {
    const usersHere = [...usersFilter];
    const domain: string = new URL(window.location.href).origin;
    if (selectUsers.length > 0) {
      try{
        const result = await axios.post(`${domain}/api/users/disableUser`, {
            users: selectUsers,
            uid: auth.currentUser.uid,
        });

        if (result.data.type === "success") {
        try{
            for (let i = 0; i < selectUsers.length; i++) {
              await updateDoc(doc(db, "companies", id_company, "clients", selectUsers[i].id),{status: !selectUsers[i].status});
              const index = usersHere.findIndex((element) => element.id === selectUsers[i].id);
              usersHere[index].status = !users[index].status;
              usersHere[index].checked = false;
            }
            setUsersFilter(usersHere);
            setMenu(true);
            setSelectUsers([]);
        }catch(e){
            console.log(e)
            throw e 
        }
        } else {
            ErrorFirebase(result.data);
        }
      }catch(e){
        ErrorFirebase(e)
        console.log(e)
      }

    } else {
      toast.error("Nenhum usuário foi selecionado");
      throw Error;
    }
  }