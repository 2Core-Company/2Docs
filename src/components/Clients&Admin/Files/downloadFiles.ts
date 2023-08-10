import { db, storage } from '../../../../firebase'
import { doc, writeBatch } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { getDownloadURL, ref } from 'firebase/storage';
import { getFolder } from '../../../Utils/Firebase/Folders/getFolders';

interface Props {
  selectFiles: Files[]
  files?: Files[]
  id_folder: string
  from: 'admin' | 'user'
}

async function downloadsFile({ selectFiles, files, id_folder, from }: Props) {
  const folder = await getFolder({ id_folder, id_company: selectFiles[0].id_company, id_enterprise: selectFiles[0].id_enterprise, id_user: selectFiles[0].id_user })
  const batch = writeBatch(db);

  const result = await toast.promise(getUrlDownloadFile(), { pending: "Fazendo download dos arquivos.", success: "Download feito com sucesso" })

  async function getUrlDownloadFile() {
    const promises: any = []
    const promises2: any = []
    for await (const file of selectFiles) {
      let monthDownload: Number = new Date(file.created_date).getMonth(), monthNow: Number = new Date().getMonth()

      if (from === "user" && file.from === 'admin' && folder?.singleDownload === true && file.downloaded === true) {
        throw toast.error("Este(s) arquivo(s) já foram baixados uma vez (Pasta configurada para downloads únicos).")
      }

      if (from === "user" && file.from === 'admin' && folder?.onlyMonthDownload === true && monthDownload !== monthNow) {
        throw toast.error("Este(s) arquivo(s) são do mês passado (Pasta configurada para download no mês).")
      }

      promises.push(getDownloadURL(ref(storage, file.path)))
    }

    const result = await Promise.all(promises)

    for await (const url of result) {
      promises2.push(fetch(url).then(r => r.blob()))
    }

    const allUrls = await Promise.all(promises2)

    await startDownload(allUrls)
  }

  async function startDownload(allUrls) {
    for (var i = 0; i < allUrls.length; i++) {
      const url = (window.URL ? URL : webkitURL).createObjectURL(allUrls[i])
      const element: any = document.createElement("a");
      element.href = url
      element.download = selectFiles[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);
    }

    await Promise.all([verifyDownload(), verifyViewed()])
      .then(async () => {
        await batch.commit()
      })

    return files;
  }

  async function verifyDownload() {
    for (let i = 0; i < selectFiles.length; i++) {
      selectFiles[i].checked = false

      if (from !== selectFiles[i].from && selectFiles[i].downloaded === false) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, 'user', 'files', selectFiles[i].id);
        batch.update(laRef, { downloaded: true })
        if (files) {
          const index = files.findIndex(file => file.id == selectFiles[i].id)
          files[index].downloaded = true;
        }
      }
    }
  }

  async function verifyViewed() {
    for (let i = 0; i < selectFiles.length; i++) {
      let viewedDate = new Date().getTime();

      if (from !== selectFiles[i].from && selectFiles[i].viewedDate === null) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, 'user', 'files', selectFiles[i].id);
        batch.update(laRef, { viewedDate: viewedDate })

        if (files) {
          const index = files.findIndex(file => file.id == selectFiles[i].id)
          files[index].viewedDate = viewedDate;
        }
      }
    }
  }

  return files;
}

export default downloadsFile