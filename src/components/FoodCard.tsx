import placeholderFood from "../assets/placeholder-food.svg";
import type { FoodItem } from "../interfaces/food.interface";

interface FoodCardProps {
  food: FoodItem;
  index: number;
  canManage: boolean;
  onEdit: (food: FoodItem) => void;
  onDelete: (id: number) => void;
}

export default function FoodCard({ food, index, canManage, onEdit, onDelete }: FoodCardProps) {
  const rowClass = index % 2 === 1 ? "food-row reverse" : "food-row";

  return (
    <article className={rowClass}>
      <div className="food-image-wrap">
        <img
          src={food.imageUrl}
          alt={`Foto referencial del plato ${food.name}`}
          className="food-image"
          loading="lazy"
          width="460"
          height="300"
          onError={(event) => {
            event.currentTarget.src = placeholderFood;
          }}
        />
      </div>

      <div className="food-row-body">
        <div className="food-card-top">
          <span className="food-category">{food.category}</span>
          <span className="food-rating" aria-label={`Calificación ${food.rating} de 5`}>
            ★ {food.rating.toFixed(1)}
          </span>
        </div>

        <h2>{food.name}</h2>
        <p>{food.description}</p>

        <div className="food-meta">
          <strong>Bs {food.price.toFixed(2)}</strong>
          <span>{food.preparationTime} min aprox.</span>
        </div>

        {canManage && (
          <div className="card-actions" aria-label={`Acciones para ${food.name}`}>
            <button className="btn btn-light" type="button" onClick={() => onEdit(food)}>
              Editar
            </button>
            <button className="btn btn-danger" type="button" onClick={() => onDelete(food.id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
