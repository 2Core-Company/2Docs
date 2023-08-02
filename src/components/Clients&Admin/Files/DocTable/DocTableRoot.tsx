import { ReactNode, ComponentProps } from "react"
import { twMerge } from "tailwind-merge";

interface DocTableRootProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableRoot({ children, className }: DocTableRootProps) {
    return(
        <div className={twMerge('min-h-[600px] relative border-[1px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px] flex flex-col', className)}>
            {children}
        </div>
    )
}