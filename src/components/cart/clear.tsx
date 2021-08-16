import { AppName } from "../../config/index.json";
import getItems from "./getCartItem";

export default async function clearCart() {
  const CartItems = await getItems();

  CartItems.map((item) => {
    document.cookie = `${AppName}_CartItem_${item.order}={}; expires=Thu, 18 Dec 2013 12:00:00 UTC;`;
  });
}
