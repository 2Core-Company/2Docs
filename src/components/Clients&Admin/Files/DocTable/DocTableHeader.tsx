import { ReactNode } from "react"

interface DocTableHeaderProps {
    children: ReactNode
}

export function DocTableHeader({ children }: DocTableHeaderProps) {
    return(
        <div className="my-[11px] flex items-center mx-[22px] max-sm:mt-[5px] max-sm:mx-[5px]">
            { children }
        </div>
    )
}