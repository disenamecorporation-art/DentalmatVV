import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.startsWith('http')
  );
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return client;
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'customer' | 'admin';
  clinical_id?: string;
  phone?: string;
  avatar_url?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  sort_order?: number;
}

// Data fetchers with seamless fallback
export async function fetchProductsFromDB(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    if (error || !data) {
      console.warn('Error fetching products from Supabase, using local catalog:', error?.message);
      return null;
    }
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      image: item.image,
      category: item.category,
      description: item.description,
      specs: Array.isArray(item.specs) ? item.specs : (typeof item.specs === 'string' ? JSON.parse(item.specs) : []),
      isFeatured: Boolean(item.is_featured),
      isTrending: Boolean(item.is_trending),
      rating: Number(item.rating || 5.0),
      reviewsCount: Number(item.reviews_count || 0),
      availability: item.availability || 'disponible',
    }));
  } catch (err) {
    console.warn('Supabase fetch products error:', err);
    return null;
  }
}

export async function fetchCategoriesFromDB(): Promise<CategoryItem[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data) return null;
    return data;
  } catch (err) {
    return null;
  }
}
