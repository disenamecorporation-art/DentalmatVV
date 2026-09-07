export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  specs: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  rating: number;
  reviewsCount: number;
  availability: 'disponible' | 'oferta' | 'bajo_pedido';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ActiveTab = 'home' | 'tienda' | 'login';

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string[];
  priceRange: [number, number];
  availability: string[];
  sortBy: 'price-asc' | 'price-desc' | 'popular' | 'novedad';
}
