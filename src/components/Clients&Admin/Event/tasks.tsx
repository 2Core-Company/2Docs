import {useState, useEffect} from 'react'
import { Files } from '../../../types/files'

interface Props {
    task: Array<{title: string, isRequired: boolean}>
    files: Files[]
}

export function Tasks({task, files}: Props) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setIndex(files.length)
    }, [files.length])

    return (
    <div className='my-[20px] ml-[20px] max-sm:ml-[10px]'>
        <div className='flex justify-between items-center'>
            <h3 className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px] truncate'>Lista de documentos:</h3>
            <div className='flex gap-4'>
                <button className='bg-emerald-500 py-1 px-2 rounded-md text-white font-medium text-[18px] hover:bg-emerald-600 duration-100 max-lsm:text-[16px]' disabled={index === 0 ? true : false} onClick={() => {
                    setIndex(i => i - 1)
                }}>Anterior</button>

                <button className='bg-emerald-500 py-1 px-2 rounded-md text-white font-medium text-[18px] hover:bg-emerald-600 duration-100 max-lsm:text-[16px]' disabled={index == task.length || task[index]?.isRequired && index + 1 > files.length ? true : false} onClick={() => {
                    setIndex(i => i + 1)
                }}>{task[index]?.isRequired ? 'Próximo' : 'Pular'}</button>
            </div>
            
        </div>
        <div className='flex justify-between gap-4 items-center mt-2'>
            <div className='flex gap-4 items-center'>
                <p className='border border-neutral-400 rounded-full h-[60px] w-[60px] flex items-center justify-center text-[20px] font-medium max-lsm:h-[50px] max-lsm:w-[50px]'>{index + 1 > task.length ? task.length : index + 1}</p>
                <p className='text-[20px]'>{task[index]?.title ? task[index].title : task[task.length - 1].title}</p>
            </div>
            <div className={`h-1 bg-emerald-500/30 w-[80%] relative`}>
                <div className={`absolute h-1 bg-emerald-500`} style={{width: `${Math.round(((index) * 100) / task.length)}%`, maxWidth: '100%'}}></div>
            </div>
            <p className='text-[20px]'>{index + 1 > task.length ? 'Completo' : `${task.length < 10 && 0}${index + 1}/${task.length < 10 && 0}${task.length}`}</p>
        </div>
    </div>
    )
}
