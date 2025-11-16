import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CinematicLoader } from "@/components/CinematicLoader";

interface LoadingContextType {
  setLoading: (loading: boolean, message?: string) => void;
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const setLoading = (loading: boolean, message: string = "Loading...") => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading, loadingMessage }}>
      {children}
      <CinematicLoader isLoading={isLoading} message={loadingMessage} type="api" />
    </LoadingContext.Provider>
  );
};

