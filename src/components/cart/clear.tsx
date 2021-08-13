import { AppName } from "../../config";
import getItems from "./getCartItem";

export default async function clearCart() {
  const CartItems = await getItems();

  CartItems.map((item) => {
    document.cookie = `${AppName}_CartItem_${item.order}={}; expires=Thu, 18 Dec 2013 12:00:00 UTC;`;
  });
}
