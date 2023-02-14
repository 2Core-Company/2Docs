import {createContext} from 'react';
import { DataUser } from '../../types/interfaces' 
const AppContext = createContext<AllContextType | null>(null)

  interface AllContextType{
    loading: boolean,
    setLoading:(loading: boolean) => void,
    dataUser: DataUser,
    setDataUser:(dataUser: DataUser) => void;
  };

 export default AppContext;
