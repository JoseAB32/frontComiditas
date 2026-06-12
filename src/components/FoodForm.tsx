import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FoodFormValues, FoodItem } from "../interfaces/food.interface";
import type { FoodFormErrors } from "../utils/validators";
import { validateFoodForm } from "../utils/validators";

interface FoodFormProps {
  selectedFood: FoodItem | null;
  onSubmit: (values: FoodFormValues) => Promise<void>;
  onCancel: () => void;
}

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

const touchedInitialState: Record<keyof FoodFormValues, boolean> = {
  name: false,
  category: false,
  price: false,
  description: false,
  imageUrl: false,
  rating: false,
  preparationTime: false,
  isAvailable: false
};

const allTouchedState: Record<keyof FoodFormValues, boolean> = {
  name: true,
  category: true,
  price: true,
  description: true,
  imageUrl: true,
  rating: true,
  preparationTime: true,
  isAvailable: true
};

export default function FoodForm({ selectedFood, onSubmit, onCancel }: FoodFormProps) {
  const [values, setValues] = useState<FoodFormValues>(initialValues);
  const [touched, setTouched] = useState<Record<keyof FoodFormValues, boolean>>(touchedInitialState);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formTitle = useMemo(() => selectedFood ? "Editar plato" : "Agregar plato", [selectedFood]);
  const errors = useMemo(() => validateFoodForm(values), [values]);

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
      setTouched(touchedInitialState);
      setWasSubmitted(false);
      return;
    }

    setValues(initialValues);
    setTouched(touchedInitialState);
    setWasSubmitted(false);
  }, [selectedFood]);

  function shouldShowError(field: keyof FoodFormValues) {
    return Boolean(errors[field] && (touched[field] || wasSubmitted));
  }

  function markAsTouched(field: keyof FoodFormValues) {
    setTouched((current) => ({
      ...current,
      [field]: true
    }));
  }

  function updateValue(field: keyof FoodFormValues, value: string | boolean) {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleTextChange(field: keyof FoodFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      updateValue(field, event.target.value);
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWasSubmitted(true);
    setTouched(allTouchedState);

    const currentErrors: FoodFormErrors = validateFoodForm(values);

    if (Object.keys(currentErrors).length > 0) {
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
            onChange={handleTextChange("name")}
            onBlur={() => markAsTouched("name")}
            placeholder="Ej. Pique macho"
            aria-invalid={shouldShowError("name")}
            aria-describedby={shouldShowError("name") ? "name-error" : undefined}
          />
          {shouldShowError("name") && <small id="name-error">{errors.name}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleTextChange("category")}
            onBlur={() => markAsTouched("category")}
            aria-invalid={shouldShowError("category")}
            aria-describedby={shouldShowError("category") ? "category-error" : undefined}
          >
            <option value="">Seleccionar</option>
            <option value="Entrada">Entrada</option>
            <option value="Plato fuerte">Plato fuerte</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Especial">Especial</option>
          </select>
          {shouldShowError("category") && <small id="category-error">{errors.category}</small>}
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
            onChange={handleTextChange("price")}
            onBlur={() => markAsTouched("price")}
            placeholder="35"
            aria-invalid={shouldShowError("price")}
            aria-describedby={shouldShowError("price") ? "price-error" : undefined}
          />
          {shouldShowError("price") && <small id="price-error">{errors.price}</small>}
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
            onChange={handleTextChange("rating")}
            onBlur={() => markAsTouched("rating")}
            aria-invalid={shouldShowError("rating")}
            aria-describedby={shouldShowError("rating") ? "rating-error" : undefined}
          />
          {shouldShowError("rating") && <small id="rating-error">{errors.rating}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="preparationTime">Tiempo de preparación</label>
          <input
            id="preparationTime"
            name="preparationTime"
            type="number"
            min="1"
            value={values.preparationTime}
            onChange={handleTextChange("preparationTime")}
            onBlur={() => markAsTouched("preparationTime")}
            aria-invalid={shouldShowError("preparationTime")}
            aria-describedby={shouldShowError("preparationTime") ? "time-error" : undefined}
          />
          {shouldShowError("preparationTime") && <small id="time-error">{errors.preparationTime}</small>}
        </div>

        <div className="form-field">
          <label htmlFor="imageUrl">Imagen</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={values.imageUrl}
            onChange={handleTextChange("imageUrl")}
            onBlur={() => markAsTouched("imageUrl")}
            placeholder="https://... o /images/plato.jpg"
            aria-invalid={shouldShowError("imageUrl")}
            aria-describedby={shouldShowError("imageUrl") ? "image-error" : undefined}
          />
          {shouldShowError("imageUrl") && <small id="image-error">{errors.imageUrl}</small>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleTextChange("description")}
          onBlur={() => markAsTouched("description")}
          placeholder="Describe ingredientes, porción o presentación."
          aria-invalid={shouldShowError("description")}
          aria-describedby={shouldShowError("description") ? "description-error" : undefined}
        />
        {shouldShowError("description") && <small id="description-error">{errors.description}</small>}
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
