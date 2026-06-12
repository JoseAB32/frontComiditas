import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import Seo from "../components/Seo";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import type { FoodItem } from "../interfaces/food.interface";
import { deleteFood, getFoods } from "../services/foodService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function CatalogPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      setIsLoading(true);
      setError("");
      const data = await getFoods();
      setFoods(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "No se pudo cargar el menú. Intenta nuevamente en unos segundos."));
    } finally {
      setIsLoading(false);
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(foods.map((food) => food.category)));
    return ["Todas", ...uniqueCategories];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const text = `${food.name} ${food.description} ${food.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = category === "Todas" || food.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [foods, search, category]);

  async function handleDelete(id: number) {
    const food = foods.find((item) => item.id === id);
    const confirmDelete = window.confirm(`¿Eliminar ${food?.name || "este plato"}?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteFood(id);
      setFoods((current) => current.filter((item) => item.id !== id));
      setMessage("Plato eliminado correctamente.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "No se pudo eliminar el plato."));
    }
  }

  return (
    <main className="catalog-page">
      <Seo
        title="Menú"
        description="Menú digital con platos, filtros, imágenes, precios y datos principales de cada comida."
      />

      <section className="container page-heading menu-heading">
        <div>
          <p className="section-kicker">Carta actual</p>
          <h1>Menú de la casa</h1>
          <p>Busca por nombre, ingrediente o categoría para elegir tu próximo plato.</p>
        </div>

        {isAdmin && (
          <Link className="btn btn-primary" to="/catalogo/nuevo">
            Agregar plato
          </Link>
        )}
      </section>

      <section className="container catalog-content catalog-wide">
        {message && <StatusMessage type="success">{message}</StatusMessage>}
        {error && <StatusMessage type="error">{error}</StatusMessage>}

        <div className="toolbar" aria-label="Filtros del menú">
          <div className="form-field search-field">
            <label htmlFor="search">Buscar plato</label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. pizza, pollo, postre"
            />
          </div>

          <div className="form-field category-field">
            <label htmlFor="categoryFilter">Categoría</label>
            <select
              id="categoryFilter"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <StatusMessage type="info">Cargando platos...</StatusMessage>
        ) : filteredFoods.length === 0 ? (
          <StatusMessage type="info">No se encontraron platos con esos filtros.</StatusMessage>
        ) : (
          <div className="food-list" aria-live="polite">
            {filteredFoods.map((food, index) => (
              <FoodCard
                key={food.id}
                food={food}
                index={index}
                canManage={isAdmin}
                onEdit={(item) => navigate(`/catalogo/editar/${item.id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
