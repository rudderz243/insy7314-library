import { createContext, useContext } from "react";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../models/user.ts";

export interface AuthContextType {
  // variables
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
