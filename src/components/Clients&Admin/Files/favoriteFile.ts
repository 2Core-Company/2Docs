import { db } from '../../../../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { Files } from '../../../types/files';
import { toast } from 'react-toastify';

interface Props{
    folderName: string
    file: Files
    setFiles: React.Dispatch<React.SetStateAction<Files[]>>
}

async function favoriteFile({folderName, file, setFiles}: Props) {
    const toastMessage = {pending:`${file.favorite ? 'Desfavoritando' : 'Favoritando'} o arquivo.`, success:`Arquivo ${file.favorite ? 'desfavoritado' : 'favoritado'} com sucesso!.`};

    toast.promise(async () => {
        try{
            await updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
                favorite: !file.favorite
            })
    
            setFiles((files) => {
                const index = files.findIndex((fileIndex) => fileIndex.id === file.id);
                if(folderName === 'Favoritos') {
                    files.splice(index, 1);
                    return [...files];
                } else {
                    files[index].favorite = !files[index].favorite;
                    return [...files];
                }
            })
        } catch(e) {
            console.log(e);
            toast.error("Não foi possível favoritar este arquivo.");
        }
    }, toastMessage
    )
}

export default favoriteFile