import { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function DocTableHeader({ children, ...rest }: DocTableHeaderProps) {
    return(
        <div {...rest} className={twMerge('py-[16px] flex items-center px-[22px] max-sm:mt-[5px] max-sm:mx-[5px]', rest.className)}>
            { children }
        </div>
    )
}