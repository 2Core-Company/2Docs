import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Users, UsersFilter } from "../../../types/interfaces";

interface Props {
  user: UsersFilter;
  users: Users[];
  FilterFixed: Function;
  setUsersFilter: Function;
}

async function UnFix({ user, users, FilterFixed, setUsersFilter }: Props) {
  try {
    await updateDoc(doc(db, "companies", user.id_company, "clients", user.id), {
      fixed: false,
    });
    const index = users.findIndex((user) => user.id == user.id);
    users[index].fixed = false;
    setUsersFilter(FilterFixed(users));
  } catch (e) {
    console.log(e);
    throw toast.error("Não foi possível fixar este usuário.");
  }
}

export default UnFix;
