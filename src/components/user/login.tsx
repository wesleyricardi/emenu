import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useAuthentication } from "../../context/AuthContext";

import styles from "../../css/components/user/index.module.css";

export default function ComponentLogin({
  redirect = false,
  setLoginWindow,
}: {
  redirect?: boolean;
  setLoginWindow?: any;
}) {
  const { register, handleSubmit } = useForm();
  const { login } = useAuthentication();

  const handleLogin = async ({ email, senha }) => {
    const isAuthenticated = await login({ email, senha }, redirect);
    if (isAuthenticated) {
      if (setLoginWindow) setLoginWindow(false);
    } else {
      alert("E-mail ou senha invalido");
    }
  };

  function BackArrow() {
    if (setLoginWindow)
      return (
        <span onClick={() => setLoginWindow(false)} id="backArrow">
          <img src="/images/arrow.png" alt="flecha de voltar" />
        </span>
      );
    else return null;
  }

  return (
    <section id={styles.user} onClick={(e) => e.stopPropagation()}>
      <BackArrow />
      <h1>FAÇA LOGIN PARA CONTINUAR</h1>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div>
          <input
            {...register("email")}
            required
            type="text"
            name="email"
            id="input_login"
            placeholder=" "
          />
          <label htmlFor="input_login">Login ou E-mail</label>
        </div>
        <div>
          <input
            {...register("senha")}
            required
            type="password"
            name="senha"
            id="input_senha"
            placeholder=" "
          />
          <label htmlFor="input_senha">Senha</label>
        </div>

        <Link href="/">
          <a>Esqueceu a senha?</a>
        </Link>

        <div className={styles.toggle_bt}>
          <Link href="/user/cadastro">
            <a>Cadastro</a>
          </Link>
        </div>

        <button>LOGIN</button>
      </form>
    </section>
  );
}
