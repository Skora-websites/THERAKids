/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [settings] = useState({
    phone: '123-456-7890',
    email: 'info@therakids.com',
    address: '123 Therapy Lane, Wellness City'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppContext.Provider value={{ settings, isModalOpen, setIsModalOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
