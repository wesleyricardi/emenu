import { createContext, useState, useContext, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { API } from "../config/index.json";

type AuthType = {
  isAuthenticated?: boolean;
  Bill: {
    id: number;
    mesa: number;
  };
  loginBill: (data: LoginData) => Promise<boolean>;
};

type LoginData = {
  bill_id: string;
  senha: string;
};

type BillType = {
  id: number;
  mesa: number;
};

export const billContext = createContext({} as AuthType);

export default function BillProvider({ children }) {
  const [Bill, setBill] = useState<BillType | null>(null);

  useEffect(() => {
    const { "cardapio.bill.token": token } = parseCookies();

    async function recover() {
      if (token) {
        try {
          const req = await fetch(`${API}/mesa/authlogin`, {
            method: "POST",
            mode: "cors",
            headers: {
              Authorization: "bearer",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(token),
          });

          const { id, mesa } = await req.json();

          const verf = await fetch(`${API}/verificarmesa/${mesa}`);
          const { code } = await verf.json();
          console.log(mesa);
          if (code && (code === 200 || code === 203)) setBill({ id, mesa });
          else {
            destroyCookie(undefined, "cardapio.bill.token");
            setBill(null);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    recover();
  }, []);

  async function loginBill({ bill_id, senha }: LoginData) {
    try {
      const req = await fetch(`${API}/mesa/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "bearer",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: bill_id, senha }),
      });

      const { code, token, id, mesa } = await req.json();
      if (code) {
        if (code === 201) {
          setCookie(undefined, "cardapio.bill.token", token, {
            maxAge: 60 * 60 * 2, //2 horas
          });
          setBill({ id, mesa });
          return true;
        } else if (code === 203) alert("Senha incorreta");
        else alert("erro desconhecido, tente novamente");
      } else alert("problema no sistema, tente novamente mais tarde");
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <billContext.Provider value={{ loginBill, Bill }}>
      {children}
    </billContext.Provider>
  );
}

export function useBillAuthentication() {
  const context = useContext(billContext);
  const { loginBill, Bill } = context;
  return { loginBill, Bill };
}
