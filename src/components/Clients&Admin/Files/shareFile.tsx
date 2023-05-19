import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'
import { db } from '../../../../firebase';
import { Files } from '../../../types/files'
import copy from "copy-to-clipboard"
import tinyUrl from 'tinyurl';

interface Props{
    file:Files
}

async function ShareFile({file}:Props) {
    if(file.viewed){
        return toast.error("Você não pode compartilhar um arquivo que ja foi visualizado.")
    } else {
        const docRef = doc(db, "companies", file.id_company);
        const docSnap = await getDoc(docRef)
        const nameCompany = docSnap.data()?.name
        const url = window.location.origin
        const urlFile = `${url}/CompartilharArquivo?ic=${file.id_company}&&if=${file.id}&&iu=${file.id_user}&&n=${file.name}&&d=${file.created_date}&&nc=${nameCompany}`

        shortenURL(urlFile).then((shortURL:string) => {
          copy(shortURL)
          toast.success('Link copiado!')
        }).catch((error) => {
            console.error(error);
        });
    } 
}

export default ShareFile

  async function shortenURL(longURL) {
    return new Promise((resolve, reject) => {
      tinyUrl.shorten(longURL, (shortURL) => {
        if (shortURL) {
          resolve(shortURL);
        } else {
          reject(new Error('Failed to shorten URL'));
        }
      });
    });
  }


