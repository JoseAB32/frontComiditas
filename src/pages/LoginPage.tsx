import { useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { LoginErrors, LoginField } from "../utils/validators";
import { validateLogin } from "../utils/validators";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginUser } = useAuth();
  const [email, setEmail] = useState("admin@catalogo.com");
  const [password, setPassword] = useState("admin123");
  const [touched, setTouched] = useState<Record<LoginField, boolean>>({
    email: false,
    password: false
  });
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/catalogo";

  const values = useMemo(() => ({ email, password }), [email, password]);
  const errors = useMemo(() => validateLogin(values), [values]);

  if (isAuthenticated) {
    return <Navigate to="/catalogo" replace />;
  }

  function shouldShowError(field: LoginField) {
    return Boolean(errors[field] && (touched[field] || wasSubmitted));
  }

  function markAsTouched(field: LoginField) {
    setTouched((current) => ({
      ...current,
      [field]: true
    }));
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setError("");
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setError("");
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    markAsTouched(event.target.name as LoginField);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWasSubmitted(true);
    setTouched({ email: true, password: true });

    const currentErrors: LoginErrors = validateLogin(values);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      await loginUser({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError, "No se pudo iniciar sesión. Revisa tu correo y contraseña."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Seo
        title="Entrar"
        description="Inicio de sesión de Comiditas Jose."
      />

      <section className="container auth-grid">
        <div className="auth-info">
          <p className="section-kicker">Entrada</p>
          <h1>Entra para ver la carta.</h1>
          <p>
            Ingresa con tu correo y contraseña para continuar al menú de Comiditas Jose.
          </p>

          <div className="credentials-box">
            <strong>Accesos rápidos</strong>
            <span>Encargado: admin@catalogo.com / admin123</span>
            <span>Cliente: usuario@catalogo.com / usuario123</span>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Iniciar sesión</h2>
          <p>Bienvenido de nuevo.</p>

          {error && <StatusMessage type="error">{error}</StatusMessage>}

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="tu-correo@email.com"
              aria-invalid={shouldShowError("email")}
              aria-describedby={shouldShowError("email") ? "email-error" : undefined}
            />
            {shouldShowError("email") && <small id="email-error">{errors.email}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handleBlur}
              placeholder="Tu contraseña"
              aria-invalid={shouldShowError("password")}
              aria-describedby={shouldShowError("password") ? "password-error" : undefined}
            />
            {shouldShowError("password") && <small id="password-error">{errors.password}</small>}
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
