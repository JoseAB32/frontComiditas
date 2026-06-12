import placeholderFood from "../assets/placeholder-food.svg";
import { API_ROUTES } from "../config/apiRoutes";
import type { FoodFormValues, FoodItem } from "../interfaces/food.interface";
import { api } from "./api";

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
  const response = await api.get<FoodItem[]>(API_ROUTES.foods.list);
  return response.data;
}

export async function getFoodById(id: number): Promise<FoodItem> {
  const response = await api.get<FoodItem>(API_ROUTES.foods.detail(id));
  return response.data;
}

export async function createFood(values: FoodFormValues): Promise<FoodItem> {
  const response = await api.post<FoodItem>(API_ROUTES.foods.create, toBackendPayload(values));
  return response.data;
}

export async function updateFood(id: number, values: FoodFormValues): Promise<FoodItem> {
  const response = await api.patch<FoodItem>(API_ROUTES.foods.update(id), toBackendPayload(values));
  return response.data;
}

export async function deleteFood(id: number): Promise<void> {
  await api.delete(API_ROUTES.foods.remove(id));
}
