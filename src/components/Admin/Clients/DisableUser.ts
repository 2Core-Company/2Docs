import axios from "axios";
import { doc, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, auth } from "../../../../firebase";
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { DataUser } from "../../../types/users";

interface PropsDisableUser{
  users:DataUser[],
  selectUsers:DataUser[],
  id_company:string, 
  setMenu:Function, 
  setSelectUsers:Function
  setUsers:Function
}

export async function DisableUser({users, selectUsers, id_company, setMenu, setSelectUsers, setUsers}:PropsDisableUser) {
    const usersHere = [...users];
    const domain: string = window.location.origin
    const batch = writeBatch(db);
    if (selectUsers.length > 0) {
      try{
        const result = await axios.post(`${domain}/api/users/disableUser`, {
          users: selectUsers,
          uid: auth.currentUser?.uid,
        });

        if (result.data.type === "success") {
          try{
            for (let i = 0; i < selectUsers.length; i++) {
              batch.update(doc(db, "companies", id_company, "clients", selectUsers[i].id),{status: !selectUsers[i].disabled});
              const index = usersHere.findIndex((element) => element.id === selectUsers[i].id);
              usersHere[index].disabled = !users[index].disabled;
              usersHere[index].checked = false;
            }
            await batch.commit();
            setUsers(usersHere);
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