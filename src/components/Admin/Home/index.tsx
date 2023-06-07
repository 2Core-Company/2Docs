'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc} from "firebase/firestore";
import Image from 'next/image';
import { useContext} from 'react'
import styles from './home.module.css'
import { toast } from 'react-toastify';
import { QuestionMarkCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import { adminContext }  from '../../../app/Context/contextAdmin';
import { companyContext } from '../../../app/Context/contextCompany';
import { PhoneMask } from '../../../Utils/Other/Masks';
import LightModeSwitch from "../../Clients&Admin/LightModeSwitch"
import AddContactImage from '../../../../public/icons/addContact.png'
import { Contact, Question } from '../../../types/dataCompany';
import axios from 'axios';


function ComponentHome () {
  const { dataAdmin } = useContext(adminContext)
  const { dataCompany, setDataCompany } = useContext(companyContext)
  const domain = window.location.origin


  //Função que edita o useState dos contatos
  function ChangeContact(content:{index:number, text:string}){
    var contacts:Contact[] = []
    if(dataCompany.contact){
      contacts = [...dataCompany.contact]
    }
    contacts[content.index] = content.text
    if(content.text.length === 0){
      contacts.splice(content.index,1)
    }
    setDataCompany({...dataCompany, contact:contacts})
  }

  //Função que atualiza o banco de dados dos contatos
  async function UpdateBdContact(){
    await updateDoc(doc(db, 'companies', dataAdmin.id_company), {
      contact: dataCompany.contact
    })
    .then(() => {
      toast.success("As informações foram salvas com sucesso.")
    })
    .catch((e) => {
      console.log(e)
      toast.error("Não foi possível alterar as informações.")
    }) 
  }

  //Função de adicionar contato
  function AddContact(){
    if(dataCompany.contact === undefined  || dataCompany.contact.length < 3){
      var contacts:Contact[] = []
      if(dataCompany.contact){
        contacts = [...dataCompany.contact]
      }
      contacts.push('') 
      setDataCompany({...dataCompany, contact:contacts})
    } else {
      toast.error('Sua empresa ja atingiu o numero maximo telefone adicionado.')
    }
  }

  //Função que edita o useState das questões
  function ChangeQuestion(content:{index: number, text:string}){
    var questions:Question[] = []

    if(dataCompany.questions){
      questions = [...dataCompany.questions]
    } 
    if(questions[content.index] === undefined){
      questions.push({question:content.text, response: ""})
    } else {
      questions[content.index].question = content.text
    }
    setDataCompany({...dataCompany, questions:questions})
  }

  //Função que edita o useState das respostas
  function ChangeResponse(content:{index: number, text:string}){
    var questions:Question[] = []

    if(dataCompany.questions){
      questions = [...dataCompany.questions]
    }
    if(questions[content.index] === undefined){
      questions.push({question:"", response: content.text})
    } else {
      questions[content.index].response = content.text
    }

    setDataCompany({...dataCompany, questions:questions})
  }

  //Função que atualiza o banco de dados das perguntas/respostas frequentes
  async function UpdateBdQuestion(){
    await updateDoc(doc(db, 'companies', dataAdmin.id_company), {
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

  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>        
        <LightModeSwitch />
        <p className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Home</p>        
        <div className='mt-[20px]'>
          <p  className='font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Contato</p>
          <div className='relative border-[2px] border-secondary dark:border-dsecondary w-[300px] h-[220px] px-[5px] rounded-[12px]'>

            {dataCompany?.contact?.length > 0 ? 
              <div className='pt-[15px] flex flex-col items-center'>
                <PlusIcon onClick={() => AddContact()} width={25} height={25} className='absolute right-0 top-0 text-[#34bf1b] cursor-pointer'/>
                {dataCompany?.contact?.map((contact:string, index) => {
                  return (
                    <div key={index} className="flex items-center gap-[10px] mt-[10px]">
                      <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                      <input  maxLength={15} type="text" value={PhoneMask(contact)} onChange={(text) => ChangeContact({index:index, text:text.target.value})} className='w-full  border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px] dark:text-white dark:border-white'/>
                    </div>
                  )
                })}
                <button onClick={() => UpdateBdContact()} className="hover:brightness-90  cursor-pointer flex rounded-[8px] text-[20px] items-center mt-[10px] py-[2px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center mb-[10px]" >
                  Salvar
                </button>
              </div>
              : 
                <div onClick={() => AddContact()} className='w-full h-full flex flex-col justify-center items-center cursor-pointer'>
                  <p className='text-center'>Adicione o telefone da sua empresa</p>
                  <Image src={AddContactImage} height={100} width={100} alt="Celular"/>
                </div>
              }
          </div>
        </div>

        <p  className='font-poiretOne mt-[20px] text-[40px] max-lg:hidden dark:text-white'>Dúvidas Frequentes</p>
        <div className='border-[2px] border-secondary dark:border-dsecondary max-w-[850px] w-full h-[400px] p-[10px] rounded-[12px] mt-[20px]'>
          <div id={styles.boxFiles} className='overflow-y-scroll h-full px-[5px] flex flex-col'>
            <div className="flex items-center gap-[5px] mt-[10px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[0]?.question : ""} onChange={(text)  => ChangeQuestion({index:0, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea  id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[0]?.response : ""} onChange={(text)  => ChangeResponse({index:0, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[30px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[1]?.question : ""} onChange={(text)  => ChangeQuestion({index:1, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[1]?.response : ""} onChange={(text)  => ChangeResponse({index:1, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[30px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] dark:text-white"/>
              <div className='border-black dark:border-white border-[2px] rounded-[8px] p-[5px] w-[94%]'>
                <p className='dark:text-white'>Pergunta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[2]?.question : ""} onChange={(text)  => ChangeQuestion({index:2, text:text.target.value})} className='w-full border-b-black dark:border-b-white border-b-[2px] outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
                <p className='dark:text-white'>Resposta:</p>
                <textarea id={styles.boxFiles} rows={3} value={dataCompany?.questions ? dataCompany?.questions[2]?.response : ""} onChange={(text)  => ChangeResponse({index:2, text:text.target.value})} className='w-full outline-none bg-transparent text-[18px] pl-[5px] dark:text-white'/>
              </div>
            </div>
            <button onClick={() => UpdateBdQuestion()} className="cursor-pointer hover:brightness-90 flex rounded-[8px] text-[20px] items-center mt-[10px] h-[50px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center" >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentHome 