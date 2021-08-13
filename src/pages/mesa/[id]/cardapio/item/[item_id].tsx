import { useEffect } from "react";

export default function Item() {
  useEffect(() => {
    window.location.href = "../../cardapio";
  }, []);

  return null;
}
