import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: AuthContextType["user"]) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  useEffect(() => {
    const tokenGeneration = async () => {
      try {
        const res = await refreshAccessToken();
        setAccessToken(res.accessToken);
        setStoredAccessToken(res.accessToken);
        setUser(res.user);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to refresh accessToken";
        console.log(message);
      }
    };
    tokenGeneration();
  }, []);
  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);
  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within Provider.");
  return context;
};
