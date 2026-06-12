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
