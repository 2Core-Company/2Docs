import * as Dialog from '@radix-ui/react-dialog';
import { useContext, useEffect, useRef, useState } from 'react';
import { adminContext } from '../../../app/Context/contextAdmin';
import { loadingContext } from '../../../app/Context/contextLoading';
import { GetEnterprises } from '../../../Utils/Firebase/Enterprises/getEnterprises';
import { GetUsers } from '../../../Utils/Firebase/Users/GetUsers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Event } from '../../../types/event';
import { v4 as uuidv4 } from 'uuid';
import CreateEvent from '../../../Utils/Firebase/Events/CreateEvent';
import { UpdatePendencies } from '../../../Utils/Firebase/Users/UpdatePendencies';
import EditEvent from '../../../Utils/Firebase/Events/EditEvent';
import style from './modalEvent.module.css'
import { companyContext } from '@/src/app/Context/contextCompany';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';


interface interfaceOptionsUser {
    value: {
        id: string
        nameUser: string
        email: string
    }
    label: string
}

interface interfaceOptionsEnterprises {
    value: { id_enterprise: string, nameEnterprise: string, id_folderCliente: string }
    label: string
}

interface Props {
    emailUser?: string
    action: string
    event?: Event
    defaultValue?: { label: string, value: { id_user: string } }
    modalEvent: boolean
    setModalEvent: React.Dispatch<React.SetStateAction<boolean>>
    childModalEvent?: Function
}

