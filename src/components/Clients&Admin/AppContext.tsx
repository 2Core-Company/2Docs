import {createContext} from 'react';
import { DataUser, Files } from '../../types/interfaces' 
const AppContext = createContext<AllContextType | null>(null)

  interface AllContextType{
    loading: boolean,
    setLoading:(loading: boolean) => void,
    dataUser: DataUser,
    setDataUser:(dataUser: DataUser) => void;
    allFiles: Array<Files>
    setAllFiles:(allFiles: Array<Files>) => void
  };

 export default AppContext;
