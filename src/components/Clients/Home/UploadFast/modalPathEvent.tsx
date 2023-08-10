import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Dispatch, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { companyContext } from '../../../../app/Context/contextCompany'
import { loadingContext } from '../../../../app/Context/contextLoading'
import { userContext } from '../../../../app/Context/contextUser'
import { GetEventsOpenToUser } from '../../../../Utils/Firebase/Events/GetEvents'
import { UploadFiles } from '../../../Clients&Admin/Files/UploadFiles'
import { UpdateStatusDelivered } from '../../../../Utils/Firebase/Events/UpdateStatusDelivered'

interface PropsModalPathFolder {
    files:any
    setPathSelected:Dispatch<React.SetStateAction<string | undefined>>
    setFiles:Function
}

interface options {
    value:eventSelected, 
    label:string
}

interface eventSelected {
    id_enterprise:string, 
    id_folder:string, 
    id_event:string
    eventDelivered:boolean
}

export default function ModalPathEvent({setPathSelected, files, setFiles}:PropsModalPathFolder){
    const { dataUser } = useContext(userContext)
    const { dataCompany } = useContext(companyContext)
    const { loading, setLoading } = useContext(loadingContext)
    const [options, setOptions] = useState<options[]>()
    const [eventSelected, setEventSelected] = useState<eventSelected>()

    useEffect(() => {
        GetEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function GetEvents(){
        const result = await GetEventsOpenToUser({id_company: dataCompany.id, id_user:dataUser.id})
        const optionsHere:options[] = []

        if(result){
            for(const event of result){
                const data: options = {
                    value:{
                        id_enterprise:event.id_enterprise, 
                        id_folder:event.id_folder, 
                        id_event:event.id, 
                        eventDelivered:event.delivered
                    },
                    label:event.title
                }
                optionsHere.push(data)
            }
            setOptions(optionsHere)
        }

    }

    async function UploadFilesSelecteds(){
        if(eventSelected){
            setLoading(true)
            const result = await UploadFiles({
                id_company:dataCompany.id,
                id_user:dataUser.id,
                id_enterprise:eventSelected.id_enterprise, 
                id_folder:eventSelected.id_folder, 
                id_event:eventSelected.id_event,
                files, 
                from:'user',
                maxSize:dataCompany.maxSize
            })


            if(result?.status && eventSelected.eventDelivered === false){
                const result = await UpdateStatusDelivered({id_company:dataCompany.id, id_event:eventSelected.id_event, status:true})
            }

            setLoading(false)
            setFiles()
        } else {
            toast.error('Selecione uma evento!')
        }
    }

    const NoOptionsMessage = () => {
        return <p className='text-center py-[10px]'>Não encontrado.</p>;
    };


    return(
        <>  
            <div className='mt-[10px] flex items-center ml-[25px] max-sm:ml-[10px]'>
                <button>
                    <ArrowLeftIcon onClick={() => setPathSelected(undefined)} className='text-[#9E9E9E] w-[25px] h-[25px] mr-[10px] cursor-pointer' />
                </button>

                <h4 className="font-poppins text-[26px] max-sm:text-[22px] after:w-[40px] after:h-[3px] after:block after:bg-hilight after:rounded-full after:ml-[3px] after:mt-[-3px] max-sm:after:mt-[-2px]">
                    Upload Rápido
                </h4>

                <p className='ml-[5px] text-[14px] max-sm:text-[12px] text-[#9E9E9E] underline'>Para um evento</p>
            </div>

            <div className='px-[60px] max-sm:px-[30px]'>
                <p className='mt-[20px] text-[20px] max-sm:text-[18px]'>Selecione o evento</p>
                <Select
                placeholder='Selecionar...'
                components={{ NoOptionsMessage }}
                isDisabled={loading}
                options={options} 
                isClearable={true}
                onChange={(e) => setEventSelected(e?.value)} 
                className='text-[20px] max-sm:text-[18px] mt-[10px] text-[#686868]' 
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary25: 'rgba(16,185,129,.20)',
                      primary: 'rgba(16,185,129,.50)',
                    },
                  })}
                />
            </div>
            
            <div className='bg-[#D9D9D9] mt-[25px] border-t-[#AAAAAA] border-t-[1px] px-[30px] max-sm:px-[15px] py-[14px] flex justify-between font-[500] rounded-b-[15px]'>
                <button disabled={loading} onClick={() => setPathSelected(undefined)} className='text-[#5C5C5C] border-[1px] border-[rgba(104,104,104,0.70)] rounded-[8px] px-[14px] py-[9px] hover:bg-[#b9b9b9] duration-100'>
                    Cancelar
                </button>

                <button disabled={loading} onClick={() => UploadFilesSelecteds()} className='bg-[rgba(16,185,129,0.30)] text-[#117856] border-[1px] border-[#10B981] rounded-[8px] px-[14px] py-[9px] hover:bg-[rgba(16,185,129,0.50)] duration-100'>
                    Confirmar
                </button>
            </div>
        </>
    )
}
