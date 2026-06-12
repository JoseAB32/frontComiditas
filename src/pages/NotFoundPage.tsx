import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <Seo
        title="Página no encontrada"
        description="La página solicitada no existe en el catálogo de comida."
      />
      <section className="container not-found-card">
        <h1>Esta página no está en la carta.</h1>
        <p>Vuelve al inicio o revisa el menú principal.</p>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
