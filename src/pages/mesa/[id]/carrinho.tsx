import { useEffect } from "react";

export default function Carrinho() {
  useEffect(() => {
    window.location.href = "./cardapio";
  }, []);

  return null;
}
