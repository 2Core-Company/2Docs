import { FormatDate, FormatHours } from "@/src/Utils/Other/FormatDate";
import * as HoverCard from "@radix-ui/react-hover-card";

interface DocTableViewedProps {
    viewedDate: number | null
    hoverModal?: boolean
}

export function DocTableViewed({ viewedDate, hoverModal = true }: DocTableViewedProps) {
    if(hoverModal) {
        if(viewedDate) {
            return(
                <HoverCard.Root>
                    <HoverCard.Trigger asChild>
                    <div className="font-[500] text-[18px] py-[3px] px-[11px] max-sm:text-[12px] bg-[#1BA128]/30 border-[1px] border-[#087E14] text-[#087E14] rounded-[100px] text-center max-sm:hidden cursor-default">
                        Visualizado
                    </div>
                    </HoverCard.Trigger>
                    <HoverCard.Portal>
                    <HoverCard.Content
                        className="text-black data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[250px] rounded-md bg-white p-2 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
                        sideOffset={5}
                    >
                        <p className="text-[14px] text-center cursor-default">Visualizado em:<br/>{FormatDate(viewedDate)} {FormatHours(viewedDate)}</p>
                        <HoverCard.Arrow className="fill-white" />
                    </HoverCard.Content>
                    </HoverCard.Portal>
                </HoverCard.Root>
            )
        } else {
            return(
                <HoverCard.Root>
                    <HoverCard.Trigger asChild>
                    <div className="font-[500] text-[18px] py-[3px] px-[11px] max-sm:text-[12px] bg-[#D9D9D9] border-[1px] border-[#9E9E9E] text-[#aaa] rounded-[100px] text-center max-sm:hidden cursor-default">
                        Visualizado
                    </div>
                    </HoverCard.Trigger>
                    <HoverCard.Portal>
                    <HoverCard.Content
                        className="text-black data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[250px] rounded-md bg-white p-2 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
                        sideOffset={5}
                    >
                        <p className="text-[14px] text-center cursor-default">Este arquivo ainda não foi visualizado.</p>
                        <HoverCard.Arrow className="fill-white" />
                    </HoverCard.Content>
                    </HoverCard.Portal>
                </HoverCard.Root>
            )
        }
    } else {
        return <></>
    }
}