import { useSendItemtoCart } from "../../context/CartContext";
import styles from "../../css/components/cardapio/index.module.css";
import Price from "../_extra/price";

type Props = {
  items: [Itens];
  categories: [Categories];
};

interface Categories {
  id: number;
  nome: string;
}

interface Itens {
  id: string;
  nome: string;
  disponibilidade: number;
  categoria: number;
  preco: number;
  descricao: string;
  foto: string;
}

export default function Cardapio({ items, categories }: Props) {
  const { setsendtoCart } = useSendItemtoCart();

  const sendItemToCart = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as Element;

    let id_item = target.id.substring(5);
    if (!id_item)
      id_item = (target.parentNode.parentNode as Element).id.substring(5);
    if (!id_item) id_item = (target.parentNode as Element).id.substring(5);

    items.filter((item) => {
      if (item.id == id_item) {
        setsendtoCart(item);
        history.pushState(null, null, `cardapio/item/${item.id}`);
        return;
      }
    });
  };

  async function SlideDown(event: React.MouseEvent<HTMLElement>) {
    const target = event.target as Element;

    const section = target.parentElement;

    if (!section.style.maxHeight)
      section.style.maxHeight = section.offsetHeight + "px";

    if (section.style.maxHeight === "40.8px") {
      (section.children[1] as HTMLElement).style.display = "block";
      section.style.maxHeight = section.style.height;
    } else {
      section.style.height = section.offsetHeight + "px";
      section.style.maxHeight = "40.8px";
      await new Promise((r) => setTimeout(r, 300));
      (section.children[1] as HTMLElement).style.display = "none";
    }
  }

  return (
    <main id={styles.cardapio}>
      {categories.map((category, key) => (
        <section key={key}>
          <h3 onClick={SlideDown}>{category.nome}</h3>
          <ul>
            {items.map(
              (item, k) =>
                item.categoria === category.id && (
                  <li onClick={sendItemToCart} id={"item_" + item.id} key={k}>
                    <div>
                      <span>{item.nome}</span>
                      <span>
                        <Price>{item.preco}</Price>
                      </span>
                      <div>{item.descricao}</div>
                    </div>
                    <img
                      height="50px"
                      src={"/fotos/" + item.foto}
                      alt="imagem"
                    />
                  </li>
                )
            )}
          </ul>
        </section>
      ))}
    </main>
  );
}
