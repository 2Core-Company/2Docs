import { db } from '../../../../firebase'
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import { useLayoutEffect, useState, useContext } from 'react'
import styles from './home.module.css'
import DownloadFiles from '../../Clients&Admin/Files/dowloadFiles'
import { Files, DataCompany} from '../../../types/interfaces' 
import AppContext from '../../Clients&Admin/AppContext';


function ComponentHome () {
  const context = useContext(AppContext)
  const [recentsFile, setRecentsFile]= useState<Files[]>([])
  const [dataCompany, setDataCompany] = useState<DataCompany>({contact:[], questions:[]})

  useLayoutEffect(() => {
    if(context.dataUser != undefined){
      FilterDate(context.allFiles)
      GetContact()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context.dataUser])

  async function FilterDate(getFiles:Files[]){
    const filesHere = [...getFiles].filter(file => file.trash === false && file.from === "admin")
    const recents = []
    filesHere.sort((a, b) =>{ 
      a.created_date = new Date(a.created_date)
      b.created_date = new Date(b.created_date)
      return (a.created_date.getTime() - b.created_date.getTime())
    });
    for (var i = 0; 5 > i && i < (filesHere.length); i++) {
      recents.push(filesHere[i])
    }
    setRecentsFile(recents)
  }

  async function GetContact(){
    const docRef = doc(db, "users", context.dataUser.id_company);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDataCompany({...dataCompany, contact:docSnap.data().contact, id:docSnap.data().id, questions:docSnap.data().questions})
    } else {
      console.log("No such document!");
    }
  }

  function childToParentDownload(files){
    context.setAllFiles(files)
  }
  
  return (
    <div className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          {context.dataUser != undefined ? <Image src={context.dataUser.photo_url} alt="Logo da empresa" width={100} height={100} className="w-[100px] h-[100px] max-lg:w-[90px] max-lg:h-[90px] max-md:w-[80px] max-md:h-[80px] max-sm:w-[70px] max-sm:h-[70px] rounded-full absolute right-[20px]" /> : ""}
          <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Home</p>
          <div className='flex gap-[30px] max-md:gap-[10px] flex-wrap mt-[20px]'>
            <div>
              <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Uploads Recentes</p>
              <div className='border-[2px] border-secondary w-[300px] h-[200px] p-[10px] rounded-[12px] scroll-mt-[50px]'>
                <div id={styles.boxFiles} className='w-full h-full overflow-y-auto'>
                  {recentsFile?.map((file) =>{
                    return(
                      <div onClick={() => DownloadFiles({filesDownloaded:[file], files:context.allFiles, from:"user", childToParentDownload:childToParentDownload})} key={file.id_file} className="cursor-pointer flex items-center gap-[10px] mt-[10px] h-[50px]">
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                        <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Contato</p>
              <div className='border-[2px] border-secondary w-[300px] h-[200px] pr-[5px] rounded-[12px]'>
                <div id={styles.boxFiles} className='h-full overflow-y-scroll px-[10px] flex flex-col'>
                  {dataCompany?.contact.map((contact) => {
                    const linkWhatsApp = "https://wa.me/55" +  contact.replaceAll("(", "").replaceAll( ")", "").replaceAll( "-", "").replaceAll( " ", "")
                    return(
                      <a key={contact} href={linkWhatsApp } className="flex items-center gap-[10px] mt-[10px] h-[50px] underline underline-offset-[8px]">
                        <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                        <p  className='text-[20px] text-ellipsis pl-[5px] white-space'>{contact}</p>
                      </a> 
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <p  className='font-poiretOne text-[40px] max-sm:text-[35px] mt-[20px]'>Dúvidas Frequentes</p>
          <div className=' w-full'>
            {dataCompany?.questions.map((question) => {
              return(
                <div key={question.question} className="w-full">
                  <details>
                    <summary className='text-[18px] font-[600] whitespace-pre-line text-ellipsis overflow-hidden'>{question.question}</summary>
                    <p className='text-[18px] pl-[5px] pb-[15px] whitespace-pre-wrap w-full text-ellipsis overflow-hidden'>{question.response}</p>
                  </details> 
                </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}

export default ComponentHome 