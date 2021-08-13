import ComponentLogin from "../../components/user/login";

export default function Login() {
  return (
    <main id="background">
      <div className="grid-center-center full-window background-blur-1px">
        <ComponentLogin redirect={true} />
      </div>
    </main>
  );
}
