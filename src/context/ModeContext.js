import React, { createContext, useState, useContext } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('technical');

  const modesConfig = {
    technical: { 
      title: 'Técnico', 
      color: '#FF6B6B', 
      colors: ['#FF6B6B', '#FF8E53']
    },
    expressive: { 
      title: 'Expresión', 
      color: '#FFB800', 
      colors: ['#FFB800', '#FFD15C']
    },
    physical: { 
      title: 'Físico', 
      color: '#00D2FF', 
      colors: ['#00D2FF', '#3A7BD5']
    },
    pause: { 
      title: 'Pausa', 
      color: '#B06AB3', 
      colors: ['#B06AB3', '#4568DC']
    },
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, modesConfig, currentConfig: modesConfig[mode] }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
