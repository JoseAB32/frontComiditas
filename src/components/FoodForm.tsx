import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { FoodFormValues, FoodItem } from "../interfaces/food.interface";

interface FoodFormProps {
  selectedFood: FoodItem | null;
  onSubmit: (values: FoodFormValues) => Promise<void>;
  onCancel: () => void;
}

type FormErrors = Partial<Record<keyof FoodFormValues, string>>;

const initialValues: FoodFormValues = {
  name: "",
  category: "",
  price: "",
  description: "",
  imageUrl: "",
  rating: "4.5",
  preparationTime: "20",
  isAvailable: true
};

function validateUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  return /^(https?:\/\/|\/images\/|\/src\/assets\/).+/i.test(value.trim());
}

export default function FoodForm({ selectedFood, onSubmit, onCancel }: FoodFormProps) {
  const [values, setValues] = useState<FoodFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const formTitle = useMemo(() => selectedFood ? "Editar plato" : "Agregar plato", [selectedFood]);

  useEffect(() => {
    if (selectedFood) {
      setValues({
        name: selectedFood.name,
        category: selectedFood.category,
        price: String(selectedFood.price),
        description: selectedFood.description,
        imageUrl: selectedFood.imageUrl,
        rating: String(selectedFood.rating),
        preparationTime: String(selectedFood.preparationTime),
        isAvailable: selectedFood.isAvailable
      });
      setErrors({});
      return;
    }

    setValues(initialValues);
    setErrors({});
  }, [selectedFood]);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (values.name.trim().length < 3) {
      nextErrors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (values.category.trim().length < 3) {
      nextErrors.category = "Selecciona una categoría.";
    }

    if (!values.price || Number(values.price) <= 0) {
      nextErrors.price = "El precio debe ser mayor a 0.";
    }

    if (values.description.trim().length < 10) {
      nextErrors.description = "La descripción debe tener al menos 10 caracteres.";
    }

    if (!validateUrl(values.imageUrl)) {
      nextErrors.imageUrl = "Usa una URL válida o una ruta como /images/mi-imagen.jpg.";
    }

    if (!values.rating || Number(values.rating) < 1 || Number(values.rating) > 5) {
      nextErrors.rating = "La calificación debe estar entre 1 y 5.";
    }

    if (!values.preparationTime || Number(values.preparationTime) < 1) {
      nextErrors.preparationTime = "El tiempo debe ser mayor a 0 minutos.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function updateValue(field: keyof FoodFormValues, value: string | boolean) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="food-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <div>
          <p className="section-kicker">Plato del menú</p>
          <h2>{formTitle}</h2>
        </div>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Volver
        </button>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Nombre del plato</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="Ej. Pique macho"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <small id="name-error">{errors.name}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={(event) => updateValue("category", event.target.value)}
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            <option value="">Seleccionar</option>
            <option value="Entrada">Entrada</option>
            <option value="Plato fuerte">Plato fuerte</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Especial">Especial</option>
          </select>
          {errors.category && <small id="category-error">{errors.category}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="price">Precio en Bs</label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="0.5"
            value={values.price}
            onChange={(event) => updateValue("price", event.target.value)}
            placeholder="35"
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {errors.price && <small id="price-error">{errors.price}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="rating">Calificación</label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={values.rating}
            onChange={(event) => updateValue("rating", event.target.value)}
            aria-describedby={errors.rating ? "rating-error" : undefined}
          />
          {errors.rating && <small id="rating-error">{errors.rating}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="preparationTime">Tiempo de preparación</label>
          <input
            id="preparationTime"
            name="preparationTime"
            type="number"
            min="1"
            value={values.preparationTime}
            onChange={(event) => updateValue("preparationTime", event.target.value)}
            aria-describedby={errors.preparationTime ? "time-error" : undefined}
          />
          {errors.preparationTime && <small id="time-error">{errors.preparationTime}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="imageUrl">Imagen</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={values.imageUrl}
            onChange={(event) => updateValue("imageUrl", event.target.value)}
            placeholder="https://... o /images/plato.jpg"
            aria-describedby={errors.imageUrl ? "image-error" : undefined}
          />
          {errors.imageUrl && <small id="image-error">{errors.imageUrl}</small>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          placeholder="Describe ingredientes, porción o presentación."
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && <small id="description-error">{errors.description}</small>}
      </div>

      <label className="checkbox-field" htmlFor="isAvailable">
        <input
          id="isAvailable"
          name="isAvailable"
          type="checkbox"
          checked={values.isAvailable}
          onChange={(event) => updateValue("isAvailable", event.target.checked)}
        />
        Mantener este plato en la carta
      </label>

      <button className="btn btn-primary full" type="submit" disabled={isSaving}>
        {isSaving ? "Guardando..." : selectedFood ? "Guardar cambios" : "Guardar plato"}
      </button>
    </form>
  );
}
