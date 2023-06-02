'use client'
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import calendarBuild from "./Calendarbuild";
import { TriangleLeftIcon, TriangleRightIcon } from '@radix-ui/react-icons';
import { collection, getDocs, query, where} from "firebase/firestore";
import { db } from "../../../../firebase";
import { adminContext } from "../../../app/Context/contextAdmin";
import Exclamation from '../../../../public/icons/exclamation.svg'
import Image from "next/image";
import TableEvents from "./tableEvents";
import { usePathname } from "next/navigation";
import { Event } from "../../../types/event";
import { userContext } from "../../../app/Context/contextUser";

export default function Calendar() {
  const { dataAdmin } = useContext(adminContext)
  const { dataUser } = useContext(userContext)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dateSelected, setDateSelected] = useState([]);
  const [indexMonth, setIndexMonth] = useState(new Date().getMonth())
  const [events, setEvents] = useState<Event[]>([])
  const [eventsThatDay, setEventsThatDay] = useState()
  const url:string | null  = usePathname()
  const admin = url?.includes('Admin') ? true : false
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

  useEffect(() =>{
    if(dataAdmin.id != ''){
      GetEvents(dataAdmin)
    } else if (dataUser.id != ''){
      GetEvents(dataUser)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dataAdmin, dataUser])

  //Pegando eventos
  async function GetEvents(data){
    const events:Event[] = []
    var q 
    if(data.permission > 0){
      q = query(collection(db, "companies", data.id_company, "events"));
    } else {
      q = query(collection(db, "companies", data.id_company, "events"), where('id_user', '==', data.id));
    }

    const querySnapshot:any = await getDocs(q);
    querySnapshot.forEach((doc) => {
      events.push({
        id:doc.data()?.id,
        id_user:doc.data()?.id_user,
        userName:doc.data()?.userName,
        enterprise:doc.data()?.enterprise,
        title:doc.data()?.title,
        observation:doc.data()?.observation,
        complete:doc.data()?.complete,
        dateSelected:doc.data()?.dateSelected,
        viewed:doc.data()?.viewed
      })
    });
    setEvents(events)
  }

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
    <div className="text-black flex flex-col pb-[15px]">
      {eventsThatDay ? <TableEvents eventsThatDay={eventsThatDay} setEventsThatDay={setEventsThatDay} events={events} admin={admin}/> : <></>}
      <div className="ml-[100px] max-lg:ml-[0px] flex flex-col">
        <p className="font-poiretOne text-[40px] ml-[10px] self-center">Calendário</p>
        <div className="flex">
          <div className="w-full flex justify-between flex-wrap">
            <MonthCard
              month={month[indexMonth]}
              currentYear={currentYear}
              dateSelected={dateSelected}
              setDateSelected={setDateSelected}
              setCurrentYear={setCurrentYear}
              setIndexMonth={setIndexMonth}
              indexMonth={indexMonth}
              events={events}
              setEventsThatDay={setEventsThatDay}
            />
          </div>
        </div>
      </div> 
    </div>
  );
}

