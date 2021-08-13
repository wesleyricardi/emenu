import { useEffect, useState } from "react";
import { API } from "../../config";
import Price from "../_extra/price";

export default function Detalhes({
  children,
  bill,
  setTotalWindow,
  setbillStatus,
  billStatus,
}) {
  const [ServiceTax, setServiceTax] = useState<number | null>(null);

  useEffect(() => {
    async function getServiceTax() {
      const req = await fetch(`${API}/api/taxa_de_servico`);
      const { service_tax } = await req.json();
      setServiceTax(service_tax);
    }
    getServiceTax();
  }, []);

  async function requestClosingBill() {
    const req = await fetch(`${API}/api/solicitarfechamento`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ bill }),
    });
    const { code } = await req.json();

    if (code && code === 201) {
      setTotalWindow(null);
      setbillStatus("ENCERRADO");
    } else {
      alert("falha ao solicitar fechamento");
    }
  }

  return (
    ServiceTax && (
      <div onClick={(e) => e.stopPropagation()}>
        <span>
          Sub total:{" "}
          <span>
            <Price>{children}</Price>
          </span>
        </span>
        <span>
          Taxa de serviço ({ServiceTax}%):{" "}
          <span className="preco">
            <Price>{children * (ServiceTax / 100)}</Price>
          </span>
        </span>
        <span>
          Total:{" "}
          <span className="preco">
            <Price>{children * (ServiceTax / 100 + 1)}</Price>
          </span>
        </span>
        {billStatus === "OPEN" ? (
          <button onClick={requestClosingBill}>SOLICITAR FECHAMENTO</button>
        ) : (
          <b>Conta encerrada.</b>
        )}
      </div>
    )
  );
}
