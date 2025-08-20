export interface ToyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}
export interface Review {
  id?: string;
  name: string;
  emailAddress: string;
  comment: string;
  reviewDate: string;
  rating: number;
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