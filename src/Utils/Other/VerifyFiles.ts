import { Files } from "@/src/types/files";
import { toast } from "react-toastify";

export async function VerifyFiles({files}:{files: any}){
    const allFilesAfterVerify:any = []
    if(files.length > 10){
      throw toast.error('Você não pode armazenar mais de 10 arquivos de uma só vez.')
    }

    for await (const file of files) {
      if (file.size > 104857600) {
        toast.error(`Erro ao upar o arquivo: ${file.name}, ele excede o limite de 100mb`);
      } else {
        allFilesAfterVerify.push(file)
      }
    }

    if(allFilesAfterVerify.length === 0){
      files.value = null;
      throw Error
    }
    
    files.value = null;
    return allFilesAfterVerify
  }