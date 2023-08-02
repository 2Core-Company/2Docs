import { ButtonHTMLAttributes } from "react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface DocTableFilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    arrow?: boolean
    active?: 'asc' | 'desc'
}

export function DocTableFilter({ label, arrow = false, active, ...rest }: DocTableFilterProps) {
    return (
        <div className="w-full items-center flex">
            <button {...rest} className={twMerge("w-full flex items-center cursor-pointer gap-[10px] my-[18px] text-[18px]", rest.className)}>
                <p className="font-[400]">{label}</p>
                {arrow && <Image alt="Imagem de uma flecha" width={13} height={8} className={`${active === 'desc' ? "rotate-180" : ""} transition-all duration-300`} src={"/icons/arrowFilter.svg"} />}
            </button>
        </div>

    )
}