import { API, AppName } from "../../config";

interface Item {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  foto: string;

  quantidade: number;
  observacao: string;
  order: string;
}

export default async function getItems() {
  if (document.cookie) {
    const req = await fetch(`${API}/api/all-items`);
    const items: [Item] = await req.json();

    const Cookies: string[] = document.cookie.split(";");
    let i = 0;
    const Cart = Cookies.reduce(
      (prev: [Item] | [null], Cookie: string) => {
        //replace remove espaço, por alguma razao que ainda desconheço apartir
        //do segundo elemento da array Cookies, o id do cookie começa com espaço
        const CookieName = Cookie.split("=")[0].replace(/\s/g, "");

        const CartItemName = `${AppName}_CartItem_`;
        if (CookieName.slice(0, CartItemName.length) === CartItemName) {
          const CookieValue: Item = JSON.parse(Cookie.split("=")[1]);
          items.map((item) => {
            if (item.id === CookieValue.id) {
              prev[i] = {
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                descricao: item.descricao,
                foto: item.foto,
                quantidade: CookieValue.quantidade,
                observacao: CookieValue.observacao,
                order: CookieValue.order,
              };
            }
          });
          i++;
        }
        return prev;
      },
      [null]
    );

    if (Cart[0]) return Cart;
    else return null;
  } else return null;
}
