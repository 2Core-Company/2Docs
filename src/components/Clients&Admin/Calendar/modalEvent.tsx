import { useEffect, useState } from "react";
import moment from "moment";
import calendarBuild from "./calendarbuild";
import { TriangleLeftIcon, TriangleRightIcon } from '@radix-ui/react-icons';
import CreateEvent from "./createEvent";
import { Enterprise } from '../../../types/interfaces'

interface Props{
  id:string
  enterprises:Enterprise[]
  userName:string
  email:string
  setModalEvent:Function
}

export default function ModalEvent({email, id, enterprises, userName, setModalEvent}:Props) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dateSelected, setDateSelected] = useState<string>();
  const [indexMonth, setIndexMonth] = useState(new Date().getMonth())
  
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  moment.updateLocale("pt", {
    months: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  });

  return (
    <div className="fixed bg-black/30 backdrop-blur-sm w-screen h-screen bottom-0 z-50  text-black flex flex-col items-center justify-center left-0">
      <div className="max-w-[600px] flex flex-col items-center bg-primary pb-[10px] rounded-[8px] relative">
        <div onClick={() => setModalEvent(false)} className="cursor-pointer w-[4px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[4px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[15px] top-[5px]"></div>
        {dateSelected ? 
          <CreateEvent email={email} setDateSelected={setDateSelected} dateSelected={dateSelected} id={id} enterprises={enterprises} userName={userName} setModalEvent={setModalEvent} />
        : 
          <>
            <p className="font-poiretOne text-[40px]">Calendário</p>
            <div className="flex">
                <div className="w-full flex justify-between">
                    <MonthCard
                      month={month[indexMonth]}
                      currentYear={currentYear}
                      dateSelected={dateSelected}
                      setDateSelected={setDateSelected}
                      setCurrentYear={setCurrentYear}
                      setIndexMonth={setIndexMonth}
                      indexMonth={indexMonth}
                    />
                </div>
            </div>
          </>
        }
      </div> 
    </div>
  );
}

interface PropsMonth{
    month:string
    indexMonth:number
    currentYear:number
    dateSelected:string
    setIndexMonth:Function
    setCurrentYear:Function
    setDateSelected:Function
}

function MonthCard({month, indexMonth, currentYear, dateSelected, setDateSelected, setIndexMonth, setCurrentYear}:PropsMonth) {
  const [value, setValue] = useState(moment().locale("pt").month(month).year(currentYear));
  const [calendar, setCalendar] = useState([]);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Quin", "Sex", "Sab"];

  function ChangeMonth(action){
    if(action === 'before'){
      if(indexMonth === 0){
        setIndexMonth(11),
        setCurrentYear(currentYear - 1)
        setCalendar(calendarBuild(value))
        return 
      }
      return setIndexMonth(indexMonth - 1)
    }

    if(action === 'after'){
      if(indexMonth === 11){
        setIndexMonth(0),
        setCurrentYear(currentYear + 1)
        return 
      }
      return setIndexMonth(indexMonth + 1)
    }
  }

  useEffect(() => {
    setValue(value.month(month));
    setCalendar(calendarBuild(value));
  }, [value, month]);


  return (
    <div className="w-full flex flex-col mx-[10px]">
      <div className="flex items-center justify-center ml-[10px]">
        <p className="text-[25px]">{currentYear} - {value.format("MMMM")}</p>
        <button onClick={() => ChangeMonth('before')}>
          <TriangleLeftIcon className="w-[50px] h-[25px] text-neutral-400 cursor-pointer" />
        </button>
        <div className="w-[10px] h-[10px] rounded-full bg-neutral-400"></div>
        <button onClick={() => ChangeMonth('after')}>
          <TriangleRightIcon className="w-[50px] h-[25px] text-neutral-400 cursor-pointer" />
        </button>
      </div>

        <div className="w-full flex justify-between gap-x-[50px] max-lg:gap-x-[15px] mt-[10px]">
          {weekDays.map((value, index) => (
            <div className="w-full text-center font-[600]" key={index}>
              {value}
            </div>
          ))}
        </div>

        {calendar.map((week) => (
          <div className="w-full flex justify-between gap-x-[30px] max-lg:gap-x-[15px]" key={week}>
            {week.map((day) => (
              <DayCard
                key={day._d.getTime() + month}
                day={day}
                month={month}
                year={currentYear}
                dateSelected={dateSelected}
                setDateSelected={setDateSelected}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

function DayCard(props) {
  const [state, setState] = useState("");
  const day = props.day._d;
  
  useEffect(() => {
    const DateNow = new Date()
    const AllDates = new Date(day)
    const result = (DateNow.getTime() - AllDates.getTime())
    const currentMonth = new Date(props.month + ",01," + props.year);

    if (day.getMonth() !== currentMonth.getMonth()) {
      setState("nonPertenceMonth");
      return;
    }

    if(result > 0){
      setState("nonPertenceMonth");
      return;
    }
  }, [day, props.month, props.year, props.dateSelected]);

  const handleClickDate = () => {
    props.setDateSelected(props.day._d + "")
  };

  return (
    <div onClick={() => state == 'nonPertenceMonth' ? "" : handleClickDate()} className={`w-[50px] max-sm:w-[35px] h-[50px] max-sm:h-[35px] p-[3px] flex justify-center items-center border-neutral-300 border-[1px] mt-[5px] rounded-full  ${state == 'nonPertenceMonth' ?  'text-neutral-400 bg-neutral-200 opacity-50'  : 'cursor-pointer'} `}>
      <p className="text-[25px] max-sm:text-[20px]">{props.day.format("DD").toString()}</p>
    </div>
  );
}