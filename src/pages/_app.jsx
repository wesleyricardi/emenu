import AuthProvider from "../context/AuthContext";
import BillProvider from "../context/BillContext";
import CartProvider from "../context/CartContext";
import "../css/global.css";
import "../css/form.css";
import "../css/extra.css";
import "../css/config/paleta.css";
import "../css/basic/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BillProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </BillProvider>
    </AuthProvider>
  );
}

export default MyApp;
