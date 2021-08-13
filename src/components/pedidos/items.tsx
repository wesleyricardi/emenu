import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "../../config";
import Loading from "../_extra/loading";

import styles from "../../css/components/pedidos/itens.module.css";
import Price from "../_extra/price";
import Detalhes from "./detalhes";

type response = {
  code: number;
  message: string;
  result: Itens[];
};

type Itens = {
  id: number;
  nome: string;
  qtd: number;
  descricao?: string;
  preco: number;
  data: string;
  status: number;
  usuario: number;
};

type Bill = {
  mesasub: number;
  mysub: number;
};

export default function billItems({
  table,
  billStatus,
  setbillStatus,
  bill,
  user,
}) {
  const [loaded, setloaded] = useState<boolean>(false);

  const [itensBill, setBill] = useState<Itens[] | null | undefined>(undefined);
  const [total, setTotal] = useState<Bill>();
  const [totalWindow, setTotalWindow] = useState<string | null>(null);

  useEffect(() => {
    if (itensBill !== undefined) setloaded(true);
  }, [itensBill]);

  useEffect(() => {
    let mounted = true;
    async function getBill() {
      const req = await fetch(`${API}/api/getbill/${bill}`);
      const { code, result }: response = await req.json();
      if (mounted)
        if (code && code === 200) {
          const total = result.reduce(
            (total, item) => {
              if (item.usuario == user) {
                total.mysub += item.preco * item.qtd;
              }

              total.mesasub += item.preco * item.qtd;

              return total;
            },
            { mysub: 0, mytotal: 0, mesasub: 0, mesatotal: 0 }
          );

          setTotal(total);
          setBill(result);
        } else setBill(null);
    }
    getBill();

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function Status({ status }) {
    if (status === 1) return <span>Confirmado</span>;
    if (status === 2) return <span>Em preparo...</span>;
    if (status === 3) return <span>Pronto</span>;
    if (status === 4) return <span>Entregue</span>;
  }

  if (loaded)
    return (
      <div>
        {itensBill ? (
          <>
            <ul id={styles.bill_itens}>
              <div>
                {itensBill.map((Item, key) => (
                  <li
                    className={
                      Item.usuario == user
                        ? styles.my_itens
                        : styles.others_itens
                    }
                    key={key}
                  >
                    <span>{Item.qtd}</span>
                    {Item.nome}
                    <span>R$ {Item.preco / 100}</span>
                    <div>
                      <span>{Item.descricao}</span>
                      <Status status={Item.status} />
                    </div>
                  </li>
                ))}
                {billStatus === "OPEN" ? (
                  <Link href={`/mesa/${table}/cardapio`}>
                    <a>
                      <button className="bt-type-2">ADICIONAR + ITENS</button>
                    </a>
                  </Link>
                ) : (
                  <>
                    <div className={styles.notification}>
                      Conta da mesa encerrada
                    </div>
                    <div className={styles.notification}>
                      Aguarde o garçom ir até sua mesa para fechar a conta.
                    </div>
                  </>
                )}
              </div>
            </ul>

            <div id={styles.bts_total}>
              <button
                className={billStatus === "ENCERRADO" && styles.close_bill}
                onClick={() => setTotalWindow("individual")}
              >
                CONTA INDIVIDUAL
              </button>
              <button
                className={billStatus === "ENCERRADO" && styles.close_bill}
                onClick={() => setTotalWindow("all")}
              >
                CONTA DA MESA
              </button>
            </div>
            {totalWindow && (
              <div
                onClick={() => setTotalWindow(null)}
                id={styles.total_Window}
                className="grid-center-center full-window background-blur-1px"
              >
                <Detalhes
                  setbillStatus={setbillStatus}
                  billStatus={billStatus}
                  setTotalWindow={setTotalWindow}
                  bill={bill}
                >
                  {totalWindow === "individual" ? total.mysub : total.mesasub}
                </Detalhes>
              </div>
            )}
          </>
        ) : (
          <div className="grid-center-center full-window">
            <div id={styles.bill_empty} className="text-align-center">
              <h2>Ainda não tem nenhum pedido realizado</h2>
              <Link href={`/mesa/${table}/cardapio`}>
                <a>
                  <button>FAZER PEDIDO</button>
                </a>
              </Link>
              <a>
                <button id="bt-close-bill">FECHAR CONTA</button>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  else return <Loading />;
}
