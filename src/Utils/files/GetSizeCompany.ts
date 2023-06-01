import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GetSizeCompany({id_company}){
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      const size = docSnap.data().size
      return size
    }
  }