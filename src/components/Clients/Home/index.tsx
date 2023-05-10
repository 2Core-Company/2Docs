import Image from 'next/image';
import { useContext } from 'react'
import styles from './home.module.css'
import { userContext } from '../../../app/Context/contextUser';
import LightModeSwitch from "../../Clients&Admin/LightModeSwitch"
import Notification from './notification';
import Link from 'next/link';
import { companyContext } from '../../../app/Context/contextCompany';

function ComponentHome () {
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)
  
  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col text-black dark:text-white">
      <LightModeSwitch />
      <div className='w-[85%] h-full ml-[100px] max-lg:ml-[10px] max-lg:w-[90%] mt-[10px] max-lg:mt-[50px]'>
        <Notification dataUser={dataUser}/>
        <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Home</p>
        <div className='mt-[20px]'>
          <div>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Contato</p>
            <div className='border-[2px] border-secondary dark:border-dsecondary w-[300px] h-[200px] pr-[5px] rounded-[12px]'>
              <div id={styles.boxFiles} className='h-full overflow-y-scroll px-[10px] flex flex-col'>
                {dataCompany?.contact?.map((contact:string) => {
                  const linkWhatsApp = "https://wa.me/55" +  contact.replaceAll("(", "").replaceAll( ")", "").replaceAll( "-", "").replaceAll( " ", "")
                  return(
                    <Link key={contact} href={linkWhatsApp} target="_blank" className="flex items-center gap-[10px] mt-[10px] h-[50px] underline underline-offset-[8px]">
                      <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                      <p  className='text-[20px] text-ellipsis pl-[5px] white-space'>{contact}</p>
                    </Link > 
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {dataCompany?.questions ?  <p  className='font-poiretOne text-[40px] max-sm:text-[35px] mt-[20px]'>Dúvidas Frequentes</p> : <></>}
        <div className=' w-full'>
          {dataCompany?.questions?.map((question) => {
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