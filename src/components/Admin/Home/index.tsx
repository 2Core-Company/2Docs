import Storage from "./storage"
import EventsActives from "./eventsActives"
import Notification from '../../Clients&Admin/Notification'

function ComponentHome() {

  return (
    <div className="bg-primary dark:bg-dprimary text-black dark:text-white">
      <p className=' font-poiretOne text-[40px] mt-[40px] mb-[30px]'>Home</p>
      <div className="flex gap-x-[150px] ml-[20px] max-sm:ml-[10px] flex-wrap">
        <Storage />
        <EventsActives />
      </div>
    </div>
  )
}

export default ComponentHome 