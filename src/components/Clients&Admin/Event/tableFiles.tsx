import { DownloadIcon, EyeOpenIcon, Pencil2Icon, Share1Icon, TrashIcon } from '@radix-ui/react-icons';
import React, { useContext, useState } from 'react'
import Image from 'next/image';
import DocTable from '../../Clients&Admin/Files/DocTable';
import { adminContext } from '@/src/app/Context/contextAdmin';
import { Files } from '@/src/types/files';
import { FormatDate } from '@/src/Utils/Other/FormatDate';
import FormatSizeFile from '@/src/Utils/Other/FormatSizeFile';
import { Filter } from '@/src/types/others';
import { toast } from 'react-toastify';
import downloadsFile from '../Files/downloadFiles';
import DeletFiles from '../Files/DeletFiles';
import { companyContext } from '@/src/app/Context/contextCompany';
import Rename from '../Files/rename';
import ViewFile from '../Files/viewFile';
import { Event } from '@/src/types/event';
import { FilterAlphabetical, FilterDate, FilterSize } from '@/src/Utils/Other/Filters';
import { UpdateStatusDelivered } from '@/src/Utils/Firebase/Events/UpdateStatusDelivered';

interface Props {
    event: Event
    files: Files[]
    setFiles: React.Dispatch<React.SetStateAction<Files[] | undefined>>
    setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>
}

