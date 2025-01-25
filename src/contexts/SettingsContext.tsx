import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  use24Hour: boolean;
  toggleTimeFormat: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Load initial state from localStorage, default to true if not set
  const [use24Hour, setUse24Hour] = useState(() => {
    const saved = localStorage.getItem("timeFormat");
    return saved ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever the value changes
  useEffect(() => {
    localStorage.setItem("timeFormat", JSON.stringify(use24Hour));
  }, [use24Hour]);

  const toggleTimeFormat = () => {
    setUse24Hour((prev: boolean) => !prev);
  };

  return (
    <SettingsContext.Provider value={{ use24Hour, toggleTimeFormat }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
