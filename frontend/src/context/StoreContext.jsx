import { createContext, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [loginOrRegister, setLoginOrRegister] = useState("login");

  const contextValue = {
    loginOrRegister,
    setLoginOrRegister,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
