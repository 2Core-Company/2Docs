import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { DataUser, DataUserContext } from "../../../types/users";

interface PropsGetUsers {
  id_company: string
  permission: number
  admin_id: string
}

export async function GetUsers({ id_company, permission, admin_id }: PropsGetUsers) {
  try {
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", "==", 0), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.forEach((doc) => {
      if (doc.data()?.admins.length == 0 || (doc.data()?.admins != null && doc.data()?.admins.includes(admin_id)) || permission === 3) {
        getUsers.push({
          id: doc.data()?.id,
          name: doc.data()?.name,
          email: doc.data()?.email,
          permission: doc.data()?.permission,
          enterprises: doc.data()?.enterprises,
          photo_url: doc.data()?.photo_url,
          disabled: doc.data()?.disabled,
          verifiedEmail: doc.data()?.verifiedEmail,
          checked: false,
          created_date: doc.data()?.created_date,
          fixed: doc.data()?.fixed,
          id_company: doc.data()?.id_company,
          nameImage: doc.data()?.nameImage,
          phone: doc.data()?.phone,
          admins: doc.data()?.admins,
          pendencies: doc.data()?.pendencies
        })
      }
    }
    );

    return getUsers

  } catch (e) {
    console.log(e)
  }
}


interface PropsGetUsersWithPendencies {
  id_company: string
  permission: number
  admin_id: string
}

export async function GetUsersWithPendencies({ id_company, admin_id, permission  }: PropsGetUsersWithPendencies) {
  try {
    const getUsers: DataUser[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where('pendencies', '>', 0), where("permission", "==", 0), orderBy('pendencies'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.forEach((doc) => {
      if (doc.data()?.admins.length == 0  || (doc.data()?.admins != null && doc.data()?.admins.includes(admin_id)) || permission === 3) {
        getUsers.push({
          id: doc.data()?.id,
          name: doc.data()?.name,
          email: doc.data()?.email,
          permission: doc.data()?.permission,
          enterprises: doc.data()?.enterprises,
          photo_url: doc.data()?.photo_url,
          disabled: doc.data()?.disabled,
          verifiedEmail: doc.data()?.verifiedEmail,
          checked: false,
          created_date: doc.data()?.created_date,
          fixed: doc.data()?.fixed,
          id_company: doc.data()?.id_company,
          nameImage: doc.data()?.nameImage,
          phone: doc.data()?.phone,
          admins: doc.data()?.admins,
          pendencies: doc.data()?.pendencies
        })
      }

    });
    return getUsers
  } catch (e) {
    console.log(e)
    throw e
  }
}


type getAdminsProps = {
  id_company: string
}

export async function getAdmins({ id_company }: getAdminsProps) {
  try {
    const getAdmins: DataUserContext[] = [];
    const q = query(collection(db, "companies", id_company, "clients"), where("permission", ">", 0));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => getAdmins.push({
      id: doc.data()?.id,
      created_date: doc.data()?.created_date,
      email: doc.data()?.email,
      id_company: doc.data()?.id_company,
      name: doc.data()?.name,
      verifiedEmail: doc.data()?.verifiedEmail,
      nameImage: doc.data()?.nameImage,
      permission: doc.data()?.permission,
      phone: doc.data()?.phone,
      photo_url: doc.data()?.photo_url,
      disabled: doc.data()?.disabled,
      fixed: doc.data()?.fixed,
      enterprises: doc.data()?.enterprises,
      checked: false,
      pendencies: doc.data()?.pendencies
    }))

    return getAdmins
  } catch (e) {
    console.log(e)
  }
}


interface getUserProps {
  id_company: string
  id_user: string
}

export async function GetUser({ id_company, id_user }: getUserProps) {
  const docRef = doc(db, "companies", id_company, "clients", id_user);
  const docSnap = await getDoc(docRef);

  var dataUser: DataUser = {
    id: docSnap.data()?.id,
    created_date: docSnap.data()?.created_date,
    email: docSnap.data()?.email,
    id_company: docSnap.data()?.id_company,
    name: docSnap.data()?.name,
    verifiedEmail: docSnap.data()?.verifiedEmail,
    nameImage: docSnap.data()?.nameImage,
    permission: docSnap.data()?.permission,
    phone: docSnap.data()?.phone,
    photo_url: docSnap.data()?.photo_url,
    disabled: docSnap.data()?.disabled,
    admins: docSnap.data()?.admins,
    fixed: docSnap.data()?.fixed,
    enterprises: docSnap.data()?.enterprises,
    checked: false,
    pendencies: docSnap.data()?.pendencies
  }
  return dataUser
}