import { Files } from "@/src/types/files"
import { Dispatch, SetStateAction } from "react"

type changePageProps = {
    action: 'back' | 'next'
    dataPages: {page: number; maxPages: number;}
    setDataPages: Dispatch<SetStateAction<{page: number; maxPages: number;}>>
    unselectFunction: () => void;
}
function changePage({ action, dataPages, setDataPages, unselectFunction }: changePageProps) {
    if(action === 'back') {
        if(dataPages.page > 1) {
            setDataPages({...dataPages, page: dataPages.page - 1});
        }

        unselectFunction()
    } else {
        if(dataPages.page < dataPages.maxPages) {
            setDataPages({...dataPages, page: dataPages.page + 1});
        }

        unselectFunction()
    }
}

type DocTableFooterProps = {
    files: Files[]
    textSearch: string
    dataPages: {page: number, maxPages: number}
    setDataPages: React.Dispatch<React.SetStateAction<{page: number, maxPages: number}>>
    unselectFunction: () => void
}
export function DocTableFooter({ files, textSearch, dataPages, setDataPages, unselectFunction }: DocTableFooterProps) {
    return(
        files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ?
        <div className='flex justify-between w-full h-[61px] items-center px-[26px] mt-auto border-t border-t-secondary'>
            <button onClick={() => changePage({action: 'back', dataPages, setDataPages, unselectFunction})} className={`px-[14px] py-[5px] ${dataPages.page == 1 ? "cursor-not-allowed bg-[#D9D9D9] border border-[#9E9E9E] text-[#AAAAAA]" : "cursor-pointer bg-[#10B981] text-white"} rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Anterior</button>
            <p className="font-[500] text-[#686868] text-[18px] max-lsm:text-[12px]">{`Página ${dataPages.page} de ${dataPages.maxPages}`}</p>
            <button onClick={() => changePage({action: 'next', dataPages, setDataPages, unselectFunction})} className={`px-[14px] py-[5px] ${files.filter((file) => textSearch != "" ? file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length / 10 <= dataPages.page ? "bg-[#D9D9D9] border border-[#9E9E9E] text-[#AAAAAA]" : "cursor-pointer bg-[#10B981] text-white"} rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Proximo</button>
        </div> :
        <></>
    )
}