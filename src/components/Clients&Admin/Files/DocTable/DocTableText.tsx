import { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableTextProps extends HTMLAttributes<HTMLSpanElement> {
    children: string
}

export function DocTableText({ children, ...rest}: DocTableTextProps) {
    return(
        <span {...rest} className={twMerge("overflow-hidden whitespace-nowrap text-ellipsis text-[#686868] font-[500] text-[18px]", rest.className)}>{ children }</span>
    )
}