import React, { useState } from 'react'
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../../../firebase'
import { toast } from 'react-toastify'
import { Files } from '../../../types/files'

    interface Props{
        modalMessage: {status: boolean, action: 'view' | 'edit', file?: Files}
        setModalMessage: React.Dispatch<React.SetStateAction<{status: boolean, action: 'view' | 'edit', index: number}>>
        setFiles: React.Dispatch<React.SetStateAction<Files[]>>
        admin: boolean;
    }

 function Message({admin, modalMessage, setFiles, setModalMessage}:Props) {
    const file = modalMessage.file!;

    const [message, setMessage] = useState<string | undefined>(file.message ? file.message : undefined)
    const toastMessage = {pending: 'Atualizando observação...', success: 'Observação atualizada com sucesso!', error: 'Não foi possível atualizar a observação deste arquivo.'}

    if(file.messageNotif && (admin && file.from === 'user' || admin === false && file.from === 'admin')) {
        try {
            updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
                messageNotif: false
            })
    
            setFiles((files) => {
                const index = files.findIndex((fileIndex) => fileIndex.id === file.id);
    
                files[index].messageNotif = false;
    
                return files;
            })
        } catch (e) {
            console.log(e)
            toast.error("Não foi possível atualizar esta mensagem.")
        }
    }

    async function UploadMessage(){
        if(message != undefined && file.message !== message){
            try{
                await updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
                    message: message.trim(),
                    messageNotif: true
                })

                setFiles((files) => {
                    const index = files.findIndex((fileIndex) => fileIndex.id === file.id);

                    files[index].message = message;
                    files[index].messageNotif = true;

                    return files;
                })

                setModalMessage({status: false, action: 'view', index: 0})
            } catch(e) {
                console.log(e)
                toast.error("Não foi possível atualizar esta mensagem.")
            }
        } else {
            setModalMessage({status: false, action: 'view', index: 0})
        }
    }

  return (
    <>
        {modalMessage.action === "edit" &&
        <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
            <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[15px] flex flex-col'>
                <div className='bg-[#10B981] w-full h-[16px] rounded-t-[15px]'/>
                    <div className='px-[33px] text-left'>
                        <p className='font-[500] text-[26px] max-lsm:text-[20px] mt-[18px] after:h-[3px] after:w-[38px] after:bg-[#10B981] after:block after:rounded-full'>Editar observação do arquivo</p>
                        <div className='mt-[20px]'>
                            <label htmlFor="textarea" className='text-[18px] mt-[20px] whitespace-pre-wrap w-full text-black text-ellipsis overflow-hidden'>Editar mensagem:</label>
                            <textarea id="textarea" maxLength={256} value={message} onChange={(text) =>  setMessage(text.target.value)} rows={4} placeholder="Escreva aqui sua observação..." className='w-full bg-transparent placeholder-[#9E9E9E]/70 rounded-[8px] border border-[#9E9E9E] text-[#686868] outline-none focus:border-[#10B981] focus:ring-1 focus:ring-offset-0 focus:ring-[#10B981] text-[16px] p-[6px] mt-[6px] resize-none'/>
                        </div>
                    </div>
                <div className='flex w-full border-t border-[#AAAAAA] justify-between bg-[#D9D9D9] px-[33px] py-[14px] rounded-b-[15px] mt-[25px]'>
                    <button onClick={() => setModalMessage({status: false, action: 'view', index: 0})} className='cursor-pointer bg-transparent border border-[#686868]/70 py-[10px] px-[23px] rounded-[8px] text-[16px] font-[500] text-[#686868]'>Fechar</button>
                    <button onClick={() => toast.promise(UploadMessage(), toastMessage)} className={`cursor-pointer bg-[#10B981]/30 border-[#10B981] border py-[10px] px-[23px] rounded-[8px] text-[16px] font-[500] text-[#117856]`}>Confirmar</button>
                </div>
            </div>
        </div>
        }
        {modalMessage.action === "view" &&
        <div className='w-screen h-screen fixed bg-black/20 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0 overflow-auto'>
            <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[15px] flex flex-col'>
                <div className='bg-[#10B981] w-full h-[16px] rounded-t-[15px]'/>
                    <div className='px-[33px] text-left'>
                        <p className='font-[500] text-[26px] max-lsm:text-[20px] mt-[18px] after:h-[3px] after:w-[38px] after:bg-[#10B981] after:block after:rounded-full'>Observação do arquivo</p>
                        <p className='text-[18px] mt-[20px] whitespace-pre-wrap w-full text-black text-ellipsis overflow-hidden'>Mensagem:</p>
                        <p className="text-[#686868] mt-[6px]">{message}</p>
                    </div>
                <div className='flex w-full justify-end h-[72px] bg-[#D9D9D9] pr-[33px] py-[14px] rounded-b-[15px] mt-[25px] border-t border-t-[#AAAAAA]'>
                    <button onClick={() => setModalMessage({status: false, action: 'view', index: 0})} className={`flex justify-center items-center cursor-pointer bg-transparent border-[#686868]/70 hover:border-[#686868] transition-[border] duration-300 border-[1px] py-[10px] px-[23px] rounded-[8px] font-[500] text-[16px] text-[#686868]`}>Fechar</button>
                </div>
            </div>
        </div>
        }
    </>
  )
}

export default Message

