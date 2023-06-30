import { toast } from "react-toastify";

export async function VerifyFiles({files, setFiles}:{files:any, setFiles:Function}){
    const allFilesAfterVerify:any = []

    if(files.length > 10){
      throw toast.error('Você não pode armazenar mais de 10 arquivos de uma só vez.')
    }

    for await (const file of files) {
      if (file.size > 30000000) {
        toast.error(`Erro ao upar o arquivo: ${file.name}, ele excede o limite de 30mb`);
      } else {
        allFilesAfterVerify .push(file)
      }
    }

    if(allFilesAfterVerify.length === 0){
      files.value = null;
      throw Error
    }
    
    setFiles(allFilesAfterVerify)
    files.value = null;
  }