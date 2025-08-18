export interface ToyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}
export interface Review {
  id: number;
  author: string;
  rating: number;
  email: string;
  comment: string;
}
export interface Toy {
  primaryImageUrl: string;
}
export interface Toy {
  id?: string;
  name: string;
  description: string;
  price: number;
  colors: string;
  stock: number;
  craftingTimeInDays: number;
  reviews: Review[];
  images: ToyImage[];
  primaryImageUrl: string;
}