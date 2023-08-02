import { ReactNode } from "react"

interface DocTableIconProps{
    children: ReactNode
}

export function DocTableIcon({ children }: DocTableIconProps) {
    return(
        <>
            { children }
        </>
    )
}