function ModalEvent({ emailUser, action, event, defaultValue, modalEvent, setModalEvent, childModalEvent }: Props) {
    registerLocale('pt-BR', pt)
    const { loading, setLoading } = useContext(loadingContext)
    const { dataCompany } = useContext(companyContext)
    const { dataAdmin } = useContext(adminContext)
    const [optionsUser, setOptionsUser] = useState<interfaceOptionsUser[]>()
    const [optionsEnterprise, setOptionsEnterprise] = useState<interfaceOptionsEnterprises[]>()
    const styleText = 'mt-[15px] text-[20px] max-sm:text-[18px] max-lsm:text-[16px]'
    const refSelectEnterprese = useRef<any>()
    const [email, setEmail] = useState<string>(emailUser ? emailUser : '')
    const [advanced, setAdvanced] = useState(false)
    const [tasks, setTasks] = useState<Array<{title: string, isRequired: boolean}>>([])
    const [dataEvent, setDataEvent] = useState<Event>({
        id: uuidv4(),
        id_user: '',
        id_folder: '',
        id_enterprise: '',
        nameEnterprise: '',
        userName: defaultValue ? defaultValue.label : '',
        title: '',
        description: '',
        dateStarted: new Date().setHours(0, 0, 0, 0),
        dateEnd: null,
        complete: false,
        definedDate: false,
        repeatMonths: false,
        limitedDelivery: false,
        lastModify: null,
        delivered: false,
        tasks: []
    })

    useEffect(() => {
        if (!defaultValue) {
            CreateOptioOfSelectUser()
        }

        var allDataEvent: Event = dataEvent

        if (event) {
            allDataEvent = event
        }

        if (defaultValue) {
            allDataEvent = { ...allDataEvent, id_user: defaultValue.value.id_user }
        }

        setDataEvent(allDataEvent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function CreateOptioOfSelectUser() {
        const result = await GetUsers({ id_company: dataAdmin.id_company, permission: dataAdmin.permission, admin_id: dataAdmin.id })
        const options: interfaceOptionsUser[] = []
        if (result) {
            for await (const user of result) {
                const data: interfaceOptionsUser = {
                    value: {
                        id: user.id,
                        nameUser: user.name,
                        email: user.email,
                    },
                    label: user.name
                }
                options.push(data)
            }

            setOptionsUser(options)
        }
    }


    useEffect(() => {
        if (dataEvent.id_user != '' && dataEvent.id_user) {
            CreateOptioOfSelectEnterprise(dataEvent.id_user)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataEvent.id_user])

    async function CreateOptioOfSelectEnterprise(id_user: string) {
        const result = await GetEnterprises({ id_company: dataAdmin.id_company, id_user: id_user })
        const options: interfaceOptionsEnterprises[] = []
        if (result) {
            for await (const event of result) {
                const data: interfaceOptionsEnterprises = {
                    value: {
                        id_enterprise: event.id,
                        nameEnterprise: event.name,
                        id_folderCliente: event.folders[0].id
                    },
                    label: event.name
                }
                options.push(data)
            }
            setOptionsEnterprise(options)
        }
    }

    async function VerifyDataEvent() {
        if (dataEvent.id_user === '' || dataEvent.id_user === undefined) {
            return toast.error('Atribua um usuário para este evento.');
        }

        if (dataEvent.id_folder === '' || dataEvent.id_folder === undefined) {
            return toast.error('Atribua uma empresa para este evento.');
        }

        if (dataEvent.title === '') {
            return toast.error('Atribua um título para este evento.');
        }

        if (dataEvent.description === '') {
            return toast.error('Atribua uma descrição para este evento.');
        }

        if (dataEvent.dateStarted === null) {
            return toast.error('Escolha uma data de inicio para este evento.');
        }

        if (dataEvent.definedDate && dataEvent.dateEnd === null) {
            return toast.error('Escolha uma data limite para este evento.');
        }

        setLoading(true)
        if (action === 'create') {
            const result = await toast.promise(CreateEventInFireStore(), { pending: 'Criando evento...', success: 'Evento criado com sucesso!' })

        } else {
            const result = await toast.promise(EditEventInFireStore(), { pending: 'Editando evento...', success: 'Evento editado com sucesso!' })
        }

        if (childModalEvent) {
            childModalEvent({ event: dataEvent })
        }

        setLoading(false)
        setModalEvent(false)
    }

    async function CreateEventInFireStore() {
        const result = await CreateEvent({ event: {...dataEvent, tasks}, id_company: dataAdmin.id_company, email,  url:dataCompany.domain })
        const response = await UpdatePendencies({ id_company: dataAdmin.id_company, id_user: dataEvent.id_user, action: 'sum' })
        // await CreateNotificationAfterCreateEvent()
    }

    async function EditEventInFireStore() {
        const result = EditEvent({ event: dataEvent, id_company: dataAdmin.id_company, })
    }

    // async function CreateNotificationAfterCreateEvent() {
    //     const data: Notification = {
    //         id: uuidv4(),
    //         photo_url: dataAdmin.photo_url,
    //         nameSender: dataAdmin.name,
    //         description: `Atribuiu o evento ${dataEvent.title} para você.`,
    //         date: dataEvent.dateStarted
    //     }
    //     await CreateNotification({ notification: data, id_company: dataAdmin.id_company, addressee: dataEvent.id_user })
    // }

    const NoOptionsMessage = () => {
        return <p className='text-center py-[10px]'>Não encontrado.</p>;
    };

    function OrganizeMinDateEnd() {
        const date = new Date(dataEvent.dateStarted)
        const day = date.getDate()
        const newDate = new Date(date).setDate(day + 1)
        return newDate
    }

    function SelectUser(e) {
        if (e) {
            setDataEvent({ ...dataEvent, id_user: e?.value.id, userName: e?.value.nameUser, id_enterprise: '', nameEnterprise: '', id_folder: '' })
            setEmail(e?.value.email)
        } else {
            refSelectEnterprese.current.clearValue()
            setDataEvent({ ...dataEvent, id_enterprise: '', nameEnterprise: '', id_folder: '', id_user: '', userName:'' })
        }
    }

    return (
        <Dialog.Root open={modalEvent} onOpenChange={setModalEvent}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20 " />
                <Dialog.Content id={style.boxModalEvent} className=" data-[state=open]:animate-contentShow fixed top-[50%] rounded-[15px] left-[50%] w-[530px] max-sm:w-[400px] max-lsm:w-[360px] overflow-hidden  translate-x-[-50%] translate-y-[-50%] focus:outline-none z-20 max-h-[95%] overflow-y-auto">
                    <div className='bg-primary rounded-[15px]'>
                        <div className='bg-blue w-full h-[15px] rounded-t-[15px]' />
                        <div>
                            <div className='text-left flex flex-col mt-[20px] max-sm:mt-[10px] px-[40px] max-sm:px-[20px] '>
                                <p className='text-[26px] max-sm:text-[24px] max-lsm:text-[22px] after:w-[40px] after:h-[3px] after:block after:bg-blue after:rounded-full after:ml-[3px] after:mt-[-5px]'>
                                    {action === 'create' ? 'Criar Evento' : 'Editar Evento'}
                                </p>

                                <div className='overflow-y-auto max-h-[700px] my-4 pr-2 overflow-x-hidden'>
                                <p className='text-[20px] max-sm:text-[18px] max-lsm:text-[16px] mt-[20px]'>Usuário Designado:</p>
                                <Select
                                    placeholder={'Selecionar...'}
                                    components={{ NoOptionsMessage }}
                                    defaultValue={defaultValue}
                                    isDisabled={loading || defaultValue != undefined}
                                    options={optionsUser}
                                    isClearable={true}
                                    onChange={(e: any) => SelectUser(e)}
                                    className='text-[20px] max-sm:text-[18px] mt-[4px] text-[#686868] w-full'
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 8,
                                        colors: {
                                            ...theme.colors,
                                            primary25: 'rgba(46,134,171,0.30)',
                                            primary: '#2E86AB',
                                        },
                                    })}
                                />

                                <p className={styleText}>Empresa:</p>
                                <Select
                                    placeholder='Selecionar...'
                                    value={{ label: dataEvent.nameEnterprise }}
                                    components={{ NoOptionsMessage }}
                                    ref={refSelectEnterprese}
                                    isDisabled={dataEvent.id_user ? false : true || loading}
                                    options={optionsEnterprise}
                                    isClearable={true}
                                    onChange={(e: any) => setDataEvent({ ...dataEvent, id_enterprise: e?.value.id_enterprise, nameEnterprise: e?.value.nameEnterprise, id_folder: e?.value.id_folderCliente })}
                                    className='text-[20px] max-sm:text-[18px] mt-[4px] text-[#686868] w-full'
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 8,
                                        colors: {
                                            ...theme.colors,
                                            primary25: 'rgba(46,134,171,0.30)',
                                            primary: '#2E86AB',
                                        },
                                    })}
                                />

                                <p className={styleText}>Título:</p>
                                <input value={dataEvent.title} maxLength={50} disabled={loading} placeholder='Digite o título do evento' onChange={(text) => setDataEvent({ ...dataEvent, title: text.target.value })} className='text-[18px] max-sm:text-[16px] mt-[4px] w-full px-[15px] py-[8px] rounded-[8px] border-[1px] border-black text-[#9E9E9E] bg-transparent focus:outline-none focus:ring-[2px] focus:ring-[#686868]' />

                                <p className={styleText}>Descrição:</p>
                                <textarea value={dataEvent.description} maxLength={250} disabled={loading} rows={4} placeholder='Digite a mensagem do evento' onChange={(text) => setDataEvent({ ...dataEvent, description: text.target.value })} className='text-[18px] max-sm:text-[16px] resize-none mt-[4px] w-full px-[15px] py-[8px] rounded-[8px] border-[1px] border-black text-[#9E9E9E] bg-transparent focus:outline-none focus:ring-[2px] focus:ring-[#686868]' />
                                
                                <p className={styleText}>Tarefas:</p>

                                {tasks.map((task, index) => {
                                    return (
                                        <div key={index} className='flex items-center border-b border-neutral-400 py-1 my-2'>
                                            <input type="text" placeholder='Documento' className='bg-transparent w-full outline-none' value={task.title} onChange={(e) => {
                                                tasks[index].title = e.target.value
                                                setTasks([...tasks])
                                            }}/>
                                            <select name="importance" id="importance" className='bg-neutral-300 p-1 rounded-md hover:bg-neutral-400/60 cursor-pointer mr-2' onChange={(e) => {
                                                if (e.target.value == '1') {
                                                    tasks[index].isRequired = true
                                                } else {
                                                    tasks[index].isRequired = false
                                                }

                                                setTasks([...tasks])
                                            }}>
                                                <option value="1">Obrigatório</option>
                                                <option value="2">Opcional</option>
                                            </select>
                                            <TrashIcon className='w-[40px] h-[30px] hover:bg-neutral-300 text-red rounded-md p-1 cursor-pointer duration-100' onClick={() => {
                                                tasks.splice(index, 1)
                                                setTasks([...tasks])
                                            }}/>
                                        </div>
                                    )
                                })}

                                <button className='w-fit flex items-center gap-1 text-blue bg-neutral-200 hover:bg-neutral-300 duration-100 rounded-md py-1 px-2 mt-4' onClick={() => {
                                    setTasks((state) => [...state, {title: '', isRequired: true}])
                                }}>Adicionar novo <PlusIcon/></button>
                                
                                <p className='w-fit flex items-center gap-1 cursor-pointer mt-4 bg-neutral-200 py-1 px-2 rounded-md hover:bg-neutral-300 duration-100' onClick={() => {
                                    setAdvanced((state) => !state)
                                }}>Avançado {advanced ? <ChevronUpIcon/> : <ChevronDownIcon/>}</p>

                                {advanced && 
                                <div>
                                    <p className={styleText}>Prazo para Entrega:</p>

                                    <div className='mt-[4px] flex items-center text-[20px] max-sm:text-[18px] max-lsm:text-[16px] gap-x-[10px] text-[#686868]'>
                                        <p>De</p>
                                        <DatePicker
                                            locale="pt-BR"
                                            dateFormat="dd/MM/yyyy"
                                            selected={dataEvent.dateStarted}
                                            onChange={(date) => setDataEvent({ ...dataEvent, dateStarted: date.setHours(0, 0, 0, 0), dateEnd: null })}
                                            minDate={new Date()}
                                            disabled={loading}
                                            className='w-[160px]  max-sm:w-[140px] max-lsm:w-[120px] px-[8px] py-[5px] rounded-[8px]'
                                            showPopperArrow={false}
                                            popperModifiers={[
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -5],
                                                    },
                                                },
                                            ]}
                                        />

                                        <p>Até</p>
                                        <DatePicker
                                            locale="pt-BR"
                                            dateFormat="dd/MM/yyyy"
                                            value={dataEvent.dateEnd}
                                            selected={dataEvent.dateEnd}
                                            onChange={(date) => setDataEvent({ ...dataEvent, dateEnd: date.setHours(23, 59, 59, 59) })}
                                            minDate={OrganizeMinDateEnd()}
                                            disabled={dataEvent.definedDate ? false : true || loading}
                                            placeholderText={dataEvent.definedDate ? '' : 'Desabilitado'}
                                            className='w-[160px] max-sm:w-[140px] max-lsm:w-[120px] px-[8px] py-[5px] rounded-[8px] bg-white'
                                            showPopperArrow={false}
                                            popperModifiers={[
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -5],
                                                    },
                                                },
                                            ]}
                                        />
                                    </div>

                                    <div className='flex items-center mt-[15px]'>
                                        <input disabled={loading} checked={dataEvent.definedDate} onChange={(e) => setDataEvent({ ...dataEvent, definedDate: !dataEvent.definedDate, dateEnd: null })} type="checkbox" style={{ appearance: dataEvent.definedDate ? 'auto' : 'none' }} className={`  accent-gray-600 w-[20px] h-[20px] border-[1px] border-[#686868] rounded-[3px] cursor-pointer max-sm:w-[18px] max-sm:h-[18px]`} />
                                        <p className='ml-[5px] text-[#686868] text-[18px] max-sm:text-[16px] max-lsm:text-[14px] '>Definir data limite</p>
                                    </div>

                                    {/* <div className='flex items-center mt-[10px]'>
                                    <input disabled={loading} value={dataEvent.repeatMonths.toString()} onChange={(e) => setDataEvent({...dataEvent, repeatMonths:!dataEvent.repeatMonths})} type="checkbox" className={`${dataEvent.repeatMonths? '' : 'appearance-none'}  accent-gray-600 w-[20px] h-[20px] border-[1px] border-[#686868] rounded-[3px] cursor-pointer max-sm:w-[18px] max-sm:h-[18px]`} />
                                    <p className='ml-[5px] text-[#686868] text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>Repetir mesmo eventos entre os meses</p>
                                    </div> */}

                                    <div className='flex items-center mt-[10px]'>
                                        <input disabled={loading} checked={dataEvent.limitedDelivery} onChange={(e) => setDataEvent({ ...dataEvent, limitedDelivery: !dataEvent.limitedDelivery })} type="checkbox" style={{ appearance: dataEvent.limitedDelivery ? 'auto' : 'none' }} className={`${dataEvent.limitedDelivery ? '' : 'appearance-none'}  accent-gray-600 w-[20px] h-[20px] border-[1px] border-[#686868] rounded-[3px] cursor-pointer max-sm:w-[18px] max-sm:h-[18px]`} />
                                        <p className='ml-[5px] text-[#686868] text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>Limitar entrega pós vencimento</p>
                                    </div>
                                </div>
                                }
                            </div>
                                </div>
                                

                            <div className='bg-[#D9D9D9] mt-[15px] px-[30px] max-sm:px-[15px] py-[14px] flex justify-between font-[500] rounded-b-[15px]'>
                                <Dialog.Close disabled={loading} asChild>
                                    <button disabled={loading} className='text-[#EBEBEB] bg-[#8F8F8F] rounded-[8px] px-[14px] py-[9px] hover:bg-[#777777] duration-100'>
                                        Cancelar
                                    </button>
                                </Dialog.Close>

                                <button disabled={loading} onClick={() => VerifyDataEvent()} className='bg-[rgba(0,64,124,0.3)] text-[#FFFFFF] border-[1px] border-blue rounded-[8px] px-[14px] py-[9px] hover:bg-[rgba(0,64,124,0.5)] duration-100'>
                                    Confirmar
                                </button>
                            </div>
                        </div>

                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >

    )
}

export default ModalEvent