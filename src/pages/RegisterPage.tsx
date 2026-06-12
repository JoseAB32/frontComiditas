import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, registerUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/catalogo" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (fullName.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({ fullName, email, password });
      navigate("/catalogo", { replace: true });
    } catch (registerError) {
      setError(getErrorMessage(registerError, "No se pudo crear la cuenta. Revisa que el backend esté encendido."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Seo
        title="Registro"
        description="Registro de clientes para ingresar al catálogo de comida."
      />

      <section className="container auth-grid compact-auth">
        <div className="auth-info">
          <p className="section-kicker">Cuenta nueva</p>
          <h1>Regístrate como cliente.</h1>
          <p>
            La cuenta se registra en la API y queda lista para iniciar sesión como cliente.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Crear cuenta</h2>
          <p>Completa tus datos principales.</p>

          {error && <StatusMessage type="error">{error}</StatusMessage>}

          <div className="form-field">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Ej. Juan Perez"
            />
          </div>

          <div className="form-field">
            <label htmlFor="registerEmail">Correo electrónico</label>
            <input
              id="registerEmail"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu-correo@email.com"
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="registerPassword">Contraseña</label>
              <input
                id="registerPassword"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirmar</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary full" type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear cuenta"}
          </button>

          <Link className="plain-link" to="/login">
            Ya tengo cuenta
          </Link>
        </form>
      </section>
    </main>
  );
}
