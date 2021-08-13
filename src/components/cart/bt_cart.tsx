import styles from "../../css/components/cart/bt_cart.module.css";

export default function CartButton({
  CartAmout,
  setStep,
}: {
  CartAmout: number;
  setStep: any;
}) {
  return (
    <div onClick={() => setStep(2)} id={styles.cartButton}>
      <h3>Ver Carrinho</h3>
      Você possui {CartAmout} items já adicionados
    </div>
  );
}
