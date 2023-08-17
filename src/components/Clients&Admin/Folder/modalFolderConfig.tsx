import React from "react";
import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { toast } from "react-toastify";
import { DataUser } from "../../../types/users";
import { FolderCfg } from "../../../types/folders";
import * as Switch from "@radix-ui/react-switch"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as Dialog from '@radix-ui/react-dialog';

interface Props {
  setUser: Function,
  user: DataUser;
  enterprise: { id: string };
  id: string;
  id_company: string;
  setFolderConfig: Function;
  setEnterprise: Function
  folderConfig: FolderCfg;
}

function ModalFolderConfig({ setUser, user, enterprise, id, id_company, setFolderConfig, folderConfig, setEnterprise }: Props) {
  const [nameFolder, setNameFolder] = useState<string>(folderConfig.name);
  const [color, setColor] = useState<string>(folderConfig.color);
  const [timeFile, setTimeFile] = useState<0 | 1 | 2 |3>(folderConfig.timeFile);
  const [singleDownload, setSingleDownload] = useState<boolean>(folderConfig.singleDownload);
  const [onlyMonthDownload, setOnlyMonthDownload] = useState<boolean>(folderConfig.onlyMonthDownload);
  const toastUpdateCfg = { pending: "Salvando configurações.", success: "Salvamento concluído."}
  const marks = {
    0: "1 dia",
    1: "1 semana",
    2: "1 mês",
    3: "Permanentemente"
  }

  async function UpdateCfg() {
    if(nameFolder.length < 4){
     throw toast.error('Sua pasta tem que ter no mínimo 4 letras.')
    }
    const docRef = doc(db, "companies", id_company, "clients", id);
    const docSnap = await getDoc(docRef);
    const enterprises = docSnap.data()?.enterprises
    const index2 = enterprises.findIndex((data) => data.id === enterprise.id)
    const folders = user.enterprises[index2].folders
    const index = folders.findIndex((folder) => folder.name === folderConfig.name);

    setUser({ ...user, enterprises: enterprises })

    if (nameFolder.toLocaleUpperCase() === 'MEUS') {
      throw toast.error('Você não pode criar uma pasta com o nome "Meus"')
    }

    try {
      if (index === -1) {
        setFolderConfig(false);
        throw "Pasta não encontrada/inexistente/excluída.";
      }
      if (color === undefined || nameFolder === "") {
        throw "Selecione uma cor e/ou um nome para a pasta.";
      }
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].name === nameFolder && i !== index) {
          throw "Este nome já está em uso."
        }
      }

      folders[index] = { ...folders[index], name: nameFolder, color: color, singleDownload: singleDownload, onlyMonthDownload: onlyMonthDownload, timeFile: timeFile }

      user.enterprises[index2].folders = folders
      setEnterprise(user.enterprises[index2])
      setUser({ ...user, enterprises: user.enterprises })

      updateDoc(
        doc(db, "companies", id_company, "clients", user.id),
        {
          enterprises: user.enterprises,
        }
      )

      setFolderConfig(false); //Fecha a tela
    } catch (e) {
      throw toast.error("Erro ao realizar a ação: " + e)
    }
  }

  function ChangeStatusModal() {
    setFolderConfig({ ...folderConfig, status: !folderConfig.status })
  }

  return (
    <Dialog.Root open={folderConfig.status} onOpenChange={ChangeStatusModal}>
      <Dialog.Trigger>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20 top-0 left-0" />
        <Dialog.Content className="bg-primary data-[state=open]:animate-contentShow fixed top-[50%] rounded-[15px] left-[50%] w-[500px] max-lsm:w-[320px] overflow-hidden  translate-x-[-50%] translate-y-[-50%] focus:outline-none z-20 max-h-[95%] overflow-y-auto">
          <div className={`bg-[${color}] w-full h-[15px] rounded-t-[4px]`} />
          <div className="px-[30px] pb-[10px]">
            <p className="text-[26px] mt-[20px] font-[500] dark:text-white">
              Configurações da Pasta
            </p>
            <div className="flex items-end my-[10px]">
              <svg width="10%" height="10%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={color} />
              </svg>

              <p className={`text-[24px] ml-2 ${nameFolder === "" ? "opacity-50" : ""}`} style={{ color: color }}>
                { nameFolder }
              </p>

            </div>
            <div className="mt-[15px]">
              <p className="text-[20px] dark:text-white">
                Alterar nome da pasta:
              </p>
              <input placeholder="Digite o nome da pasta" value={nameFolder} onChange={(text) => setNameFolder(text.target.value)} maxLength={20}
                className="mt-[5px] px-[15px] py-[8px] w-[80%] bg-transparent border-black dark:border-white border rounded-[8px] text-[20px] max-sm:text-[18px] dark:text-white dark:placeholder:text-gray-500 max-lsm:text-[16px] outline-none"
              />
            </div>
            <div className="mt-[25px]">
              <p className="text-[20px] mt-[10px] dark:text-white">
                Alterar cor da pasta:
              </p>
              <div className="gap-x-[15px] flex mt-[10px]">
                <div onClick={() => setColor("#005694")} className={`w-[30px] h-[30px] bg-[#005694] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#005694" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#C7A03C")} className={`w-[30px] h-[30px] bg-[#C7A03C] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#C7A03C" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#248B2E")} className={`w-[30px] h-[30px] bg-[#248B2E] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#248B2E" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#BE0000")} className={`w-[30px] h-[30px] bg-[#BE0000] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#BE0000" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#E135D0")} className={`w-[30px] h-[30px] bg-[#E135D0] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#E135D0" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#000000")} className={`w-[30px] h-[30px] bg-[#000000] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#000000" ? "border-[#0093FF] border-[3px]" : <></>}`} />
                <div onClick={() => setColor("#9E9E9E")} className={`w-[30px] h-[30px] bg-[#9E9E9E] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#9E9E9E" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              </div>
            </div>
            <div className="flex mt-[25px] items-center gap-x-[15px]">
              <label className="text-black text-[20px] leading-none">
                Download único
              </label>
              <Switch.Root className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-pointer" id="singleDownload" onClick={() => setSingleDownload(!singleDownload)} checked={singleDownload}>
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>
            <div className="flex mt-[24px] items-center">
              <label className="text-black text-[20px] leading-none pr-[15px]">
                Baixar apenas no mês do upload
              </label>
              <Switch.Root
                className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-pointer"
                id="onlyMonthDownload"
                onClick={() => setOnlyMonthDownload(!onlyMonthDownload)}
                checked={onlyMonthDownload}
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>
            <div className="my-6">
              <p className="text-[20px] my-[10px] dark:text-white">
                Tempo Útil de Arquivos
              </p>
              <Slider style={{ width: 400, marginLeft: "5px" }}
                trackStyle={{ backgroundColor: color }}
                activeDotStyle={{ border: `2px solid ${color}` }}
                min={0}
                max={3}
                marks={marks}
                step={null}
                onChange={(value: 0 | 1 | 2 | 3) => { setTimeFile(value) }}
                defaultValue={timeFile}
              />
            </div>
          </div>
          
          <div className="flex justify-between px-[30px] bg-[#D9D9D9] font-[500] py-[15px] border-t border-t-[#AAAAAA] rounded-b-[15px] mt-[30px]">
            <Dialog.Close className="cursor-pointer hover:bg-[#cecbcb] duration-100 px-[10px] py-[8px] border border-[rgba(104,104,104,0.7)] rounded-[8px] text-[#5C5C5C]">
              Cancelar
            </Dialog.Close>

            <button onClick={() => toast.promise(UpdateCfg(), toastUpdateCfg)} className="cursor-pointer bg-[rgba(16,185,129,0.3)] border border-greenV hover:bg-[rgba(16,185,129,0.5)] duration-100 px-[10px] py-[8px] rounded-[8px] text-[#117856] ">
              Salvar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ModalFolderConfig;
