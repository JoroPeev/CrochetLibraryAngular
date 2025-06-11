export interface ToyImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Toy {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: string;
  stock: number;
  images: ToyImage[]; // lowercase i here
  primaryImageUrl: string;
}
