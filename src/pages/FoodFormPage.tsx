import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodForm from "../components/FoodForm";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import type { FoodFormValues, FoodItem } from "../interfaces/food.interface";
import { createFood, getFoodById, updateFood } from "../services/foodService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function FoodFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editId = id ? Number(id) : null;
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFood() {
      if (!editId) {
        return;
      }

      try {
        setIsLoading(true);
        const food = await getFoodById(editId);

        if (!food) {
          setError("No se encontró el plato seleccionado.");
          return;
        }

        setSelectedFood(food);
      } catch (loadError) {
        setError(getErrorMessage(loadError, "No se pudo cargar el plato."));
      } finally {
        setIsLoading(false);
      }
    }

    loadFood();
  }, [editId]);

  async function handleSubmit(values: FoodFormValues) {
    try {
      setError("");

      if (editId) {
        await updateFood(editId, values);
        navigate("/catalogo", { replace: true });
        return;
      }

      await createFood(values);
      navigate("/catalogo", { replace: true });
    } catch (saveError) {
      setError(getErrorMessage(saveError, "No se pudo guardar el plato. Revisa los datos e intenta nuevamente."));
    }
  }

  return (
    <main className="form-page">
      <Seo
        title={editId ? "Editar plato" : "Agregar plato"}
        description="Formulario para agregar y editar platos de Comiditas Jose."
      />

      <section className="container form-page-grid">
        <div className="form-page-copy">
          <p className="section-kicker">Carta de la casa</p>
          <h1>{editId ? "Editar plato" : "Nuevo plato para la carta"}</h1>
          <p>
            Completa los datos del plato, su precio, presentación e imagen para mantener la carta actualizada.
          </p>
        </div>

        <div>
          {error && <StatusMessage type="error">{error}</StatusMessage>}
          {isLoading ? (
            <StatusMessage type="info">Cargando datos...</StatusMessage>
          ) : (
            <FoodForm
              selectedFood={selectedFood}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/catalogo")}
            />
          )}
        </div>
      </section>
    </main>
  );
}
