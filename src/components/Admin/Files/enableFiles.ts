'use client';
import { db } from '../../../../firebase';
import { doc, writeBatch } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files';

interface Props{
  selectedFiles: Files[]
  files: Files[]
}

async function enableFiles({ selectedFiles, files }:Props) {
  if(selectedFiles.length > 0){
    return toast.promise(enableFile(), {pending:"Restaurando arquivos.", success:"Arquivos restaurados.", error:"Não foi possível restaurar os arquivos."});
  } else {
    toast.error("Selecione um arquivo para recuperar.");
  }
  
  async function enableFile(){
    const batch = writeBatch(db);

    try{
      for await (const file of selectedFiles){
        const ref = doc(db, "files", file.id_company, file.id_user, 'user', 'files', file.id);
        batch.update(ref, {
          trash: false
        });

        const index = files.findIndex((data) => data.id === file.id);
        files.splice(index, 1);
      }

      await batch.commit();

      return files;
    }catch(e) {
      toast.error("Não foi possível recuperar este arquivo.");
      throw Error(e);
    }
  }
}

export default enableFiles;