'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { storage } from '../../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import { FormatDateSmall } from '../../../Utils/Other/FormatDate'
import { getDownloadURL, ref } from 'firebase/storage';
import { ShareFiles } from '../../../types/files';
import { getSharedFile } from '../../../Utils/Firebase/Files/getFiles'
import Logo2Docs from 'public/icons/Logo2Docs.svg';
import FileShareImage from 'public/image/ShareFileImage.svg';
import { FileIcon, ExternalLinkIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import FormatSizeFile from '@/src/Utils/Other/FormatSizeFile';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Props {
    id_company: string
    id_user: string
    id_share: string
}

function ShareFile({id_company, id_user, id_share}: Props) {
  const [file, setFile] = useState<ShareFiles | undefined>();
  const downloadToast = {pending: 'Preparando para baixar o arquivo...', success: 'Arquivo baixado com sucesso!'};

  useEffect(() => {
    getFile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  async function getFile(){
    if(id_company && id_user && id_share) {
        const response = await getSharedFile({id_company, id_user, id_share});

        if(response.status === 200) {
            setFile(response.file);
        } else {
            setFile(undefined)
        }
    }
  } 

  async function downloadFile(){
    if(file){
        const url = await getDownloadURL(ref(storage, file.path))
        let blob = await fetch(url).then(r => r.blob());
        const urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)

        try{
            const element:any = document.createElement("a");
            element.href = urlDownload
            element.download = file.fileName;
            document.body.appendChild(element);
            element.click();
            element.parentNode.removeChild(element);
        } catch(error) {
            throw toast.error(`Ocorreu um erro ao baixar o arquivo: ${error}`);
        }
    }
  }
  
  if(file !== undefined) {
    return(
        <section className='px-[60px] pt-[20px]' >
            <ToastContainer autoClose={3000}/>
            <Link href='https://www.2docs.app/' target='_blank' className='flex gap-[18px] items-center mb-[60px] select-none w-fit'>
                <Image alt='Logo da empresa 2Docs' src={Logo2Docs} width={64} height={64} priority/>
                <div className='h-[41px] w-[2px] bg-black'></div>
                <p className='text-[32px]'>2Docs</p>
            </Link>

            <div className='flex items-center gap-[8px] mb-[16px]'>
                <p className='text-[#686868]'>{'Compartilhamento >'}</p>
                <div className='flex gap-1'>
                    <FileIcon width={20} height={20} className='text-[#686868]' />
                    <p className='text-[#9E9E9E]'>{file.fileName}</p>
                </div>
            </div>

            <p className='font-poiretOne text-[40px] mb-[42px]'>Compartilhamento de Documento</p>
            
            <div className='flex max-lg:flex-col gap-[200px] items-center justify-evenly w-fit mx-auto'>
                <div className='flex flex-col gap-[55px] w-[357px]'>
                    <Image alt='Imagem de duas pessoas compartilhando um documento' src={FileShareImage}/>
                    <div className='text-[24px] text-[#686868]'>
                        <p>Você recebeu um documento armazenado no</p>
                        <div className='flex gap-2 items-center'>
                            <Link target='_blank' href='https://www.2docs.app/'><span className='text-[#10B981] underline decoration-dashed'>2Docs</span></Link>
                            <Link target='_blank' href='https://www.2docs.app/'><ExternalLinkIcon width={24} height={24} className='text-[#9E9E9E]'/></Link>
                        </div>
                    </div>
                </div>

                <div className='relative border border-[#9E9E9E] max-w-[550px] rounded-xl flex flex-col shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'>
                    <div className='absolute w-[21px] h-[21px] rounded-full border border-[#9E9E9E] right-3 top-3' />
                    <p className='w-full text-[28px] text-[#686868] p-[20px] border-b border-b-[#9E9E9E] mb-[43px]'>Ficha do Documento</p>
                    <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={48} height={48} className="mx-auto mb-3 select-none"/>
                    <p className='text-[20px] text-[#686868] text-center mb-[24px] px-[20px] truncate ...'>{file.fileName}</p>
                    <div className='relative rounded-lg border border-[#9E9E9E] mx-[40px] mb-[31px] max-w-[450px]'>
                        <div className='flex justify-between items-center px-3 py-[15px] border-b border-[#9E9E9E] gap-3'>
                            <p className='font-[500] text-[#686868]'>Compartilhado por:</p>
                            <div className='flex gap-[10px] text-[16px] items-center'>
                                <Image alt='Foto de perfil da pessoa que compartilhou o arquivo' src={file.shareUserAvatar} width={34} height={34} className='rounded-full' />
                                <p className='font-[300] text-[#686868] truncate ...'>{file.shareUserName}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-3 py-[15px] border-b border-[#9E9E9E]'>
                            <p className='font-[500] text-[#686868]'>Data de Upload:</p>
                            <div className='flex gap-[10px] text-[16px] items-center'>
                                <p className='font-[300] text-[#686868]'>{FormatDateSmall(file.uploadDate)}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-3 py-[15px] border-b border-[#9E9E9E]'>
                            <p className='font-[500] text-[#686868]'>Tamanho do arquivo:</p>
                            <div className='flex gap-[10px] text-[16px] items-center'>
                                <p className='font-[300] text-[#686868]'>{FormatSizeFile(file.size)[0] + FormatSizeFile(file.size)[1]}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center px-3 py-[15px]'>
                            <p className='font-[500] text-[#686868] mb-[30px]'>Observação: <span className='font-[300]'>{file.message !== '' ? file.message : 'Este arquivo não aparenta nenhuma observação.'}</span></p>
                        </div>

                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                <button className="absolute bottom-[15px] right-[15px] text-[#10B981]">
                                    <InfoCircledIcon width={16} height={16} />
                                </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                <Tooltip.Content
                                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded bg-primary p-[10px] text-[14px] font-[300] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                    align='end'
                                >
                                    As informações presentes neste arquivo são referentes ao dia em que foi compartilhado,<br/> quaisquer mudanças não serão atualizadas para esse compartilhamento.
                                    <Tooltip.Arrow className="fill-primary" />
                                </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </div>

                    <button onClick={() => toast.promise(downloadFile(), downloadToast)} className='bg-[#10B981] text-[18px] text-white py-[7px] rounded-lg text-center mx-[40px] mb-[20px]'>Fazer download</button>
                </div>
            </div>
                {/* <div className='mt-[20px] w-[60%] max-2xl:w-[75%] max-xl:w-[80%] max-lg:w-[85%] max-sm:w-[90%] flex flex-col items-center'>
                    <p className='text-[50px] max-2xl:text-[45px] max-xl:text-[40px] max-lg:text-[35px] max-md:text-[30px] max-sm:text-[25px]  text-black font-poiretOne font-[700] text-center'>Este arquivo foi compartilhado com você, clique no botão abaixo para fazer download.</p>
                    <Image src={DrawerFile} width={150} height={50} alt="Gaveta com documentos" className='mt-[20px] max-xl:w-[140px] max-lg:w-[130px] max-md:w-[120px] max-sm:w-[110px] max-lsm:w-[100px] aspect-auto'/>
                        <div className='text-[20px] max-lsm:text-[18px] w-full max-w-[500px] bg-hilight mt-[20px] px-[15px] py-[5px] rounded-[10px] shadow-[0_2px_10px_1px_rgba(0,0,0,0.5)] flex flex-col'>
                            <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Nome: </span>{nameFile}</p>
                            <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Compartilhado por: </span>{nameCompany}</p>
                            <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Data de Upload: </span> {FormatDate(created_date)}</p>
                            <Image src={`/icons/${type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={70} height={0} className="self-center mt-[15px] max-sm:w-[60px] max-lsm:w-[50px]"/>
                        <div className='flex justify-center mt-[15px]'>
                            <button onClick={async () =>  {const result = await toast.promise(downloadFile(), downloadToast)}} className='bg-[rgba(3,238,46,0.20)] px-[10px] max-lsm:px-[8px] py-[5px] max-lsm:py-[3px] max-lsm:text-[16px] rounded-[8px] hover:scale-105 text-black border-[1px] border-greenV'>Download</button>
                        </div>
                    </div>
                </div> */}
        </section>
    )
  } else {
    return <></>
  }
}

export default ShareFile