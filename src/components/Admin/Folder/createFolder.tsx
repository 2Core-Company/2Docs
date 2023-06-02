import React from "react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { toast } from "react-toastify";
import { DataUser } from "../../../types/users";
import * as Switch from "@radix-ui/react-switch";
import { useTheme } from "../../../hooks/useTheme";
import { Enterprise} from "../../../types/others";
import { Folders } from "../../../types/folders";
import { v4 as uuidv4 } from 'uuid';

interface Props {
  user: DataUser;
  enterprise: Enterprise;
  id: string;
  id_company: string;
  setUser: Function;
  setCreateFolder: Function;
}

function CreateFolder({user, enterprise, id, id_company, setUser, setCreateFolder}: Props) {
  const folders:Folders[] = enterprise.folders;
  const [dataFolder, setDataFolder] = useState({color:'#005694', name:''})
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const toastCreateFolder = {pending: "Criando pasta.", success: "Pasta criada.",error: "Não foi possível criar esta pasta."}
  const { theme } = useTheme();

  //Função de criar pasta
  async function CreateFolder() {
    if(dataFolder.name.toLocaleUpperCase() === 'MEUS'){
      throw toast.error('Você não pode criar uma pasta com o nome "Meus"')
    }
    const result = folders.findIndex((folder) => folder.name === dataFolder.name);
    if (result === -1) {
      if (dataFolder.color != undefined && dataFolder.name.length > 0) {
        folders.push({
          name: dataFolder.name,
          color: dataFolder.color,
          isPrivate: isPrivate,
          singleDownload: false,
          onlyMonthDownload: false,
          timeFile: 3, //Permanent
          id:uuidv4()
        });
        const index = user.enterprises.findIndex((data) => enterprise.id === data.id)
        user.enterprises[index] = enterprise

        try {
          await updateDoc(doc(db, "companies", id_company, "clients", id), {
            enterprises: user.enterprises,
          });
          setUser({ ...user, enterprises:user.enterprises});
          setCreateFolder(false);
        } catch (err) {
          console.log(err);
        }
      } else {
        throw toast.error("Escolha uma cor e um nome para a pasta.");
      }
    } else {
      throw toast.error("Já existe uma pasta com esse nome.");
    }
  }

  return (
    <div className="w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50">
      <div className="bg-primary dark:bg-dprimary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col">
        <div className={`bg-[${dataFolder.color}] w-full h-[15px] rounded-t-[4px]`} />
        <div className="px-[10px] pl-[20px]">
          <p className="text-[26px] mt-[10px] font-[500] dark:text-white">
            Criar Nova Pasta
          </p>
          <p className="text-[20px] mt-[10px] font-[500] dark:text-white">
            Nome da Pasta:
          </p>
          <input placeholder="Digite o nome da pasta" onChange={(text) => setDataFolder({...dataFolder, name: text.target.value})} maxLength={20} className="w-[80%] bg-transparent border-black dark:border-white border-[2px] rounded-[8px] text-[20px] max-sm:text-[18px] dark:text-white dark:placeholder:text-gray-500 max-lsm:text-[16px] px-[5px] py-[3px] outline-none"/>
          <p className="text-[20px] mt-[15px] font-[500] dark:text-white">
            Cor da pasta:
          </p>
          <div className="gap-[10px] flex">
            <div onClick={() => setDataFolder({...dataFolder, color:"#005694"})} className={`w-[30px] h-[30px] bg-[#005694] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#005694" ? "border-[#0093FF] border-[3px]" : <></> }`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#C7A03C"})} className={`w-[30px] h-[30px] bg-[#C7A03C] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#C7A03C" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#248B2E"})} className={`w-[30px] h-[30px] bg-[#248B2E] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#248B2E" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#BE0000"})} className={`w-[30px] h-[30px] bg-[#BE0000] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#BE0000" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#E135D0"})} className={`w-[30px] h-[30px] bg-[#E135D0] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#E135D0" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#000000"})} className={`w-[30px] h-[30px] bg-[#000000] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#000000" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
            <div onClick={() => setDataFolder({...dataFolder, color:"#9E9E9E"})} className={`w-[30px] h-[30px] bg-[#9E9E9E] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#9E9E9E" ? "border-[#0093FF] border-[3px]" : <></>}`}/>
          </div>
          <div className="flex mt-5 items-center cursor-pointer">
            {theme == "light" ? (
              <Switch.Root
                className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-pointer"
                id="airplane-mode"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => setIsPrivate((value) => !value)}
                checked={isPrivate}
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            ) : (
              <Switch.Root
                className="w-[42px] h-[25px] bg-white/30 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-white outline-none cursor-pointer"
                id="airplane-mode"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => setIsPrivate((value) => !value)}
                checked={isPrivate}
              >
                <Switch.Thumb
                  className={`block w-[21px] h-[21px] bg-black rounded-[50%] shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]`}
                />
              </Switch.Root>
            )}
            <p className="text-[20px] ml-3 font-[500] dark:text-white">
              Pasta Privada?
            </p>
          </div>
        </div>
        <div className="flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]">
          <button onClick={() => setCreateFolder(false)} className="cursor-pointer bg-strong dark:bg-dstrong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] max-sm:text-[18px] text-white">
            Cancelar
          </button>
          <button onClick={() => toast.promise(CreateFolder(), toastCreateFolder)}className="cursor-pointer bg-greenV/40 border-2 border-greenV hover:scale-[1.10]  duration-300 p-[5px] rounded-[8px] text-[20px] max-sm:text-[18px] text-white ">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFolder;