function MonthCard(props) {
  const [value, setValue] = useState(moment().locale("pt").month(props.month).year(props.currentYear));
  const [calendar, setCalendar] = useState([]);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Quin", "Sex", "Sab"];
  

  function ChangeMonth(action){
    if(action === 'before'){
      if(props.indexMonth === 0){
        props.setIndexMonth(11),
        props.setCurrentYear(props.currentYear - 1)
        setCalendar(calendarBuild(value))
        return 
      }
      return props.setIndexMonth(props.indexMonth - 1)
    }

    if(action === 'after'){
      if(props.indexMonth === 11){
        props.setIndexMonth(0),
        props.setCurrentYear(props.currentYear + 1)
        return 
      }
      return props.setIndexMonth(props.indexMonth + 1)
    }
  }

  useEffect(() => {
    setValue(value.month(props.month));
    setCalendar(calendarBuild(value));
  }, [value, props.month]);


  return (
    <div className="w-full flex flex-col mx-[10px]">
      <div className="flex items-center justify-center ml-[10px]">
        <p className="text-[25px]">{props.currentYear} - {value.format("MMMM")}</p>
        <button onClick={() => ChangeMonth('before')}>
          <TriangleLeftIcon className="w-[50px] h-[25px] text-neutral-400" />
        </button>
        <div className="w-[10px] h-[10px] rounded-full bg-neutral-400"></div>
        <button onClick={() => ChangeMonth('after')}>
          <TriangleRightIcon className="w-[50px] h-[25px] text-neutral-400" />
        </button>
      </div>

        <div className="w-full flex justify-between gap-x-[50px] max-lg:gap-x-[10px] mt-[10px]">
          {weekDays.map((value, index) => (
            <div className="w-full text-center font-[600]" key={index}>
              {value}
            </div>
          ))}
        </div>

        {calendar.map((week:any) => (
          <div className="w-full flex justify-between gap-x-[30px] max-lg:gap-x-[10px]" key={week}>
            {week.map((day) => (
              <DayCard
                key={day._d.getTime() + props.month}
                dataDay={day}
                month={props.month}
                year={props.currentYear}
                dateSelected={props.dateSelected}
                events={props.events}
                setEventsThatDay={props.setEventsThatDay}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

function DayCard({dataDay, month, year, dateSelected, events, setEventsThatDay}) { 
  const [state, setState] = useState("");
  const day = dataDay._d;
  var eventsDay = filterStatus()

  useEffect(() => {
    const currentMonth = new Date(month + ",01," + year);
    const dateNow = new Date()
    const AllDates = new Date(day)
    AllDates.setHours(23);
    AllDates.setMinutes(59);
    const result = (AllDates.getTime() - dateNow.getTime())

    if (day.getMonth() !== currentMonth.getMonth()) {
      setState("nonPertenceMonth");
      return;
    }
    
    if(result < 0){
      setState("alreadyPassed");
      return;
    }
  }, [day, month, year, dateSelected]);

  function filterStatus(){
    var allEvents = events.filter(event => day == event.dateSelected)
    var number = 0
    allEvents.sort(function (x, y){
      number = number + 1
        let a = x.complete
        let b = y.complete
        return a == b ? 0 : a > b ? 1 : -1
    })
    return allEvents
  }

  return (
    <div onClick={() => {eventsDay.length > 0 ? setEventsThatDay(eventsDay) : ''}} className={`w-full h-[110px] max-md:h-[80px] max-lsm:h-[70px] flex flex-col  border-neutral-300 border-[1px] mt-[10px] rounded-[8px]  ${eventsDay.length > 0 ? 'cursor-pointer ' : ''} ${state == 'nonPertenceMonth' ?  'text-neutral-400 bg-neutral-200'  : state === 'alreadyPassed' ? 'bg-[#e1e1e1] text-[#c4c2c2] border-neutral-500' : ''} `}>
      <p className="text-[23px] max-md:text-[20px] text-center">{dataDay.format("DD").toString()}</p>
      {eventsDay?.map((event, index) => {
        if(index > 2){
          return ''
        }
        const diffInMs   = new Date().getTime() - new Date(event.dateSelected).getTime()
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) 
        
        var style 
        if(event.complete){
          style = 'bg-[#2ed903]'
        } else if(diffInDays <= 1){
          style = 'bg-[#c5c4c4]'
        } else if( 5 >= diffInDays ) {
          style = 'bg-[#f8dc03]'
        } else if(5 < diffInDays){
          style = 'bg-red'
        }

        return (
          <div key={index}>
            {index == 0 ?
              <div key={index + 1} className="hidden max-md:flex items-center justify-center h-full w-full">
                <div className="border-[#fa8d00] bg-[rgba(250,141,0,0.3)] border-[3px] rounded-full p-[3px]">
                  <Image src={Exclamation} alt="Exclamação" width={30} height={30} className="msx-md:w-[25px] max-lsm:w-[20px]"/>
                </div>
              </div>
            : <></>}

            {day == event.dateSelected ?
              <div key={index + 2} className="relative flex items-center">
                <div className={`ml-[3px] w-[8px] h-[8px] rounded-full max-md:hidden ${style} `}/>
                <p  className="w-[150px] max-2xl:w-[110px] max-xl:w-[80px] max-md:hidden text-[16px] text-black ml-[10px] overflow-hidden text-ellipsis">{event.title}</p>
              </div>
            : <></>}
          </div>
        )
      })}
    </div>
  );
}