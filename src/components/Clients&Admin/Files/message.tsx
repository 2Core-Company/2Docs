import React, { useState } from 'react'
import MessageIcon from "../../../../public/icons/message.svg";
import Image from 'next/image'
import styles from '../../Admin/Home/home.module.css'
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from '../../../../firebase'
import { toast } from 'react-toastify';
import { PlusCircledIcon } from '@radix-ui/react-icons';

 function Message({file, childToParentDownload, files}) {
    const [modalMessage, setModalMessage] = useState({permission:"", status:false})
    const [message, setMessage] = useState(file.message)
    const url = window.location.href

    function UploadMessage(){
        try{
            updateDoc(doc(db, 'files', file.id_company, "Arquivos", file.id_file), {
                message: message.trim()
            })
            const index = files.findIndex(file => file.id_file == file.id_file)
            files[index].message = message.trim()
            childToParentDownload(files)
            setModalMessage({...modalMessage, permission:"", status:false})
        } catch(e) {
            console.log(e)
            toast.error("Não foi possivél atualizar esta mensagem.")
        }
    }

  return (
    <>      {url.includes("/Admin") && file.from === "admin" || url.includes("/Clientes") && file.from === "user" ?
            <div onClick={() => setModalMessage({...modalMessage, permission:"edit", status:true})} className='bg-[#15E08B] w-[33px] h-[33px] rounded-[8px] justify-center items-center flex cursor-pointer hover:scale-105 duration-200'>
                {file?.message?.length > 0 ?  <Image src={MessageIcon} width={25} height={25} alt="Chat"/> : <PlusCircledIcon className='w-[25px] h-[25px] text-white'/> }
            </div>
             : 
                file?.message?.length > 0 ?
                    <div onClick={() => setModalMessage({...modalMessage, permission:"viwed", status:true})} className='bg-[#15E08B] w-[33px] h-[33px] rounded-[8px] justify-center items-center flex cursor-pointer hover:scale-105 duration-200'>
                        <Image src={MessageIcon} width={25} height={25} alt="Chat"/>
                    </div>
                : <></>
             }
        


        {modalMessage.status && modalMessage.permission === "edit"  ? 
            <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
                <div className='bg-primary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
                    <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
                        <div className='px-[10px] '>
                            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>{file.message?.length > 0 ? "Edite a observação deste arquivo." : "Adicione uma observação ao arquivo."}</p>
                            <p className='self-start mt-[15px] text-[20px] max-lsm:text-[18px] justify-self-start text-left'>Menssagem:</p>
                            <div className='px-[5px] border-black border-[2px] rounded-[8px]'>
                                <textarea maxLength={256} value={message} onChange={(text) =>  setMessage(text.target.value)} rows={3} id={styles.boxFiles} placeholder="Adicione uma observação..." className='w-full outline-none bg-transparent text-[18px] pr-[5px] dark:text-white'/>
                            </div>
                        </div>
                    <div className='flex w-full justify-end gap-4 bg-hilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[10px]'>
                        <button  onClick={() => setModalMessage({...modalMessage, permission:"", status:false})} className='bg-strong/40 border-[2px] border-strong hover:scale-[1.10] duration-300 p-[3px]  rounded-[8px] text-[18px] text-white '>Cancelar</button>
                        <button onClick={() => UploadMessage()} className={`bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)] border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Salvar</button>
                    </div>
                </div>
            </div>
        :
            <></>
        }

        {modalMessage.status && modalMessage.permission === "viwed"  ? 
            <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0 overflow-auto'>
                <div className='bg-primary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
                    <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
                        <div className='px-[10px]'>
                            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Este arquivo tem uma observação:</p>
                            <p className='text-left whitespace-pre-wrap w-full text-ellipsis overflow-hidden'>{message}</p>
                        </div>
                    <div className='flex w-full justify-end gap-4 bg-hilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[10px]'>
                        <button onClick={() => UploadMessage()} className={`bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)] border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Fechar</button>
                    </div>
                </div>
            </div>
        :<></>}

    </>
  )
}

export default Message

