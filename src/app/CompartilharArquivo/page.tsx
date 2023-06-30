'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import DrawerFile from '../../../public/icons/drawerFile.svg'
import { useSearchParams } from 'next/navigation';
import { db, storage } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FormatDate } from '../../Utils/Other/FormatDate'
import { getDownloadURL, ref } from 'firebase/storage';
import { Files } from '../../types/files';
import { GetSpecificFile } from '../../Utils/Firebase/Files/GetFiles'

function ShareFile() {
  const params:any = useSearchParams()
  const id_company = params.get('ic')
  const id_file = params.get('if')
  const id_user = params.get('iu')
  const nameCompany = params.get('nc')
  const nameFile = params.get('n')
  const type = params.get('ty')
  const created_date = params.get('d')
  const [file, setFile] = React.useState<Files | undefined>(undefined)

  useEffect(() => {
    GetFile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  async function GetFile(){
    await GetSpecificFile({id_company, id_user, id_file, setFile})
  } 

  async function DownloadFile(){
    if(file){
      if(file.viewedDate){
        return toast.error('Este arquivo ja foi baixado, por isso não sera possivel iniciar este download.')
      }  

      let viewedDate = new Date().toString();
      
      const url = await getDownloadURL(ref(storage, file.path))
      let blob = await fetch(url).then(r => r.blob());
      const urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
      try{
        const element:any = document.createElement("a");
        element.href = urlDownload
        element.download = file.name;
  
        document.body.appendChild(element);
  
        element.click();
  
        element.parentNode.removeChild(element);
        
        await updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
          viewedDate:viewedDate
        })
        setFile({...file})
      } catch(e) {
        console.log(e)
        toast.error("Não foi possivél baixar os arquivos.")
      }
    }
  }

  return (
    <section className='flex flex-col items-center'>
      <div className='mt-[20px] w-[60%] max-2xl:w-[75%] max-xl:w-[80%] max-lg:w-[85%] max-sm:w-[90%] flex flex-col items-center'>
        <p className='text-[50px] max-2xl:text-[45px] max-xl:text-[40px] max-lg:text-[35px] max-md:text-[30px] max-sm:text-[25px]  text-black font-poiretOne font-[700] text-center'>Este arquivo foi compartilhado com você, clique no botão abaixo para fazer download.</p>
        <Image src={DrawerFile} width={150} height={50} alt="Gaveta com documentos" className='mt-[20px] max-xl:w-[140px] max-lg:w-[130px] max-md:w-[120px] max-sm:w-[110px] max-lsm:w-[100px] aspect-auto'/>
        <div className='text-[20px] max-lsm:text-[18px] w-full max-w-[500px] bg-hilight mt-[20px] px-[15px] py-[5px] rounded-[10px] shadow-[0_2px_10px_1px_rgba(0,0,0,0.5)] flex flex-col'>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Nome: </span>{nameFile}</p>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Compartilhado por: </span>{nameCompany}</p>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Data de Upload: </span> {FormatDate(created_date)}</p>
          <Image src={`/icons/${type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={70} height={0} className="self-center mt-[15px] max-sm:w-[60px] max-lsm:w-[50px]"/>
          <div className='flex justify-center mt-[15px]'>
            <button onClick={() =>  DownloadFile()} className='bg-[rgba(3,238,46,0.20)] px-[10px] max-lsm:px-[8px] py-[5px] max-lsm:py-[3px] max-lsm:text-[16px] rounded-[8px] hover:scale-105 text-black border-[1px] border-greenV'>Download</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShareFile


