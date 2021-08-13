import Link from "next/link";
import { useForm } from "react-hook-form";
import { API } from "../../config";
import { useAuthentication } from "../../context/AuthContext";

import styles from "../../css/components/user/index.module.css";

export default function Register({
  redirect = false,
  setRegisterWindow,
}: {
  redirect?: boolean;
  setRegisterWindow?: any;
}) {
  const { register, handleSubmit } = useForm();
  const { login } = useAuthentication();

  const handleRegister = async ({ nome, email, cpf, senha, repitasenha }) => {
    if (repitasenha === senha) {
      const req = await fetch(`${API}/api/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ nome, email, cpf, senha }),
      });
      const { code } = await req.json();
      if (code === 201) {
        login({ email, senha }, redirect);
        if (setRegisterWindow) setRegisterWindow(false);
      } else if (code === 1062) {
        alert("E-mail ou CPF já possuem cadastro, tente recuperar a senha");
      } else {
        alert("Algo deu errado... entre em contato com suporte");
      }
    } else alert("Senhas não combinam");
  };

  const checkpassword = (e: any) => {
    const passrepeated = e.target.value;
    const pass = (document.getElementById("input_senha") as HTMLInputElement)
      .value;
    if (pass !== passrepeated) {
      e.target.setCustomValidity("Senhas devem combinar");
    } else {
      e.target.setCustomValidity("");
    }
  };

  function BackArrow() {
    if (setRegisterWindow)
      return (
        <span onClick={() => setRegisterWindow(false)} id="backArrow">
          <img src="/images/arrow.png" alt="flecha de voltar" />
        </span>
      );
    else return null;
  }

  return (
    <section id={styles.user} onClick={(e) => e.stopPropagation()}>
      <BackArrow />
      <h1>FAÇA CADASTRO PARA CONTINUAR</h1>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div>
          <input
            {...register("nome")}
            required
            type="text"
            name="nome"
            id="input_nome"
            placeholder=" "
          />
          <label htmlFor="input_nome">Nome completo</label>
        </div>
        <div>
          <input
            {...register("email")}
            required
            type="email"
            name="email"
            id="input_email"
            placeholder=" "
          />
          <label htmlFor="input_email">E-mail</label>
        </div>
        <div>
          <input
            {...register("cpf")}
            required
            type="text"
            name="cpf"
            id="input_cpf"
            placeholder=" "
          />
          <label htmlFor="input_cpf">CPF</label>
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
        <div>
          <input
            {...register("repitasenha")}
            onChange={checkpassword}
            required
            type="password"
            name="repitasenha"
            id="input_repitasenha"
            placeholder=" "
          />
          <label htmlFor="input_repitasenha">Repita Senha</label>
        </div>

        <div className={styles.toggle_bt}>
          <Link href="/user/login">
            <a>Voltar para login</a>
          </Link>
        </div>

        <button>CADASTRAR</button>
      </form>
    </section>
  );
}
