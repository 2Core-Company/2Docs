import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableDatasProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableDatas({ children, className }: DocTableDatasProps) {
    return(
        <div className={twMerge("flex items-center", className)}>
            { children }
        </div>
    )
}