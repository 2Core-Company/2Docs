import { ButtonHTMLAttributes, ComponentProps, HTMLAttributes, ReactNode } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from "tailwind-merge";

interface DocTableOptionsItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    dropdownClassName?: ComponentProps<'div'>['className']
}

export function DocTableOptionsItem({ children, dropdownClassName, ...rest }: DocTableOptionsItemProps) {
    return(
        <DropdownMenu.Item {...rest.onClick} className={twMerge("group cursor-pointer hover:outline-none hover:bg-[#10B981] px-[3px] rounded", dropdownClassName)}>
            <button {...rest} className='w-full flex items-center gap-[4px] px-[7px] py-[2px]'>
                { children }
            </button>
        </DropdownMenu.Item>
    )
}