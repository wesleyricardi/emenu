import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../config/index.json";
import { useBillAuthentication } from "../../context/BillContext";

import styles from "../../css/components/pedidos/abrir&login.module.css";

export default function LoginMesa({
  table,
  statusClose,
}: {
  table: string | string[];
  statusClose?: any;
}) {
  const [IDBill, setIDBill] = useState<string | null>(null);
  const { register, handleSubmit } = useForm();
  const { loginBill } = useBillAuthentication();

  const handleLogin = async ({ senha }) => {
    const isAuthenticated = await loginBill({ bill_id: IDBill, senha });
    if (isAuthenticated && statusClose) statusClose(false);
  };

  useEffect(() => {
    async function getBillID() {
      try {
        const req = await fetch(`${API}/verificarmesa/${table}`);

        const { code, id: bill } = await req.json();
        if (code && (code === 200 || code === 203)) {
          setIDBill(bill);
        } else statusClose(false);
      } catch (error) {
        console.log(error);
      }
    }

    getBillID();
  }, []);

  return (
    <form
      id={styles.bill_access}
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit(handleLogin)}
    >
      <h1>Entre com a senha definida para adicionar os itens</h1>
      <div>
        <input
          {...register("senha")}
          required
          type="password"
          name="senha"
          id="input_senha"
          placeholder=" "
        />
        <label htmlFor="input_senha">Senha</label>
      </div>
      <button>LOGIN NA MESA</button>
    </form>
  );
}
