import { ButtonHTMLAttributes } from "react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface DocTableFilterProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    label: string
    arrow?: boolean
    active?: boolean
}

export function DocTableFilter({label, arrow = false, active: active = false, ...rest}: DocTableFilterProps) {
    return(
        <button {...rest} className={twMerge("flex items-center cursor-pointer gap-[10px] py-[18px]", rest.className)}>
            <p className="font-[400] text-[18px]">{ label }</p>
            { arrow ? <Image alt="Imagem de uma flecha" width={13} height={8} className={`${active ? "rotate-180" : ""} transition-all duration-300`} src={"/icons/arrowFilter.svg"}/> : <></>}
        </button>
    )
}