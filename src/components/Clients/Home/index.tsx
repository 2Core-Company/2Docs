import Event from './event';
import StatusOfAccount from './statusOfAccount';
import RecentsFiles from './recentsFiles';
import UploadFast from './UploadFast/uploadFast';

function ComponentHome () {
  
  return (
    <div className="bg-primary dark:bg-dprimary text-black dark:text-white">
      <div className='flex items-center mt-[40px]'>
        <p  className=' font-poiretOne text-[40px]'>Home</p>
        <StatusOfAccount />
      </div>
      <div className='flex flex-wrap gap-x-[150px] ml-[20px] max-sm:ml-[10px] mb-[20px]'>
        <Event />
        <div className='mt-[20px] flex flex-col justify-between'>
          <RecentsFiles />
          <UploadFast />
        </div>
      </div>
    </div>
  )
}

export default ComponentHome 
