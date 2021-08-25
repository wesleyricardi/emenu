import { useEffect, useState } from "react";
import style from "../../css/components/cardapio/menu.module.css";
import ShowItem from "./showItem";
import { RestaurantName } from "../../config/index.json";
import Link from "next/link";

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

export default function Menu({ items, categories }: Props) {
  const [searchResult, setsearchResult] = useState(null);

  useEffect(() => {
    var scrollPos = 0;
    if (categories) {
      window.addEventListener("scroll", async () => {
        categories.find((category, key) => {
          const html = document.querySelector("html");
          const nav_top = document.getElementById("nav_top");
          const menu_top = document.getElementById("menu-top");
          const section = document.getElementById(`category_${category.id}`);
          const li = document.getElementById(`menu_category_${category.id}`);
          const search_container = document.getElementById("search-container");
          setsearchResult(null);

          if (html.scrollTop < 100) nav_top.style.opacity = "0";
          else nav_top.style.opacity = "1";

          if (
            html.scrollTop < scrollPos &&
            search_container.style.maxHeight !== "100px"
          ) {
            search_container.style.opacity = "1";
            search_container.style.maxHeight = "100px";
          }

          if (
            html.scrollTop > scrollPos &&
            search_container.style.maxHeight !== "0"
          ) {
            search_container.style.maxHeight = "0";
            search_container.style.opacity = "0";
          }

          scrollPos = html.scrollTop;

          if (
            html.scrollTop >= section.offsetTop - 400 &&
            html.scrollTop <= section.offsetHeight + section.offsetTop - 400
          ) {
            if (li.className !== style.watching) li.className = style.watching;

            if (menu_top.scrollLeft !== li.offsetLeft)
              menu_top.scroll({ left: li.offsetLeft, behavior: "smooth" });

            return;
          } else {
            if (li.className !== "") li.className = "";
          }
        });
      });
      return () => {
        window.removeEventListener;
      };
    }
  }, []);

  function scroll(e) {
    const section = document.getElementById(e.target.id.slice(5));
    document.querySelector("html").scrollTo(0, section.offsetTop - 400);
  }

  function doSearch(e) {
    if (e.target.value.length >= 1) {
      const result = items.filter((Item) => {
        if (
          Item.nome.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1
        ) {
          return Item;
        }
      });
      setsearchResult(result);
    } else {
      setsearchResult(null);
    }
  }

  return (
    <nav id="nav_top" style={{ opacity: "0" }} className={style.menu_top}>
      <div id="search-container" style={{ maxHeight: "50px", opacity: "1" }}>
        <span>
          <h3>{RestaurantName}</h3>
        </span>
        <label htmlFor="search">
          <img src="/png/search.png" alt="search-icon" />
        </label>

        <input
          onChange={doSearch}
          type="text"
          name="search"
          id="search"
          placeholder="Pesquisa"
        />
        {searchResult && (
          <ul>
            {searchResult.map((result, key) => (
              <ShowItem item={result} key={key} />
            ))}
          </ul>
        )}
        <span>
          <Link href={`pedidos`}>
            <img src="/images/bill.png" alt="" />
          </Link>
        </span>
      </div>
      <div id="menu-top">
        <ul>
          {categories.map((category, key) => (
            <li onClick={scroll} id={`menu_category_${category.id}`} key={key}>
              {category.nome}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
