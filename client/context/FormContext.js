import { createContext, useContext } from "react";

const FormContext = createContext(null);

export const useFormContext = () => {
  return useContext(FormContext);
};

export default FormContext;
