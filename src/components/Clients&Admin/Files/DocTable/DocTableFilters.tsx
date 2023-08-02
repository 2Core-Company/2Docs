import { ReactNode } from "react"

interface DocTableFilters {
    children: ReactNode
}

export function DocTableFilters({ children }: DocTableFilters) {
    return(
        { children }
    )
}