import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { DataUser } from "../../../types/users";

interface Props {
  user: DataUser;
  users: DataUser[];
  FilterFixed: Function;
  setUsers: Function;
}

async function UnFix({user, users, FilterFixed, setUsers }: Props) {
  try {
    await updateDoc(doc(db, "companies", user.id_company, "clients", user.id), {
      fixed: false,
    });
    const index = users.findIndex((user) => user.id == user.id);
    users[index].fixed = false;
    setUsers(FilterFixed(users));
  } catch (e) {
    console.log(e);
    throw toast.error("Não foi possível desfixar este usuário.");
  }
}

export default UnFix;
