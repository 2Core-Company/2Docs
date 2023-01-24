import {createContext} from 'react';

const AppContext = createContext<AllContextType | null>(null)

  interface AllContextType{
    loading: boolean,
    setLoading:(loading: boolean) => void;
  };

 export default AppContext;
