import Event from './event';
import StatusOfAccount from './statusOfAccount';
import RecentsFiles from './recentsFiles';
import UploadFast from './UploadFast/uploadFast';




function ComponentHome () {
  
  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen px-[50px] max-md:px-[10px] flex flex-col text-black dark:text-white">
      <div className='mt-[50px] pb-[20px]'>
        <div className='flex items-center'>
          <p  className=' font-poiretOne text-[40px]'>Home</p>
          <StatusOfAccount />
        </div>
        <div className='flex flex-wrap justify-between gap-x-[20px] ml-[20px] max-lsm:ml-[0px]'>
          <Event />
          <div className='mt-[20px] lg:h-[720px] flex flex-col justify-between'>
            <RecentsFiles />
            <UploadFast />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentHome 