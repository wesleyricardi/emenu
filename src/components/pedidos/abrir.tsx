import { useForm } from "react-hook-form";
import { API } from "../../config/index.json";
import { useBillAuthentication } from "../../context/BillContext";

import styles from "../../css/components/pedidos/abrir&login.module.css";

export default function abrirmesa({
  table,
  statusClose,
}: {
  table: string | string[];
  statusClose?: any;
}) {
  const { loginBill } = useBillAuthentication();
  const { register, handleSubmit } = useForm();

  const handleRegister = async ({ senha, repitasenha }) => {
    if (repitasenha === senha) {
      const req = await fetch(`${API}/abrirmesa`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: table, senha }),
      });
      const { code, id: bill_id } = await req.json();
      if (code === 200) {
        loginBill({ bill_id, senha });
        if (statusClose) statusClose(false);
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

  return (
    <form
      id={styles.bill_access}
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit(handleRegister)}
    >
      <h1>Defina senha de segurança para fazer pedidos na sua mesa</h1>
      <div>
        <input
          {...register("senha")}
          type="password"
          name="senha"
          id="input_senha"
          required
          placeholder=" "
        />
        <label htmlFor="senha">Senha</label>
      </div>
      <div>
        <input
          {...register("repitasenha")}
          type="password"
          onChange={checkpassword}
          name="repitasenha"
          id="repitasenha"
          required
          placeholder=" "
        />
        <label htmlFor="repitasenha">Confirmar senha</label>
      </div>
      <button>ABRIR MESA</button>
    </form>
  );
}
