import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../app/Context/contextUser'
import { Files } from '../../../types/files'
import { getRecentFiles } from '../../../Utils/Firebase/Files/getFiles'
import Image from 'next/image'
import { CalendarIcon, DownloadIcon } from '@radix-ui/react-icons'
import { FormatDateVerySmall } from '../../../Utils/Other/FormatDate'
import FormatSizeFile from '../../../Utils/Other/FormatSizeFile'
import DownloadsFile from '../../Clients&Admin/Files/downloadFiles'
import { Component } from '../../../Utils/Other/componentRoot'

function RecentsFiles() {
    const { dataUser } = useContext(userContext)
    const [recentsFiles, setRecentFiles] = useState<Files[]>()

    useEffect(() => {
        GetFiles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function GetFiles() {
        const result = await getRecentFiles({ id_company: dataUser.id_company, id_user: dataUser.id, from: 'admin' })
        if (result) {
            setRecentFiles(result)
        }
    }

    return (
        <div>
            <Component.root title='Arquivos recentes do Admin' className='p-[30px] max-sm:p-[20px]'>
                <div className='flex flex-col bg-primary gap-y-[20px] rounded-[12px] w-[500px] max-sm:w-[370px] max-lsm:w-[290px] min-h-[200px] max-sm:h-[280px] max-lsm:h-[270px]'>
                    {recentsFiles ?
                        recentsFiles.map((file) => {
                            return (
                                <div onClick={() => DownloadsFile({ selectFiles: [file], id_folder: file.id_folder, from: 'admin' })} key={file.id} className='flex items-center group cursor-pointer w-full group'>
                                    <Image src={`/icons/${file.type}.svg`} alt="Icone arquivo" quality={100} width={40} height={40} className='max-sm:w-[35px] max-sm:h-[35px]' />
                                    <div className='ml-[20px] max-sm:ml-[10px] w-full'>
                                        <div className='w-full'>
                                            <p className='text-[18px] max-sm:text-[16px] text-ellipsis overflow-hidden whitespace-nowrap max-w-[350px] max-sm:max-w-[250px] max-lsm:max-w-[200px]'>
                                                {file.name}
                                            </p>
                                        </div>
                                        <div className='flex text-[#9E9E9E] items-center'>
                                            <CalendarIcon className='w-[18px] h-[18px]' />
                                            <p className='text-[14px] ml-[5px]'>{FormatDateVerySmall(file.created_date)}</p>

                                            <Image src={`/icons/sizeFile.svg`} alt="Tamanho" className='ml-[20px]' quality={100} width={15} height={15} />
                                            <p className='text-[14px] ml-[5px]'>{FormatSizeFile(file.size)}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col w-[20px] h-[27px] relative'>
                                        <Image src={'/icons/topIconDownload.svg'} quality={100} width={20} height={15} alt='Download' className='top-0 absolute group-hover:animate-bounce-once duration-100' />
                                        <Image src={'/icons/bottomIconDownload.svg'} quality={100} width={20} height={15} alt='Download' className='absolute bottom-0' />
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className='w-full h-full items-center justify-center flex flex-col'>
                            <p className='text-[26px] max-sm:text-[23px] max-lsm:text-[21px] text-[#868686] text-center'>Nenhum arquivo recente...</p>
                            <Image alt={''} quality={100} priority={true} width={160} height={156} className='mt-[25px]' src={'/icons/imageFileDashboard.svg'} />
                        </div>
                    }
                </div>
            </Component.root>
        </div>
    )
}

export default RecentsFiles
