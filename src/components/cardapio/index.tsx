import styles from "../../css/components/cardapio/index.module.css";
import ShowItem from "./showItem";

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
        <section id={`category_${category.id}`} key={key}>
          <h3 onClick={SlideDown}>{category.nome}</h3>
          <ul>
            {items.map(
              (item, k) =>
                item.categoria === category.id && (
                  <ShowItem item={item} key={k} />
                )
            )}
          </ul>
        </section>
      ))}
    </main>
  );
}
