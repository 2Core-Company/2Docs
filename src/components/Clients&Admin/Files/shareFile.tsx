import React from 'react'
import { toast } from 'react-toastify'
import { Files } from '../../../types/interfaces'

interface Props{
    file:Files
}

function ShareFile({file}:Props) {
    if(file.viwed){
        return toast.error("Você não pode compartilhar um arquivo que ja foi visualizado.")
    } else {
        window.location.href = '/CompartilharArquivo?id='
    } 
}

export default ShareFile