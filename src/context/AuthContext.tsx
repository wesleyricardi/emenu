import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";
import { API } from "../config";

type AuthType = {
  isAuthenticated?: boolean;
  User: number;
  login: (data: LoginData, redirect: boolean) => Promise<boolean>;
};

type LoginData = {
  email: string;
  senha: string;
};

export const AuthContext = createContext({} as AuthType);

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [User, setUser] = useState<number | null>(null);

  const isAuthenticated = !!User;

  useEffect(() => {
    const { "cardapio.token": token } = parseCookies();

    async function recover() {
      if (token) {
        try {
          const req = await fetch(`${API}/api/authlogin`, {
            method: "POST",
            mode: "cors",
            headers: {
              Authorization: "bearer",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(token),
          });

          const { id } = await req.json();
          setUser(id);
        } catch (error) {
          console.log(error);
        }
      }
    }

    recover();
  }, []);

  async function login({ email, senha }: LoginData, redirect = false) {
    try {
      const req = await fetch(`${API}/api/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "bearer",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const { code, token, id } = await req.json();

      if (code && code === 200) {
        setCookie(undefined, "cardapio.token", token, {
          maxAge: 60 * 60 * 2, //2 horas
          path: "/",
        });

        setUser(id);
        const { "cardapio.mesa": mesa } = parseCookies();
        if (redirect) {
          if (mesa) router.push(`/mesa/${mesa}/pedidos`);
          else router.push(`/`);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        User,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthContext);
  const { isAuthenticated, User, login } = context;
  return { isAuthenticated, User, login };
}
