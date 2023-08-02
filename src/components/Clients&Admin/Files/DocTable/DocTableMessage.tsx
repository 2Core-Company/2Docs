import Image, { ImageProps } from "next/image";
import MessageIcon from "public/icons/messageNoNotif.svg";
import MessageWithNotifIcon from "public/icons/messageNotif.svg";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableMessageProps extends HTMLAttributes<HTMLDivElement> {
    from: 'admin' | 'user'
    admin: boolean
    notification?: boolean
    iconClassName?: string | undefined;
}

export function DocTableMessage({from, admin, notification = false, iconClassName, ...rest }: DocTableMessageProps) {
    if(notification && (admin && from === 'user' || admin === false && from === 'admin')) {
        return(
            <div {...rest}>
                <Image className={twMerge("", iconClassName)} src={MessageWithNotifIcon} alt="Ícone de Mensagem com Notificação" width={32} height={32}/>
            </div>
        )
    } else {
        return(
            <div {...rest}>
                <Image className={twMerge("", iconClassName)} src={MessageIcon} alt="Ícone de Mensagem sem Notificação" width={32} height={32}/>
            </div>
        )
    }
}