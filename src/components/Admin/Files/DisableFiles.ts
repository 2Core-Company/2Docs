'use client';
import { db } from '../../../../firebase';
import { deleteField, doc, writeBatch } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files';

interface Props{
  files:Files[]
  selectFiles:Files[]
}

async function DisableFiles({ files, selectFiles }:Props) {
  const allFiles = [...files];
  const batch = writeBatch(db);
  try{
    for await (const file of selectFiles){
      if(file.id_share) {
        const shareRef = doc(db, 'files', file.id_company, file.id_user, 'user', 'sharedFiles', file.id_share);
        batch.delete(shareRef);
      }
      
      const fileRef = doc(db, "files", file.id_company, file.id_user, 'user', 'files', file.id);
      batch.update(fileRef, {
        trash:true,
        id_share: deleteField()
      })
      const index:number = allFiles.findIndex((data) => data.id === file.id);
      file.checked = false;
      allFiles.splice(index, 1);
    } 
    await batch.commit();
  }catch(e){
    toast.error("Não Foi possível excluir este arquivo.");
    throw Error(e);
  }

  return allFiles;
}

export default DisableFiles