function TableFiles({ event, files, setFiles, setEvent }: Props) {
    const { dataAdmin } = useContext(adminContext)
    const { dataCompany } = useContext(companyContext)
    const [dataPages, setDataPages] = useState<{ page: number, maxPages: number }>({ page: 1, maxPages: 1 })
    const [filter, setFilter] = useState<{ name: 'asc' | 'desc', size: 'asc' | 'desc', date: 'asc' | 'desc' }>({ name: 'asc', size: 'asc', date: 'asc' })
    const [viewFile, setViewFile] = useState<{ status: boolean, file?: Files }>({ status: false })
    const [renameFile, setRenameFile] = useState<{ status: boolean, file?: Files }>({ status: false })
    const admin = dataAdmin.id === '' ? false : true

    function changeFilter(button: "name" | "size" | "date") {
        switch (button) {
            case "name":
                const result = FilterAlphabetical({ data: files, action: filter.name })
                setFilter({ name: filter.name === 'asc' ? 'desc' : 'asc', size: 'asc', date: 'asc' });
                break;
            case "size":
                const result2 = FilterSize({ data: files, action: filter.size })
                setFilter({ name: 'asc', size: filter.size === 'asc' ? 'desc' : 'asc', date: 'asc' });
                break;
            case "date":
                const result3 = FilterDate({ data: files, action: filter.date })
                setFilter({ name: 'asc', size: 'asc', date: filter.date === 'asc' ? 'desc' : 'asc' });
                break;
        }
    }

    async function downloadFiles(selectedFiles: Files[]) {
        if (selectedFiles.length === 0) {
            throw toast.error("Selecione um arquivo para baixar.")
        }

        const result = await downloadsFile({ selectFiles: selectedFiles, files: files, from: admin ? 'admin' : 'user', id_folder: event.id_folder })

        if (result) {
            setFiles([...files])
        }
    }

    async function deleteFiles(selectedFiles: Files[]) {
        let result;

        if (selectedFiles.length === 0) {
            return toast.error("Selecione um arquivo para deletar.")
        }

        result = await toast.promise(DeletFiles({ files, selectFiles: selectedFiles, id_company: dataCompany.id }), { pending: "Deletando arquivos...", success: "Seus arquivos foram deletados.", error: "Não foi possível deletar os arquivos." })
        
        if(result.length === 0){
            await UpdateStatusDelivered({id_company:dataCompany.id, id_event:event.id, status:false})
            setEvent({...event, delivered:false})
        }

        if (result) {
            const maxPages = Math.ceil(result.length / 10)
            var page = dataPages.page
            if (maxPages < dataPages.page) {
                page = maxPages
            }
            setFiles([...result])
            setDataPages({ maxPages: maxPages, page: page })
        }
    }

    return (
        <DocTable.Root>
            {viewFile.status && <ViewFile file={viewFile.file!} setFiles={setFiles} setViewFile={setViewFile} admin={admin} />}
            {renameFile.status && <Rename setFiles={setFiles} renameFile={renameFile} setRenameFile={setRenameFile} />}
            {files.length > 0 ?
                <DocTable.Content>
                    <DocTable.Heading className="px-[25px] border-t-[0px] rounded-t-[8px] grid-cols-[1fr_200px_200px_100px] max-lg:grid-cols-[60px_1fr_120px_140px_150px] max-md:grid-cols-[60px_1fr_140px_150px] max-sm:grid-cols-[60px_1fr_150px]">
                        <DocTable.Filter label="Nome" arrow active={filter.name} onClick={() => changeFilter("name")} />
                        <DocTable.Filter label="Tamanho" arrow active={filter.size} className="max-md:hidden justify-center" onClick={() => changeFilter("size")} />
                        <DocTable.Filter label="Data de Upload" arrow active={filter.date} className={"max-lg:hidden"} onClick={() => changeFilter("date")} />
                    </DocTable.Heading>
                    <DocTable.Files>
                        {files.map((file: Files, index) => {
                            return (
                                <DocTable.File key={index} className={`px-[25px] grid-cols-[1fr_200px_200px_100px] max-lg:grid-cols-[60px__1fr_120px_140px_150px] max-md:grid-cols-[60px__1fr_140px_150px] max-sm:grid-cols-[60px__1fr_150px] ${(index % 9 === 0 && index !== 0) && 'border-none'}`}>
                                    <DocTable.Data>
                                        <DocTable.Icon>
                                            <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={30} height={30} className="mr-[23px] w-[30px] h-[30px] max-lg:w-[25px] max-lg:h-[25px]" />
                                        </DocTable.Icon>
                                        <DocTable.Text className="text-[#000] font-[400]">{file.name}</DocTable.Text>
                                    </DocTable.Data>
                                    <DocTable.Data className="justify-center gap-1">
                                        <DocTable.Text>{FormatSizeFile(file.size)[0]}</DocTable.Text>
                                        <DocTable.Label>{FormatSizeFile(file.size)[1]}</DocTable.Label>
                                    </DocTable.Data>
                                    <DocTable.Data>
                                        <DocTable.Text>{FormatDate(file.created_date)}</DocTable.Text>
                                    </DocTable.Data>
                                    <DocTable.FileActions>
                                        <DocTable.Options>
                                            <DocTable.OptionsItem dropdownClassName="rounded-t-[6px]" onClick={() => setViewFile({ status: true, file: file })}>
                                                <DocTable.OptionsItemIcon><EyeOpenIcon width={18} height={18} className="text-[#686868] group-hover:text-white" /></DocTable.OptionsItemIcon>
                                                <DocTable.OptionsItemLabel>Visualizar</DocTable.OptionsItemLabel>
                                            </DocTable.OptionsItem>
                                            <DocTable.OptionsItem onClick={() => downloadFiles([file])}>
                                                <DocTable.OptionsItemIcon><DownloadIcon width={18} height={18} className="text-[#686868] group-hover:text-white" /></DocTable.OptionsItemIcon>
                                                <DocTable.OptionsItemLabel>Baixar</DocTable.OptionsItemLabel>
                                            </DocTable.OptionsItem>
                                            <DocTable.OptionsItem onClick={() => setRenameFile({ status: true, file: file })}>
                                                <DocTable.OptionsItemIcon><Pencil2Icon width={18} height={18} className="text-[#686868] group-hover:text-white" /></DocTable.OptionsItemIcon>
                                                <DocTable.OptionsItemLabel>Renomear</DocTable.OptionsItemLabel>
                                            </DocTable.OptionsItem>
                                            <DocTable.OptionsItem>
                                                <DocTable.OptionsItemIcon><Share1Icon width={18} height={18} className="text-[#686868] group-hover:text-white" /></DocTable.OptionsItemIcon>
                                                <DocTable.OptionsItemLabel>Compartilhar</DocTable.OptionsItemLabel>
                                            </DocTable.OptionsItem>

                                            <DocTable.OptionsItem onClick={() => deleteFiles([file])} dropdownClassName="rounded-b-[6px] hover:bg-[#BE0000]">
                                                <DocTable.OptionsItemIcon><TrashIcon width={18} height={18} className="text-[#686868] group-hover:text-white" /></DocTable.OptionsItemIcon>
                                                <DocTable.OptionsItemLabel>Excluir</DocTable.OptionsItemLabel>
                                            </DocTable.OptionsItem>

                                        </DocTable.Options>
                                    </DocTable.FileActions>
                                </DocTable.File>
                            )
                        })}
                    </DocTable.Files>
                </DocTable.Content> :
                <div className='w-full h-[500px] flex justify-center items-center flex-col'>
                    <Image src={'/icons/addFile.svg'} width={180} height={180} alt="Imagem de 2 arquivos" priority className='w-[180px] h-[180px]' />
                    <p className='font-poiretOne text-[#686868] text-[40px] max-sm:text-[30px]'>{'Nenhum arquivo foi encontrado'}</p>
                </div>
            }
        </DocTable.Root>
    )
}

export default TableFiles