import { useEffect } from "react";

export default function Finish() {
  useEffect(() => {
    window.location.href = "../cardapio";
  }, []);

  return null;
}
