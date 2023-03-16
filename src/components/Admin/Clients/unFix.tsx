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
    await updateDoc(doc(db, "users", user.id_company, "Clientes", user.id), {
      fixed: false,
    });
    const index = users.findIndex((user) => user.id == user.id);
    console.log(index);
    users[index].fixed = false;
    console.log(users);
    setUsersFilter(FilterFixed(users));
  } catch (e) {
    console.log(e);
    throw toast.error("Não foi possível fixar este usuário.");
  }
}

export default UnFix;
