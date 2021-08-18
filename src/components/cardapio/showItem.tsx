import { useSendItemtoCart } from "../../context/CartContext";
import Price from "../_extra/price";
import style from "../../css/components/cardapio/showItem.module.css";

export default function ShowItem({ item }) {
  const { setsendtoCart } = useSendItemtoCart();

  const sendItemToCart = (event: React.MouseEvent<HTMLElement>) => {
    setsendtoCart(item);
    history.pushState(null, null, `cardapio/item/${item.id}`);
  };

  return (
    <li className={style.showItem} onClick={sendItemToCart}>
      <div>
        <span>{item.nome}</span>
        <span>
          <Price>{item.preco}</Price>
        </span>
        <div>{item.descricao}</div>
      </div>
      <img height="50px" src={"/fotos/" + item.foto} alt="imagem" />
    </li>
  );
}
