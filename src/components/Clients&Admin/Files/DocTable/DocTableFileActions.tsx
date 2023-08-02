import { HTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableFileActionsProps extends HTMLAttributes<HTMLDivElement>{
    children: ReactNode
}

export function DocTableFileActions({ children, ...rest }: DocTableFileActionsProps) {
    return(
        <div className={twMerge("flex justify-center items-center gap-2", rest.className)}>
            {children}
        </div>
    )
}