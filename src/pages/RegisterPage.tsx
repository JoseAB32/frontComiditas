import { useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { RegisterErrors, RegisterField } from "../utils/validators";
import { validateRegister } from "../utils/validators";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, registerUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<RegisterField, boolean>>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const values = useMemo(() => ({
    fullName,
    email,
    password,
    confirmPassword
  }), [fullName, email, password, confirmPassword]);

  const errors = useMemo(() => validateRegister(values), [values]);

  if (isAuthenticated) {
    return <Navigate to="/catalogo" replace />;
  }

  function shouldShowError(field: RegisterField) {
    return Boolean(errors[field] && (touched[field] || wasSubmitted));
  }

  function markAsTouched(field: RegisterField) {
    setTouched((current) => ({
      ...current,
      [field]: true
    }));
  }

  function handleTextChange(field: RegisterField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setError("");

      if (field === "fullName") {
        setFullName(value);
      }

      if (field === "email") {
        setEmail(value);
      }

      if (field === "password") {
        setPassword(value);
      }

      if (field === "confirmPassword") {
        setConfirmPassword(value);
      }
    };
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    markAsTouched(event.target.name as RegisterField);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWasSubmitted(true);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const currentErrors: RegisterErrors = validateRegister(values);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      await registerUser({ fullName: fullName.trim(), email: email.trim(), password });
      navigate("/catalogo", { replace: true });
    } catch (registerError) {
      setError(getErrorMessage(registerError, "No se pudo crear la cuenta. Intenta con otro correo."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Seo
        title="Registro"
        description="Registro de clientes para Comiditas Jose."
      />

      <section className="container auth-grid compact-auth">
        <div className="auth-info">
          <p className="section-kicker">Cuenta nueva</p>
          <h1>Únete a Comiditas Jose.</h1>
          <p>
            Crea tu cuenta para entrar al menú y revisar la carta cuando quieras.
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
              onChange={handleTextChange("fullName")}
              onBlur={handleBlur}
              placeholder="Ej. Juan Perez"
              aria-invalid={shouldShowError("fullName")}
              aria-describedby={shouldShowError("fullName") ? "full-name-error" : undefined}
            />
            {shouldShowError("fullName") && <small id="full-name-error">{errors.fullName}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="registerEmail">Correo electrónico</label>
            <input
              id="registerEmail"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleTextChange("email")}
              onBlur={handleBlur}
              placeholder="tu-correo@email.com"
              aria-invalid={shouldShowError("email")}
              aria-describedby={shouldShowError("email") ? "register-email-error" : undefined}
            />
            {shouldShowError("email") && <small id="register-email-error">{errors.email}</small>}
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
                onChange={handleTextChange("password")}
                onBlur={handleBlur}
                aria-invalid={shouldShowError("password")}
                aria-describedby={shouldShowError("password") ? "register-password-error" : undefined}
              />
              {shouldShowError("password") && <small id="register-password-error">{errors.password}</small>}
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirmar</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleTextChange("confirmPassword")}
                onBlur={handleBlur}
                aria-invalid={shouldShowError("confirmPassword")}
                aria-describedby={shouldShowError("confirmPassword") ? "confirm-password-error" : undefined}
              />
              {shouldShowError("confirmPassword") && <small id="confirm-password-error">{errors.confirmPassword}</small>}
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
