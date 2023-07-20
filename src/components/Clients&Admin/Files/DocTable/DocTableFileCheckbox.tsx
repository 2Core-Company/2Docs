import { useState, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableFileCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {

}

export function DocTableFileCheckbox({ ...rest }: DocTableFileCheckboxProps) {
    const [handle, setHandle] = useState<boolean>(false);

    return(
        <div className="flex justify-center items-center w-full h-full">
            <input {...rest} aria-label="Checkbox Arquivo" type="checkbox" checked={handle} onChange={() => setHandle(!handle)} className={twMerge(`w-[20px] h-[20px] cursor-pointer ${handle ? "" : "appearance-none"} accent-gray-600 rounded border-[1px] border-[#666]`, rest.className)}/>
        </div>
    )
}