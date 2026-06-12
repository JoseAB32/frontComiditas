import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodForm from "../components/FoodForm";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import type { FoodFormValues, FoodItem } from "../interfaces/food.interface";
import { createFood, getFoodById, updateFood } from "../services/foodService";

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
      } catch {
        setError("No se pudo cargar el plato.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFood();
  }, [editId]);

  async function handleSubmit(values: FoodFormValues) {
    if (editId) {
      await updateFood(editId, values);
      navigate("/catalogo", { replace: true });
      return;
    }

    await createFood(values);
    navigate("/catalogo", { replace: true });
  }

  return (
    <main className="form-page">
      <Seo
        title={editId ? "Editar plato" : "Agregar plato"}
        description="Formulario de administración de platos del catálogo de comida."
      />

      <section className="container form-page-grid">
        <div className="form-page-copy">
          <p className="section-kicker">Administración</p>
          <h1>{editId ? "Editar plato" : "Agregar nuevo plato"}</h1>
          <p>
            Rreigstra el plato y sus detalles para que aparezca en el catálogo. Puedes agregar platos fuertes, bebidas y opciones rápidas para que los clientes puedan revisarlo.
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
