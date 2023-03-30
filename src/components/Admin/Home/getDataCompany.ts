import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

export async function GetDataCompanyAdmin({id_company, dataCompany, setDataCompany}){
  const docRef = doc(db, "companies", id_company);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    var type = 'Mb'
    var sizeOfFiles = docSnap.data().size / 1000 //Transformando em megabyte
    if(sizeOfFiles >= 1000){
      sizeOfFiles = parseFloat((sizeOfFiles / 1000).toFixed(1))
      type = 'Gb'
    } else {
      sizeOfFiles = Math.ceil(sizeOfFiles)
    }

    const gbAll = 5000000000
    const porcentage = (Math.ceil((docSnap.data().size * 100) / gbAll))

    setDataCompany({...dataCompany, 
      id:docSnap.data().id, 
      contact:docSnap.data().contact, 
      questions:docSnap.data().questions,
      gbFiles:{type:type, size:sizeOfFiles, porcentage:porcentage}
    })

  } else {
    console.log("No such document!");
  }
}

export async function GetDataCompanyUser({id_company, dataCompany, setDataCompany}){
  const docRef = doc(db, "companies", id_company);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setDataCompany({...dataCompany, 
      id:docSnap.data().id, 
      contact:docSnap.data().contact, 
      questions:docSnap.data().questions,
    })

  } else {
    console.log("No such document!");
  }
}