import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../../../firebase';
import { Files, ShareFiles } from '../../../types/files';
import copy from 'copy-to-clipboard';
import tinyUrl from 'tinyurl';
import { uuidv4 } from '@firebase/util';
import { shortenURL } from '@/lib/shorten';

interface Props{
    file: Files
    shareUserAvatar: string
    shareUserName: string
}

async function shareFile({file, shareUserAvatar, shareUserName}:Props) {
  const sharedFileId = uuidv4();
  const url = window.location.origin;

  if(file.id_share) {
    const urlFile = `${url}/Arquivo/${file.id_share}/${file.id_company}/${file.id_user}`;
    shortenURL(urlFile).then((shortUrl: string) => {
      copy(shortUrl);
    }).catch((error) => {
      toast.error(`Ocorreu um erro ao copiar o link: ${error}`);
      return {status: 400, message: `Ocorreu um erro ao copiar o link: ${error}`};
    })
  } else {
    const response1 = await setSharedFileDoc({file, shareUserAvatar, shareUserName, sharedFileId});
    if(response1.status === 400) {
      throw toast.error(response1.message);
    }

    const response2 = await updateFileDoc({file, sharedFileId});
    if(response2.status === 400) {
      throw toast.error(response2.message);
    }

    const urlFile = `${url}/Arquivo/${sharedFileId}/${file.id_company}/${file.id_user}`;
    shortenURL(urlFile).then((shortUrl: string) => {
      copy(shortUrl);
      file.id_share = sharedFileId;
    }).catch((error) => {
      toast.error(`Ocorreu um erro ao copiar o link: ${error}`);
      return {status: 400, message: `Ocorreu um erro ao copiar o link: ${error}`};
    })
  }

  return {status: 200, message: 'Link compartilhável copiado com sucesso!', file};
}

interface setSharedFileDocProps {
  file: Files
  shareUserAvatar: string
  shareUserName: string
  sharedFileId: string
}

async function setSharedFileDoc({file, shareUserAvatar, shareUserName, sharedFileId}: setSharedFileDocProps) {
  try {
    const collectionRef = collection(db, 'files', file.id_company, file.id_user, 'user', 'sharedFiles');
    const docRef = doc(collectionRef, sharedFileId);
    const data: ShareFiles = {
      id: sharedFileId,
      fileName: file.name,
      path: file.path,
      shareUserAvatar: shareUserAvatar,
      shareUserName: shareUserName,
      size: file.size,
      type: file.type,
      uploadDate: file.created_date,
      message: file.message
    }
    await setDoc(docRef, data);

    return {status: 200, message: 'Documento criado nos arquivos compartilhados com sucesso!'};
  } catch (error) {
    return {status: 400, message: `Ocorreu um erro enquanto criava um documento nos arquivos compartilhados: ${error}`};
  }
}

interface updateFileDocProps {
  file: Files
  sharedFileId: string
}

async function updateFileDoc({file, sharedFileId}: updateFileDocProps) {
  try {
    const collectionRef = collection(db, 'files', file.id_company, file.id_user, 'user', 'files');
    const docRef = doc(collectionRef, file.id);
    await updateDoc(docRef, {
      id_share: sharedFileId
    });

    return {status: 200, message: 'Documento atualizada nos arquivos com sucesso!'}
  } catch (error) {
    return {status: 400, message: `Ocorreu um erro enquanto atualizava um documento nos arquivos: ${error}`};
  }
}

export default shareFile