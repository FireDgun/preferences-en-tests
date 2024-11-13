import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { getSettings } from "../dashboard/settings/SettingsService";

const stageTwoContext = createContext();

export function StageTwoProvider({ children }) {
  const [isStageTwoOpen, setStageTwoOpen] = useState(false);
  const [isStageOneOpen, setStageOneOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      if (settings) {
        setStageTwoOpen(settings.stageTwo);
        setStageOneOpen(settings.stageOne);
      }
    };

    fetchSettings();
  }, []);

  return (
    <stageTwoContext.Provider value={{ isStageTwoOpen, isStageOneOpen }}>
      {children}
    </stageTwoContext.Provider>
  );
}

export function useStageTwo() {
  const context = useContext(stageTwoContext);
  if (!context) {
    throw new Error("useStageTwo must be used within a UserProvider");
  }
  return context;
}
