import React, { useState } from 'react'
import styles from '../../Admin/Home/home.module.css'
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from '../../../../firebase'
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'

    interface Props{
        files:Files[]
        modalMessage:{status:boolean, permission:string, index:number}
        childToParentDownload:Function
        setModalMessage:Function
    }

 function Message({modalMessage, files, childToParentDownload, setModalMessage}:Props) {
    const i = modalMessage.index
    const [message, setMessage] = useState<string | undefined>(files[i].message ? files[i].message : undefined)
    const toastoMessage = {pending: 'Atualizando observação...', success: 'Observação atualizada com sucesso!', error: 'Não foi possivel atualizar a observação deste arquivo.'}

    async function UploadMessage(){
        if(message != undefined){
            try{
                await updateDoc(doc(db, 'files', files[i].id_company, files[i].id_user, files[i].id), {
                    message: message.trim()
                })
                const index = files.findIndex(file => file.id == files[i].id)
                files[index].message = message.trim()
                childToParentDownload(files)
                setModalMessage({status:false, permission:'', index:0})
            } catch(e) {
                console.log(e)
                toast.error("Não foi possivél atualizar esta mensagem.")
            }
        }
    }

  return (
    <>      
        {modalMessage.permission === "edit"  ? 
            <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
                <div className='bg-primary dark:bg-dprimary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
                    <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
                        <div className='px-[10px] '>
                            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>{files[i]?.message ? "Edite a observação deste arquivo." : "Adicione uma observação ao arquivo."}</p>
                            <p className='self-start mt-[15px] text-[20px] max-lsm:text-[18px] justify-self-start text-left'>Menssagem:</p>
                            <div className='px-[5px] border-black border-[2px] rounded-[8px]'>
                                <textarea maxLength={256} value={message} onChange={(text) =>  setMessage(text.target.value)} rows={3} id={styles.boxFiles} placeholder="Adicione uma observação..." className='w-full outline-none bg-transparent text-[18px] pr-[5px] dark:text-white dark:placeholder:text-gray-500'/>
                            </div>
                        </div>
                    <div className='flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[10px]'>
                        <button  onClick={() => setModalMessage({status:false, permission:'', index:0})} className='cursor-pointer bg-strong/40 dark:bg-dstrong/40 border-[2px] border-strong hover:scale-[1.10] duration-300 p-[3px]  rounded-[8px] text-[18px] text-white '>Cancelar</button>
                        <button onClick={() => toast.promise(UploadMessage(), toastoMessage)} className={`cursor-pointer bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)] border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Salvar</button>
                    </div>
                </div>
            </div>
        :
            <></>
        }

        {modalMessage.permission === "viwed"  ? 
            <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0 overflow-auto'>
                <div className='bg-primary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
                    <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
                        <div className='px-[10px]'>
                            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Este arquivo tem uma observação:</p>
                            <p className='text-left whitespace-pre-wrap w-full text-ellipsis overflow-hidden'>{message}</p>
                        </div>
                    <div className='flex w-full justify-end gap-4 bg-hilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[10px]'>
                        <button onClick={() => setModalMessage({status:false, permission:'', index:0})} className={`cursor-pointer bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)] border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Fechar</button>
                    </div>
                </div>
            </div>
        :<></>}

    </>
  )
}

export default Message

