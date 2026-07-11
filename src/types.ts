export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFlashSale?: boolean;
  rating: number;
  reviews: number;
  weight: string;
  description?: string;
  stock?: number;
  article?: string;
  isHidden?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}
