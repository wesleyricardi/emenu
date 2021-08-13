import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthentication } from "../../context/AuthContext";
import { useBillAuthentication } from "../../context/BillContext";
import { useItemInCart } from "../../context/CartContext";
import ComponentLogin from "../user/login";
import ComponentRegister from "../user/cadastro";
import ComponentLoginTable from "../pedidos/login";
import ComponentOpenTable from "../pedidos/abrir";
import { API } from "../../config";

import styles from "../../css/components/cart/check.module.css";
import Price from "../_extra/price";

type CartList = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  observacao: string | null;
  order: string;
};

export default function List({
  setStep,
  send2Update,
  closeAll,
}: {
  setStep: any;
  send2Update: any;
  closeAll: any;
}) {
  const { cart } = useItemInCart();
  const [Total, setTotal] = useState<number>(0);
  const { Bill } = useBillAuthentication();
  const { User } = useAuthentication();
  const [LoginWindow, setLoginWindow] = useState<boolean>(false);
  const [RegisterWindow, setRegisterWindow] = useState<boolean>(false);
  const [LoginTableWindow, setLoginTableWindow] = useState<boolean>(false);
  const [BillOpen, setBillOpen] = useState<boolean>(false);
  const [BillClose, setBillClose] = useState<boolean>(false);

  const router = useRouter();
  const { id: id_mesa } = router.query;

  useEffect(() => {
    history.pushState(null, null, `carrinho`);

    const calcTotal = async () => {
      const total = cart.reduce((total, item) => {
        return total + item.preco * item.quantidade;
      }, 0);
      setTotal(total);
    };

    if (cart) calcTotal();
    else closeAll();

    async function getBillID() {
      try {
        const req = await fetch(`${API}/api/verificarmesa/${id_mesa}`);

        const { code, id: bill } = await req.json();
        if (code === 200) setBillOpen(true);

        if (code === 203) setBillClose(true);
      } catch (error) {
        console.log(error);
      }
    }

    getBillID();
  }, []);

  return (
    <div id={styles.checkout}>
      <h2>Seu carrinho</h2>
      <div>
        {cart?.map((item, key: number) => (
          <div onClick={send2Update} id={"id_" + item.order} key={key}>
            <div>
              <span>{item.quantidade}</span>
              <span>{item.nome}</span>
              {item.observacao && <span>{item.observacao}</span>}
            </div>
            <div>
              <Price>{item.preco * item.quantidade}</Price>
            </div>
          </div>
        ))}
      </div>
      <div className="max-width-600">
        <div>
          <span>Sub total</span>
          <span>
            <Price>{Total}</Price>
          </span>
        </div>
        {Bill && User ? (
          !BillClose ? (
            <button onClick={() => setStep(3)}>Finalizar</button>
          ) : (
            <button>Conta encerrada</button>
          )
        ) : User ? (
          <button onClick={() => setLoginTableWindow(true)}>
            Entrar na mesa
          </button>
        ) : (
          <>
            <div>Para continuar faça</div>
            <button
              className={styles.register_login}
              onClick={() => setLoginWindow(true)}
            >
              Login
            </button>
            <button
              className={styles.register_login}
              onClick={() => setRegisterWindow(true)}
            >
              Cadastro
            </button>
          </>
        )}
      </div>
      {LoginWindow && (
        <div
          onClick={() => setLoginWindow(false)}
          className="grid-center-center full-window background-blur-1px"
        >
          <ComponentLogin setLoginWindow={setLoginWindow} />
        </div>
      )}
      {RegisterWindow && (
        <div
          onClick={() => setRegisterWindow(false)}
          className="grid-center-center full-window background-blur-1px"
        >
          <ComponentRegister setRegisterWindow={setRegisterWindow} />
        </div>
      )}
      {LoginTableWindow && (
        <div
          onClick={() => setLoginTableWindow(false)}
          className="grid-center-center full-window background-blur-1px"
        >
          {id_mesa &&
            (BillOpen ? (
              <ComponentLoginTable
                statusClose={setLoginTableWindow}
                table={id_mesa}
              />
            ) : (
              <ComponentOpenTable
                statusClose={setLoginTableWindow}
                table={id_mesa}
              />
            ))}
        </div>
      )}
    </div>
  );
}
