import placeholderFood from "../assets/placeholder-food.svg";
import { api, HAS_BACKEND_API, publicRecipesApi } from "./api";
import type { DummyRecipesResponse, FoodFormValues, FoodItem } from "../interfaces/food.interface";
import { readStorage, writeStorage } from "../utils/storage";

const FOOD_STORAGE_KEY = "catalogo_food_items";

const fallbackFoods: FoodItem[] = [
  {
    id: 1,
    name: "Pique Macho Especial",
    category: "Plato fuerte",
    price: 38,
    description: "Carne salteada, papas, salchicha, huevo, locoto y salsa de la casa.",
    imageUrl: placeholderFood,
    rating: 4.8,
    isAvailable: true,
    preparationTime: 25
  },
  {
    id: 2,
    name: "Silpancho Cochabambino",
    category: "Plato fuerte",
    price: 32,
    description: "Arroz, papa, carne apanada, huevo frito y ensalada fresca.",
    imageUrl: placeholderFood,
    rating: 4.7,
    isAvailable: true,
    preparationTime: 22
  },
  {
    id: 3,
    name: "Limonada de la Casa",
    category: "Bebida",
    price: 12,
    description: "Limonada fría con hierbabuena, hielo y toque cítrico natural.",
    imageUrl: placeholderFood,
    rating: 4.5,
    isAvailable: true,
    preparationTime: 6
  }
];

function mapRecipeToFood(recipe: DummyRecipesResponse["recipes"][number]): FoodItem {
  const mealType = recipe.mealType?.[0] || "Especial";
  const minutes = Number(recipe.prepTimeMinutes || 0) + Number(recipe.cookTimeMinutes || 0);

  return {
    id: recipe.id,
    name: recipe.name,
    category: mealType,
    price: Math.max(18, Math.round(recipe.caloriesPerServing / 12)),
    description: `${recipe.cuisine} · ${recipe.difficulty}. Ingredientes principales: ${recipe.ingredients.slice(0, 3).join(", ")}.`,
    imageUrl: recipe.image,
    rating: Number(recipe.rating || 4.5),
    isAvailable: true,
    preparationTime: minutes || 20
  };
}

function normalizeForm(values: FoodFormValues, id?: number): FoodItem {
  return {
    id: id ?? Date.now(),
    name: values.name.trim(),
    category: values.category.trim(),
    price: Number(values.price),
    description: values.description.trim(),
    imageUrl: values.imageUrl.trim() || placeholderFood,
    rating: Number(values.rating),
    preparationTime: Number(values.preparationTime),
    isAvailable: values.isAvailable
  };
}

function toBackendPayload(values: FoodFormValues) {
  return {
    name: values.name.trim(),
    category: values.category.trim(),
    price: Number(values.price),
    description: values.description.trim(),
    imageUrl: values.imageUrl.trim() || placeholderFood,
    rating: Number(values.rating),
    preparationTime: Number(values.preparationTime),
    isAvailable: values.isAvailable
  };
}

export async function getFoods(): Promise<FoodItem[]> {
  if (HAS_BACKEND_API) {
    const response = await api.get<FoodItem[]>("/foods");
    return response.data;
  }

  const storedFoods = readStorage<FoodItem[]>(FOOD_STORAGE_KEY, []);

  if (storedFoods.length > 0) {
    return storedFoods;
  }

  try {
    const response = await publicRecipesApi.get<DummyRecipesResponse>("/recipes?limit=12&select=id,name,image,cuisine,difficulty,rating,caloriesPerServing,mealType,prepTimeMinutes,cookTimeMinutes,ingredients");
    const foods = response.data.recipes.map(mapRecipeToFood);
    writeStorage(FOOD_STORAGE_KEY, foods);
    return foods;
  } catch {
    writeStorage(FOOD_STORAGE_KEY, fallbackFoods);
    return fallbackFoods;
  }
}

export async function getFoodById(id: number): Promise<FoodItem | null> {
  if (HAS_BACKEND_API) {
    const response = await api.get<FoodItem>(`/foods/${id}`);
    return response.data;
  }

  const currentFoods = await getFoods();
  return currentFoods.find((food) => food.id === id) || null;
}

export async function createFood(values: FoodFormValues): Promise<FoodItem> {
  if (HAS_BACKEND_API) {
    const response = await api.post<FoodItem>("/foods", toBackendPayload(values));
    return response.data;
  }

  const currentFoods = await getFoods();
  const newFood = normalizeForm(values);
  writeStorage(FOOD_STORAGE_KEY, [newFood, ...currentFoods]);
  return newFood;
}

export async function updateFood(id: number, values: FoodFormValues): Promise<FoodItem> {
  if (HAS_BACKEND_API) {
    const response = await api.patch<FoodItem>(`/foods/${id}`, toBackendPayload(values));
    return response.data;
  }

  const currentFoods = await getFoods();
  const updatedFood = normalizeForm(values, id);
  const nextFoods = currentFoods.map((food) => food.id === id ? updatedFood : food);
  writeStorage(FOOD_STORAGE_KEY, nextFoods);
  return updatedFood;
}

export async function deleteFood(id: number): Promise<void> {
  if (HAS_BACKEND_API) {
    await api.delete(`/foods/${id}`);
    return;
  }

  const currentFoods = await getFoods();
  const nextFoods = currentFoods.filter((food) => food.id !== id);
  writeStorage(FOOD_STORAGE_KEY, nextFoods);
}

export function clearFoodDemoData(): void {
  localStorage.removeItem(FOOD_STORAGE_KEY);
}
