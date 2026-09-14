import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { Product, SiteContent, DEFAULT_SITE_CONTENT } from '../types';
import { PRODUCTS, CATEGORIES } from '../data';

// Read exclusively from environment variables
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
  ? getSupabase()
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

// Data fetchers querying directly from Supabase Database
export async function fetchProductsFromDB(): Promise<Product[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
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
      }
    } catch (err) {
      console.warn('Supabase fetch products error:', err);
    }
  }
  return PRODUCTS;
}

export async function fetchCategoriesFromDB(): Promise<CategoryItem[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch categories error:', err);
    }
  }
  return CATEGORIES;
}

export async function fetchSiteContentFromDB(): Promise<SiteContent> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('site_settings')
        .select('content')
        .eq('id', 'main')
        .single();
      if (!error && data && data.content) {
        return { ...DEFAULT_SITE_CONTENT, ...data.content };
      }
    } catch (err) {
      console.warn('Error fetching site content from Supabase:', err);
    }
  }
  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContentToDB(content: SiteContent): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) {
    throw new Error('Supabase no está configurado en las variables de entorno.');
  }
  try {
    const { error } = await sb
      .from('site_settings')
      .upsert({
        id: 'main',
        content,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    if (error) {
      console.error('Error guardando contenido en Supabase:', error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Error en saveSiteContentToDB:', err);
    throw err;
  }
}



