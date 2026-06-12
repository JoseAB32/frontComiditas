import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginUser } = useAuth();
  const [email, setEmail] = useState("admin@catalogo.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/catalogo";

  if (isAuthenticated) {
    return <Navigate to="/catalogo" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setIsLoading(true);
      await loginUser({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError, "No se pudo iniciar sesión. Revisa que el backend esté encendido."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Seo
        title="Entrar"
        description="Inicio de sesión para revisar y administrar el catálogo de comida."
      />

      <section className="container auth-grid">
        <div className="auth-info">
          <p className="section-kicker">Acceso</p>
          <h1>Entra al menú privado.</h1>
          <p>
            Puedes usar una cuenta de prueba o crear una cuenta nueva como cliente.
          </p>

          <div className="credentials-box">
            <strong>Cuentas rápidas</strong>
            <span>Encargado: admin@catalogo.com / admin123</span>
            <span>Cliente: usuario@catalogo.com / usuario123</span>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Iniciar sesión</h2>
          <p>Ingresa tus datos para ver la carta.</p>

          {error && <StatusMessage type="error">{error}</StatusMessage>}

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu-correo@email.com"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
            />
          </div>

          <button className="btn btn-primary full" type="submit" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>

          <Link className="plain-link" to="/registro">
            Crear cuenta nueva
          </Link>
        </form>
      </section>
    </main>
  );
}
