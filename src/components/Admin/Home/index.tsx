import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import Image from 'next/image';
import { useContext, useLayoutEffect, useState } from 'react'
import styles from './home.module.css'
import { toast } from 'react-toastify';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import DownloadFiles from '../../Clients&Admin/Files/dowloadFiles'
import { Files, DataCompany} from '../../../types/interfaces' 
import AppContext from '../../Clients&Admin/AppContext';
import { getDoc } from "firebase/firestore";  
import LightModeSwitch from "../../Clients&Admin/LightModeSwitch"

function ComponentHome () {
  const context = useContext(AppContext)
  const [gb, setGb] = useState<string>()
  const [gbPorcentage, setGbPorcentage] = useState<number>(0)
  const [recentsFile, setRecentsFile]= useState<Files[]>([])
  const [dataCompany, setDataCompany] = useState<DataCompany>({contact:[], questions:[]})

  useLayoutEffect(() => {
    if(context.dataUser != undefined){
      CalculatingGb(context.allFiles)
      FilterDate(context.allFiles)
      GetContact()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context.dataUser])

  function CalculatingGb(files:Files[]){
    const gbAll = 5000000
    var numbers: number | string | any  = 0
    for(var i = 0; i < files.length ; i++){
      numbers = numbers + files[i].size
    }
    const porcentage = (Math.ceil((numbers * 100) / gbAll))
    setGbPorcentage(porcentage)
    setGb((numbers / 1000000).toFixed(1))
  }

  async function FilterDate(getFiles:Files[]){
    const filesHere = [...getFiles].filter(file => file.trash === false && file.from === "user")
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

  function ChangeContact(content:{index:number, text:string}){
    const contacts = [...dataCompany.contact]
    contacts[content.index] = content.text
    setDataCompany({...dataCompany, contact:contacts})
  }

  const phoneMask = (value:string) => {
    if(value != undefined){
      return value
      .replaceAll("(", "")
      .replaceAll("(", "")
      .replaceAll("-", "")
      .replaceAll("-", "")
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/^(\d{2})(\d)/g,"($1) $2")
      .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    }
    return ""
  }

  async function UpdateBdContact(){
    await updateDoc(doc(db, 'users', context.dataUser.id_company), {
      contact: dataCompany.contact
    })
    .then(() => {
      toast.success("As informações foram salvas com sucesso.")
    })
    .catch((e) => {
      console.log(e)
      toast.error("Não foi possivel alterar as informações.")
    }) 
  }

  function ChangeQuestion(content:{index: number, text:string}){
    var questions = [...dataCompany.questions]
    if(questions[content.index] === undefined){
      questions.push({question:content.text, response: ""})
    } else {
      questions[content.index].question = content.text
    }
    setDataCompany({...dataCompany, questions:questions})
  }

  function ChangeResponse(content:{index: number, text:string}){
    var questions = [...dataCompany.questions]
    questions[content.index].response = content.text
    setDataCompany({...dataCompany, questions:questions})
  }

  async function UpdateBdQuestion(){
    await updateDoc(doc(db, 'users', context.dataUser.id_company), {
      questions: dataCompany.questions
    })
    .then(() => {
      toast.success("As informações foram salvas com sucesso.")
    })
    .catch((e) => {
      console.log(e)
      toast.error("Não foi possivel alterar as informações.")
    }) 
  }

  function childToParentDownload(files){
    context.setAllFiles(files)
  }

  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>        
        <LightModeSwitch />
        {context.dataUser != undefined ? <Image src={context.dataUser.photo_url} alt="Logo da empresa" width={100} height={100} className="border-[2px] border-secondary dark:border-dsecondary w-[100px] h-[100px] max-lg:w-[90px] max-lg:h-[90px] max-md:w-[80px] max-md:h-[80px] max-sm:w-[70px] max-sm:h-[70px] rounded-full absolute right-[20px]"/> : <></>}
        <p  className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Home</p>        
        <p  className=' font-poiretOne mt-[20px] text-[40px] max-sm:text-[35px] dark:text-white'>Uso</p>
        <div className='flex items-center gap-[30px] max-md:gap-[10px]'>
          <div className='w-[250px] h-[15px] bg-hilight border-[2px] border-black rounded-[4px]'>
            <div className="h-[11px] bg-[#BB8702] duration-700" style={{width:`${gbPorcentage}%`}}/>
          </div>
          <p className='text-[40px] max-lg:text-[30px] max-md:text-[25px] text-[#686868] dark:text-[#b1b1b1] font-[600]'><span className='text-[#BB8702]'>{gb}</span>Gb/<span className='text-secondary'>5</span>Gb</p>
        </div>

        <div className='flex gap-[30px] max-md:gap-[10px] flex-wrap mt-[20px]'>
          <div>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Uploads Recentes</p>
            <div  className='border-[2px] border-secondary dark:border-dsecondary w-[300px] h-[210px] pr-[5px] rounded-[12px]'>
              <div id={styles.boxFiles} className='h-full overflow-y-scroll pb-[5px] px-[5px]'>
                {recentsFile.length > 0 ?
                recentsFile.map((file) =>{
                    return(
                      <div onClick={() => DownloadFiles({filesDownloaded:[file], files:context.allFiles, from:"admin", childToParentDownload:childToParentDownload})} key={file.id_file} className="cursor-pointer flex items-center gap-[10px] mt-[10px] h-[50px]">
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                        <p className='overflow-hidden whitespace-nowrap text-ellipsis dark:text-white'>{file.name}</p>
                      </div>
                    )
                  })
                : <></>}
              </div>
            </div>
          </div>

          <div>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Contato</p>
            <div className='border-[2px] border-secondary dark:border-dsecondary w-[300px] h-[210px] pr-[5px] rounded-[12px]'>
              <div id={styles.boxFiles} className='h-full overflow-y-scroll px-[5px] flex flex-col'>
                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(dataCompany.contact[0])} onChange={(text) => ChangeContact({index:0, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px] dark:text-white dark:border-white'/>
                </div>

                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(dataCompany.contact[1])} onChange={(text) => ChangeContact({index:1, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px] dark:text-white dark:border-white'/>
                </div>

                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(dataCompany.contact[2])} onChange={(text) => ChangeContact({index:2, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px] dark:text-white dark:border-white'/>
                </div>

                <button onClick={() => UpdateBdContact()} className="cursor-pointer flex rounded-[8px] text-[20px] items-center mt-[10px] h-[50px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center mb-[10px]" >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>

        <p  className='font-poiretOne mt-[20px] text-[40px] max-lg:hidden dark:text-white'>Dúvidas Frequentes</p>
        <div className='max-lg:hidden border-[2px] border-secondary dark:border-dsecondary w-[850px] h-[400px] p-[10px] rounded-[12px]'>
          <div id={styles.boxFiles} className='overflow-y-scroll h-full px-[5px] flex flex-col'>
            <div className="flex items-center gap-[5px] mt-[10px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany.questions[0] ? dataCompany.questions[0].question : ""} onChange={(text)  => ChangeQuestion({index:0, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea  id={styles.boxFiles} rows={3} value={dataCompany.questions[0]  ? dataCompany.questions[0].response : ""} onChange={(text)  => ChangeResponse({index:0, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[30px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany.questions[1] ? dataCompany.questions[1].question : ""} onChange={(text)  => ChangeQuestion({index:1, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany.questions[1] ? dataCompany.questions[1].response : ""} onChange={(text)  => ChangeResponse({index:1, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[30px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany.questions[2] ? dataCompany.questions[2].question : ""} onChange={(text)  => ChangeQuestion({index:2, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany.questions[2] ? dataCompany.questions[2].response : ""} onChange={(text)  => ChangeResponse({index:2, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>
            <button onClick={() => UpdateBdQuestion()} className="cursor-pointer flex rounded-[8px] text-[20px] items-center mt-[10px] h-[50px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center" >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentHome 