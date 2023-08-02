import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableDataProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableData({ children, className }: DocTableDataProps) {
    return(
        <div className={twMerge("flex items-center", className)}>
            { children }
        </div>
    )
}