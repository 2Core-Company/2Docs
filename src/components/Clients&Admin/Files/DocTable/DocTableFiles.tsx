import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DocTableFilesProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableFiles({ children, className }: DocTableFilesProps) {
    return(
        <div className={twMerge("", className)}>
            { children }
        </div>
    )
}