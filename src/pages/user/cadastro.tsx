import ComponentCadastro from "../../components/user/cadastro";

export default function Cadastro() {
  return (
    <main id="background">
      <div className="grid-center-center full-window background-blur-1px">
        <ComponentCadastro redirect={true} />
      </div>
    </main>
  );
}
