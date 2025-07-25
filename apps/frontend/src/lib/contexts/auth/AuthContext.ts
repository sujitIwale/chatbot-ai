
import { createContext, useContext } from "react";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};