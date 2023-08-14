import { HTMLAttributes, ReactNode } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DocTableOptionsProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode    
}

export function DocTableOptions({ children, ...rest }: DocTableOptionsProps) {
    return(
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex gap-[3px] cursor-pointer" aria-label="Customize options">
                    <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
                    <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
                    <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content {...rest} align="end" alignOffset={-25} className="bg-primary text-black rounded-[4px] flex flex-col gap-[3px] drop-shadow-[0_0px_10px_rgba(0,0,0,0.20)]" sideOffset={5}>
                    { children }
                    <DropdownMenu.Arrow className="fill-primary"/>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}