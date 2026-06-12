import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main>
      <Seo
        title="Inicio"
        description="Comiditas Jose, catálogo digital de platos, bebidas y precios para revisar el menú desde cualquier dispositivo."
      />

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="section-kicker">Catalogo de comida</p>
            <h1>Revisa la carta antes de pedir.</h1>
            <p>
              Platos fuertes, bebidas y opciones rápidas en un catálogo perfecto de comida. Entra al menú,
               y encuentra los mejores platos.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary" to={isAuthenticated ? "/catalogo" : "/login"}>
                Ver menú
              </Link>
              <Link className="btn btn-light" to="/registro">
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="hero-menu-note" aria-label="Especial de la casa">
            <span className="menu-note-label">PLATO ESTRELLA</span>
            <h2>Pique macho</h2>
            <p>Carne, papa, huevo, chorizo, cebolla y tomate.</p>
            <div className="note-price">
              <strong>Bs 38</strong>
              <span>25 min aprox.</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
