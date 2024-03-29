import { RestaurantName } from "../config/index.json";

export default function Header() {
  return (
    <header>
      <img id="logo" src="/images/logo.png" alt="Restaurante Logo" />
      <div id="banner">
        <img src="/images/banner.jpg" alt="Café da manhã" />
        <div>
          <h1>{RestaurantName}</h1>
          <p>Pode realizar o seu pedido que levaremos até sua mesa</p>
        </div>
      </div>
    </header>
  );
}
