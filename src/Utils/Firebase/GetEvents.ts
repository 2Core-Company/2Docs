import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { Dispatch } from "react";
import { db } from "../../../firebase";
import { Event } from "../../types/event";

interface PropsGetEventsUser {
  id_company:string
  id_user:string
  setEvents:Dispatch<React.SetStateAction<Event[] | undefined>>
}

export async function GetEventsUser({id_company, id_user, setEvents}:PropsGetEventsUser){
  const eventsConcluded:Event[] = []
  const events:Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), orderBy('dateSelected', 'asc'), orderBy('complete', 'desc'), limit(8));

  const querySnapshot:any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = {
      id:doc.data()?.id,
      id_user:doc.data()?.id_user,
      id_folder:doc.data()?.id_folder,
      id_enterprise:doc.data()?.id_enterprise,
      userName:doc.data()?.userName,
      name_enterprise:doc.data()?.name_enterprise,
      title:doc.data()?.title,
      observation:doc.data()?.observation,
      complete:doc.data()?.complete,
      dateSelected:doc.data()?.dateSelected
    }
    
    if(data.complete){
      eventsConcluded.push(data)
    } else {
      events.push(data)
    }
  });
  if(events[0]){
    setEvents(events.concat(eventsConcluded))
  } 
}



interface PropsGetEventLate {
  id_company:string
  id_user:string
  dateNowInSeconds:number
}

export async function GetEventLate({dateNowInSeconds, id_company, id_user}:PropsGetEventLate){
  const events:Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), where('dateSelected', '<', dateNowInSeconds),  limit(1));

  const querySnapshot:any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = {
      id:doc.data()?.id,
      id_user:doc.data()?.id_user,
      id_folder:doc.data()?.id_folder,
      id_enterprise:doc.data()?.id_enterprise,
      userName:doc.data()?.userName,
      name_enterprise:doc.data()?.name_enterprise,
      title:doc.data()?.title,
      observation:doc.data()?.observation,
      complete:doc.data()?.complete,
      dateSelected:doc.data()?.dateSelected
    }
    
    events.push(data)
  });
  return events
}