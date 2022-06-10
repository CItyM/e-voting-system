import { createContext, useContext } from "react";

const AppContext = createContext(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;
