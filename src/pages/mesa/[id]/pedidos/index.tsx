import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "../../../../config";
import AbrirMesa from "../../../../components/pedidos/abrir";
import BillItems from "../../../../components/pedidos/items";
import Cart from "../../../../components/cart";
import Loading from "../../../../components/_extra/loading";
import { useBillAuthentication } from "../../../../context/BillContext";
import LoginMesa from "../../../../components/pedidos/login";
import { useAuthentication } from "../../../../context/AuthContext";

import styles from "../../../../css/components/pedidos/index.module.css";

function Pedidos() {
  const [loaded, setloaded] = useState<boolean>(false);
  const [billStatus, setbillStatus] = useState<string | undefined>(undefined);
  const { Bill } = useBillAuthentication();
  const { User } = useAuthentication();
  const [BillOpen, setBillOpen] = useState<boolean>(false);

  const router = useRouter();
  const { id: id_mesa } = router.query;

  useEffect(() => {
    if (id_mesa !== undefined && Bill !== undefined && User !== undefined)
      setloaded(true);
  }, [id_mesa, Bill, User]);

  useEffect(() => {
    async function getBillID() {
      try {
        const req = await fetch(`${API}/api/verificarmesa/${id_mesa}`);
        const { code, id: bill } = await req.json();
        if (code && (code === 200 || code === 203)) {
          setBillOpen(true);
          if (code === 200) setbillStatus("OPEN");
          if (code === 203) setbillStatus("ENCERRADO");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (id_mesa) {
      const day = new Date();
      day.setTime(day.getTime() + 1000 * 60 * 60);
      document.cookie = `cardapio.mesa=${id_mesa};expires=${day.toUTCString()}; path=/`;

      getBillID();
    }
  }, [id_mesa]);

  function Render() {
    if (Bill && User) {
      return (
        <>
          <header>Mesa {id_mesa}</header>
          <BillItems
            billStatus={billStatus}
            setbillStatus={setbillStatus}
            table={id_mesa}
            bill={Bill.id}
            user={User}
          />
          <Cart />
        </>
      );
    } else if (!User) {
      return (
        <div className="grid-center-center full-window background-blur-1px">
          <div className="text-align-center">
            <h2>Para acessar essa pagina é necessário</h2>
            <Link href={`/user/login`}>
              <a>
                <button>Fazer login</button>
              </a>
            </Link>
            {" ou "}
            <Link href={`/user/cadastro`}>
              <a>
                <button>Fazer cadastro</button>
              </a>
            </Link>
          </div>
        </div>
      );
    } else {
      return BillOpen ? (
        <div className="grid-center-center full-window background-blur-1px">
          <LoginMesa table={id_mesa} />
        </div>
      ) : (
        <div className="grid-center-center full-window background-blur-1px">
          <AbrirMesa table={id_mesa} />
        </div>
      );
    }
  }

  if (loaded) return <main id={styles.pedidos}>{<Render />}</main>;
  else return <Loading />;
}

export default Pedidos;
