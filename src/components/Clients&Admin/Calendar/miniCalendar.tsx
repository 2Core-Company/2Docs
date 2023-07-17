import { Dispatch, useContext, useEffect, useState } from "react";
import moment from "moment";
import calendarBuild from "./Calendarbuild";
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Event } from "../../../types/event";
import { adminContext } from "../../../app/Context/contextAdmin";

interface Props {
    events: Event[]
    AfterSelectDate: Function
    setDataMonth: Dispatch<React.SetStateAction<{ firstDay: number; lastDay: number; }>>
}

export default function Calendar({ events, AfterSelectDate, setDataMonth }: Props) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [indexMonth, setIndexMonth] = useState(new Date().getMonth())
    const [dateSelected, setDateSelected] = useState<Date>(new Date(new Date().setHours(0,0,0,0)))
    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthBr = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    moment.updateLocale("pt", { months: monthBr });
    const dateNow = new Date().setHours(0, 0, 0, 0)
    const [calendar, setCalendar] = useState(calendarBuild(moment().locale("pt").month(month[indexMonth]).year(currentYear)));


    function ChangeMonth(action) {
        if (action === 'before') {
            if (indexMonth === 0) {
                const newMoment = moment().locale("pt").month(month[11]).year(currentYear - 1)
                setIndexMonth(11),
                    setCurrentYear(currentYear - 1)
                setCalendar(calendarBuild(newMoment))
                setDataMonth({
                    firstDay: newMoment.clone().startOf("month").valueOf(),
                    lastDay: newMoment.clone().endOf("month").valueOf()
                })
                return
            }
            const newMoment = moment().locale("pt").month(indexMonth - 1).year(currentYear)
            setCalendar(calendarBuild(newMoment))
            setDataMonth({
                firstDay: newMoment.clone().startOf("month").valueOf(),
                lastDay: newMoment.clone().endOf("month").valueOf()
            })
            return setIndexMonth(indexMonth - 1)
        }

        if (action === 'after') {
            if (indexMonth === 11) {
                const newMoment = moment().locale("pt").month(month[0]).year(currentYear + 1)
                setIndexMonth(0),
                    setCurrentYear(currentYear + 1)
                setCalendar(calendarBuild(newMoment))
                setDataMonth({
                    firstDay: newMoment.clone().startOf("month").valueOf(),
                    lastDay: newMoment.clone().endOf("month").valueOf()
                })
                return
            }
            const newMoment = moment().locale("pt").month(indexMonth + 1).year(currentYear)
            setCalendar(calendarBuild(moment().locale("pt").month(indexMonth + 1).year(currentYear)))
            setDataMonth({
                firstDay: newMoment.clone().startOf("month").valueOf(),
                lastDay: newMoment.clone().endOf("month").valueOf()
            })
            return setIndexMonth(indexMonth + 1)
        }
    }

    function SelectDate(day) {
        setDateSelected(day._d)
        AfterSelectDate(day._d)
    }


    return (
        <div className="w-[500px] max-sm:w-[390px] max-lsm:w-[330px] min-h-[350px] bg-primary p-[30px] max-sm:p-[20px] max-lsm:p-[15px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] rounded-[15px] select-none">
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <p className="text-[25px] max-sm:text-[23px]">{monthBr[indexMonth]} de {currentYear}</p>
                    <div className="flex items-center gap-[15px]">
                        <button onClick={() => ChangeMonth('before')}>
                            <ChevronLeftIcon className="w-[25px] h-[25px] text-[#686868]" />
                        </button>

                        <button onClick={() => ChangeMonth('after')}>
                            <ChevronRightIcon className="w-[25px] h-[25px] text-[#686868]" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between gap-x-[20px] max-sm:gap-x-[10px] max-lsm:gap-x-[5px] mt-[20px] text-left">
                    {weekDays.map((value, index) => (
                        <div className="text-[22px] max-sm:text-[21px] max-lsm:text-[20px] w-[40px] text-center text-[#686868]" key={index}>
                            {value}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-y-[10px] max-sm:gap-y-[5px] max-lsm::gap-y-[0px] ">
                    {calendar.map((week: any) => (
                        <div className="flex justify-between gap-x-[20px] max-sm:gap-x-[10px] max-lsm:gap-x-[5px]" key={week}>
                            {week.map((day, index) => {
                                if (indexMonth === day._d.getMonth()) {
                                    const qtdEventsThisDay = events.filter((event) => event.dateStarted === day._d.getTime())

                                    return (
                                        <button onClick={() => SelectDate(day)} key={index} className={`flex items-center justify-center w-[40px] h-[40px] max-sm:w-[35px] max-sm:h-[35px]  rounded-full relative ${day._d.getTime() === dateSelected?.getTime() ? 'bg-[#10B981] text-white border-[0px]' : ''}  ${dateNow === day._d.getTime() ? 'border-black border-[1px]' : ''}`}>
                                            <p className={`w-full text-[23px] max-sm:text-[21px] max-lsm:text-[20px] max-md:text-[20px] text-center `}>{day.format("DD").toString()}</p>
                                            {qtdEventsThisDay.length > 0 && 
                                                <div className={`w-[20px] h-[20px]  flex justify-center items-center absolute rounded-full top-[-6px] right-[-12px] ${day._d.getTime() === dateSelected?.getTime() ? 'bg-[#2E6483]' : 'bg-[rgba(46,100,131,0.50)]'}`}>
                                                    <p className={`text-[12px] font-[500] truncate text-white text-center `}>
                                                        {qtdEventsThisDay.length}
                                                    </p>
                                                </div>
                                            }
                                        </button>
                                    )
                                } else {
                                    return (
                                        <div key={index} className='w-[40px] h-[40px]'>

                                        </div>
                                    )
                                }
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}





