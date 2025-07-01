export interface ToyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Toy {
  id?: string; // Make ID optional for new toys
  name: string;
  description: string;
  price: number;
  colors: string;
  stock: number;
  images: ToyImage[];
  primaryImageUrl: string;
}