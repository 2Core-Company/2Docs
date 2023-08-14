import axios from "axios";
import { doc, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
import { db, auth } from "../../../../firebase";
import ErrorFirebase from "../../../Utils/Firebase/ErrorFirebase";
import { DataUser } from "../../../types/users";

interface PropsDisableUser {
  users: DataUser[],
  user: DataUser,
  id_company: string,
  setUsers: Function
}

export async function DisableUser({ users, user, id_company, setUsers }: PropsDisableUser) {
  const usersHere = [...users];
  const domain: string = window.location.origin
  const batch = writeBatch(db);
  if (users.length > 0) {
    try {
      const result = await axios.post(`${domain}/api/users/disableUser`, {
        user: user,
        uid: auth.currentUser?.uid,
      });
      console.log(result)
      if (result.data.type === "success") {
        try {
          batch.update(doc(db, "companies", id_company, "clients", user.id), { disabled: !user.disabled });
          const index = usersHere.findIndex((element) => element.id === user.id);
          usersHere[index].disabled = !users[index].disabled;
          usersHere[index].checked = false;

          await batch.commit();
          setUsers(usersHere);
        } catch (e) {
          console.log(e)
          throw e
        }
      } else {
        ErrorFirebase(result.data);
      }
    } catch (e) {
      ErrorFirebase(e)
      console.log(e)
    }

  } else {
    toast.error("Nenhum usuário foi selecionado");
    throw Error;
  }
}