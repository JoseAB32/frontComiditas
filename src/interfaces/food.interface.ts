export interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  preparationTime: number;
}

export interface FoodFormValues {
  name: string;
  category: string;
  price: string;
  description: string;
  imageUrl: string;
  rating: string;
  preparationTime: string;
  isAvailable: boolean;
}

export interface DummyRecipe {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  difficulty: string;
  rating: number;
  caloriesPerServing: number;
  mealType: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: string[];
}

export interface DummyRecipesResponse {
  recipes: DummyRecipe[];
  total: number;
  skip: number;
  limit: number;
}
