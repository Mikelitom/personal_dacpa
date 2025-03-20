import { createContext, useState, useContext, ReactNode} from 'react'

interface DashboardContextType {
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
  currentUser: {
    name: string
    role?: string
  };
  setCurrentUser: (user: { name: string; role?: string }) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard debe de usarse dentro de un DashboardProvider");
  }
  return context;
}

export const DashboardProvider = ({ children, initialUser}: {
  children: ReactNode,
  initialUser: { name: string; role?: string }
}) => {
  const [ currentTitle, setCurrentTitle ] = useState<string>('Inicio');
  const [ currentUser, setCurrentUser ] = useState(initialUser);

  const value = {
    currentTitle,
    setCurrentTitle,
    currentUser,
    setCurrentUser
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}