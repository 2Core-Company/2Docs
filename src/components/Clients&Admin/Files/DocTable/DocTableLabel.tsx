import { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableLabelProps extends HTMLAttributes<HTMLSpanElement> {
    children: string
}

export function DocTableLabel({ children, ...rest }: DocTableLabelProps) {
    return(
        <span {...rest} className={twMerge('text-[#9e9e9e] font-[500] text-[18px]', rest.className)}>{children}</span>
    )
}