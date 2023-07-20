import { InputHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableGlobalCheckboxProps extends InputHTMLAttributes<HTMLInputElement>{
}

export function DocTableGlobalCheckbox({...rest}: DocTableGlobalCheckboxProps) {
    const [handle, setHandle] = useState<boolean>(false);

    return(
        <div className="flex justify-center items-center border-[1px] border-r-[#9E9E9E] w-full h-full">
            <input {...rest} type="checkbox" aria-label="Checkbox Global" onChange={() => setHandle(!handle)} checked={handle} className={twMerge(`w-[20px] h-[20px] cursor-pointer ${handle ? "" : "appearance-none"} accent-gray-600 rounded border-[2px] border-[#666]`, rest.className)} />
        </div>
    )
}