import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface DocTableSearchProps extends InputHTMLAttributes<HTMLInputElement>{
    
}

export function DocTableSearch({ ...rest }: DocTableSearchProps) {
    return(
        <div className="flex gap-[10px] items-center">
            <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] text-[#686868]" />
            <input type="text" className='placeholder:text-[#AAAAAA] w-[300px] text-black dark:text-white max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500' {...rest} />
        </div>
    )
}