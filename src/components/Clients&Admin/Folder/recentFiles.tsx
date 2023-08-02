import { DownloadIcon } from '@radix-ui/react-icons';
import React from 'react'
import Image from 'next/image';
import Files from '../../Admin/Files';
import DownloadsFile from '../Files/downloadFiles';

function RecentFiles({recentFiles}:{recentFiles:Files[]}) {
  return (
    <div>
        {recentFiles.length > 0 && <p className="font-poiretOne text-[40px] mt-[30px]"> Arquivos Recentes </p>}
        {recentFiles.length > 0 && 
        <div className="flex flex-wrap mt-[10px] max-sm:mt-[0px]">
          {recentFiles.map((file) => {
            return (
              <div key={file.id} className="group  w-[200px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 lg:hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] dark:hover:shadow-[#414141] relative">
                <button onClick={() => DownloadsFile({ selectFiles: [file], from: "admin", id_folder: file.id_folder })}  className="text-[#AAAAAA] absolute top-[10px] right-[10px] group-hover:block cursor-pointer lg:hidden">
                  <DownloadIcon height={25} width={25} className='max-md:w-[20px] max-md:h-[20px]'/>
                </button>
                <Image src={`/icons/${file.type}.svg`} alt="Imagem de um arquivo" width={80} height={80} className="max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]" />
                <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
                  {file.name}
                </p>
              </div>
            );
          })}
        </div>
      }
    </div>
  )
}

export default RecentFiles