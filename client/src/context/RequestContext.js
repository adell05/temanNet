import { createContext, useContext, useState } from "react";

const RequestContext = createContext();

export const useRequest = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);

  return (
    <RequestContext.Provider value={{ requestCount, setRequestCount }}>
      {children}
    </RequestContext.Provider>
  );
};
