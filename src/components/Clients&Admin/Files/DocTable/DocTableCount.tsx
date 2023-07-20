interface DocTableCountProps {
    count: number
}

export function DocTableCount({ count }: DocTableCountProps) {
    return(        
        <p className='mr-[30px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] text-[#AAAAAA]'><span className="text-[#686868]">{count}</span> Documentos</p>
    )
}