-- ==============================================================================
-- DENTALMATVV - ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE
-- Incluye: Productos, Categorías, Perfiles y Configuración de Textos/Redes del Sitio
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'NSK',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    description TEXT,
    specs JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    availability TEXT DEFAULT 'disponible' CHECK (availability IN ('disponible', 'oferta', 'bajo_pedido')),
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: PERFILES DE USUARIO (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    clinical_id TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA: CONFIGURACIÓN Y TEXTOS DEL SITIO (site_settings)
-- Guarda todos los textos editables del Home, Hero, Contenedor Central, Footer y Redes
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- SEGURIDAD: POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de Categorías
DROP POLICY IF EXISTS "Categorías visibles para todos" ON public.categories;
CREATE POLICY "Categorías visibles para todos" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo administradores modifican categorías" ON public.categories;
CREATE POLICY "Solo administradores modifican categorías" ON public.categories
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
            OR auth.jwt() ->> 'email' LIKE '%admin%'
        )
    );

-- Políticas de Productos
DROP POLICY IF EXISTS "Productos visibles para todos" ON public.products;
CREATE POLICY "Productos visibles para todos" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo administradores modifican productos" ON public.products;
CREATE POLICY "Solo administradores modifican productos" ON public.products
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
            OR auth.jwt() ->> 'email' LIKE '%admin%'
        )
    );

-- Políticas de Configuración del Sitio (site_settings)
DROP POLICY IF EXISTS "Configuración visible para todos" ON public.site_settings;
CREATE POLICY "Configuración visible para todos" ON public.site_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo administradores modifican configuración" ON public.site_settings;
CREATE POLICY "Solo administradores modifican configuración" ON public.site_settings
    FOR ALL USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
            OR auth.jwt() ->> 'email' LIKE '%admin%'
        )
    );

-- Políticas de Perfiles
DROP POLICY IF EXISTS "Perfiles visibles por su dueño o admin" ON public.profiles;
CREATE POLICY "Perfiles visibles por su dueño o admin" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

DROP POLICY IF EXISTS "Usuarios editan su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios editan su propio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- INSERCIÓN DE DATOS INICIALES POR DEFECTO
-- ==============================================================================

-- Categorías Iniciales
INSERT INTO public.categories (id, name, description, sort_order) VALUES
('Instrumental', 'Instrumental Rotatorio', 'Turbinas, micromotores, contra-ángulos y piezas de mano de precisión', 1),
('Equipos', 'Equipamiento Clínico', 'Unidades dentales, autoclaves, lámparas de fotocurado y ultrasonido', 2),
('Consumibles', 'Consumibles y Materiales', 'Composites, resinas, fresas de diamante, adhesivos e insumos diarios', 3),
('Bioseguridad', 'Bioseguridad y Esterilización', 'Autoclaves, selladoras, cubetas de desinfección y barreras de protección', 4)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    sort_order = EXCLUDED.sort_order;

-- Configuración de Textos del Sitio (Valores Iniciales)
INSERT INTO public.site_settings (id, content, updated_at) VALUES
('main', '{
  "hero_title_line1": "Equipamiento que eleva tu práctica.",
  "hero_title_line2": "Resultados que inspiran confianza.",
  "hero_description": "Encuentra instrumental rotatorio de precisión, equipamiento de última generación y consumibles esenciales de los fabricantes más prestigiosos del mundo para clínicas y profesionales exigentes.",
  "hero_cta_primary": "Ver catálogo de productos",
  "hero_cta_secondary": "Conocer más sobre nosotros",
  "hero_card_title": "Tecnología en la que puedes",
  "hero_card_highlight": "confiar",
  "hero_card_cta": "Explorar categoría",
  "feature1_title": "Garantía Oficial",
  "feature1_desc": "Equipos certificados con respaldo y soporte técnico directo",
  "feature2_title": "Envíos Seguros a Nivel Nacional",
  "feature2_desc": "Embalaje clínico especializado y entrega prioritaria",
  "feature3_title": "Atención Clínica Directa",
  "feature3_desc": "Asesoramiento profesional para equipar tu consultorio",
  "featured_section_title": "Productos Destacados",
  "featured_section_subtitle": "Instrumental y equipos de alta gama con disponibilidad inmediata",
  "trending_section_title": "Tendencias en Odontología",
  "trending_section_subtitle": "Las innovaciones preferidas por los especialistas clínicos",
  "banner_title": "¿Equipando un nuevo consultorio dental?",
  "banner_description": "Ofrecemos paquetes integrales para clínicas, asesoría técnica personalizada y planes de financiamiento a medida.",
  "banner_badge1": "Asistencia Técnica 24/7",
  "banner_badge2": "Capacitaciones de uso",
  "banner_badge3": "Garantía de hasta 3 años",
  "banner_cta": "Solicitar presupuesto corporativo",
  "footer_description": "Distribuidora líder de instrumental rotatorio, equipamiento clínico de vanguardia y consumibles odontológicos de máxima precisión.",
  "footer_address": "Urbanización valle lindo, calle principal sector 2, al lado del C.E.I.P Los Niños del Libertador, municipio Santiago mariño, Turmero, Edo. Aragua, Venezuela.",
  "footer_whatsapp": "+58 422-0583339 (WhatsApp)",
  "footer_whatsapp_link": "https://wa.me/584220583339",
  "footer_office_phone": "+58 244 661 1090 (Oficina)",
  "footer_email": "ventas@dentalmatvv.com",
  "footer_credits": "Hecho por Legaint Corporation",
  "social_instagram": "https://instagram.com/dentalmatvv",
  "social_facebook": "https://facebook.com/dentalmatvv",
  "social_tiktok": "https://tiktok.com/@dentalmatvv"
}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;
