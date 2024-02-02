import { createContext, ReactNode, useState, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { login, getMe } from "@/service/apiClient";
import Router from "next/router";
import UserType from "@/utils/types/user";
import { toast } from "react-toastify";
import { APP_ROUTER } from "@/utils/constants/app-router";

type AuthContextData = {
  userData: UserType;
  isAuth: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

type SignInProps = {
  name: string;
  password: string;
};

type AuthContextType = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export const signOut = () => {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch (error) {
    console.error(error);
  }
};

export const AuthProvider = ({ children }: AuthContextType) => {
  const [userData, setUserData] = useState<UserType>({} as UserType);
  const isAuth = !!userData;

  const handleSearchUser = async (token: string) => {
    try {
      const response = await getMe(token);
      setUserData(response);
    } catch (error) {
      console.error("[ERRO AO BUSCAR USUARIO]" + error);
    }
  };

  useEffect(() => {
    // tentar pegar o token do cookie
    const { "@nextauth.token": authToken } = parseCookies();
    // se existir token, tentar procurar usuario
    if (authToken) {
      handleSearchUser(authToken);
    } else {
      // se nao existir token, redirecionar ele para o login
      Router.push("/");
    }
  }, []);

  const signIn = async ({ name, password }: SignInProps) => {
    try {
      const { user, token } = await login({ name, password });

      setUserData(user);

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
        sameSite: "lax",
      });

      toast.success("Login realizado com sucesso!");

      Router.push(APP_ROUTER.private.turno.name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, isAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
