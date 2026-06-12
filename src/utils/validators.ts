import type { FoodFormValues } from "../interfaces/food.interface";

export type LoginField = "email" | "password";
export type LoginErrors = Partial<Record<LoginField, string>>;

export type RegisterField = "fullName" | "email" | "password" | "confirmPassword";
export type RegisterErrors = Partial<Record<RegisterField, string>>;

export type FoodFormErrors = Partial<Record<keyof FoodFormValues, string>>;

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string) {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return "El correo es obligatorio.";
  }

  if (!emailPattern.test(cleanValue)) {
    return "Ingresa un correo válido.";
  }

  return "";
}

export function validatePassword(value: string) {
  if (!value.trim()) {
    return "La contraseña es obligatoria.";
  }

  if (value.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  return "";
}

export function validateLogin(values: { email: string; password: string }): LoginErrors {
  const errors: LoginErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateRegister(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "El nombre completo es obligatorio.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres.";
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Confirma tu contraseña.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
}

function validateUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  return /^(https?:\/\/|\/images\/|\/src\/assets\/).+/i.test(value.trim());
}

export function validateFoodForm(values: FoodFormValues): FoodFormErrors {
  const errors: FoodFormErrors = {};
  const price = Number(values.price);
  const rating = Number(values.rating);
  const preparationTime = Number(values.preparationTime);

  if (!values.name.trim()) {
    errors.name = "El nombre del plato es obligatorio.";
  } else if (values.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!values.category.trim()) {
    errors.category = "Selecciona una categoría.";
  }

  if (!values.price) {
    errors.price = "El precio es obligatorio.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = "El precio debe ser mayor a 0.";
  }

  if (!values.rating) {
    errors.rating = "La calificación es obligatoria.";
  } else if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = "La calificación debe estar entre 1 y 5.";
  }

  if (!values.preparationTime) {
    errors.preparationTime = "El tiempo es obligatorio.";
  } else if (Number.isNaN(preparationTime) || preparationTime < 1) {
    errors.preparationTime = "El tiempo debe ser mayor a 0 minutos.";
  }

  if (!values.description.trim()) {
    errors.description = "La descripción es obligatoria.";
  } else if (values.description.trim().length < 10) {
    errors.description = "La descripción debe tener al menos 10 caracteres.";
  }

  if (!validateUrl(values.imageUrl)) {
    errors.imageUrl = "Usa una URL válida o una ruta como /images/plato.jpg.";
  }

  return errors;
}
