import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logoutUser } = useAuth();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Navegación principal">
        <Link to="/" className="brand" aria-label="Ir al inicio de Comiditas Jose">
          <span className="brand-mark">CJ</span>
          <span>Comiditas Jose</span>
        </Link>

        <div className="nav-links">
          <NavLink end to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Inicio
          </NavLink>

          {isAuthenticated && (
            <NavLink end to="/catalogo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Menú
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/catalogo/nuevo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Agregar plato
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Usuarios
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <button className="btn btn-ghost" type="button" onClick={handleLogout}>
              Salir
            </button>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Log In
              </Link>
              <Link className="btn btn-primary" to="/registro">
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
