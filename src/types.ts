export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  badgeType?: 'mais-pedido' | 'frango-catupiry' | 'linguica' | 'panko' | 'cheddar' | 'duplo' | 'vegano' | 'chef' | 'none';
  category: string;
  available: boolean;
}

export interface Combo {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  category: string;
  available: boolean;
}

export interface CustomizeOption {
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart entry ID
  product: Product | Combo;
  quantity: number;
  ponto?: string;
  addedOptions: CustomizeOption[];
  removedIngredients: string[];
}

export interface PastOrder {
  id: string;
  date: string;
  itemsSummary: string;
  total: number;
  items: CartItem[];
}
