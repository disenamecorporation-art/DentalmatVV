-- =========================================================================
-- SCRIPT SQL COMPLETO PARA SUPABASE - DENTALMATVV
-- Ejecuta este script en Supabase: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. TABLA DE PERFILES DE USUARIO (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  clinical_id TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  description TEXT NOT NULL,
  specs JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'disponible' CHECK (availability IN ('disponible', 'oferta', 'bajo_pedido')),
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABLA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- TRIGGER AUTOMÁTICO PARA REGISTRO DE USUARIOS EN AUTH.USERS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, clinical_id, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'clinical_id',
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    clinical_id = COALESCE(EXCLUDED.clinical_id, public.profiles.clinical_id),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = now();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si ya existe y recrear
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- FUNCIÓN HELPER PARA VERIFICAR SI UN USUARIO ES ADMINISTRADOR
-- =========================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =========================================================================
-- ACTIVAR SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas para evitar duplicados
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users or admins can view orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- 1. POLÍTICAS DE PROFILES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. POLÍTICAS DE CATEGORÍAS (Públicas para leer, solo Admin para modificar)
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- 3. POLÍTICAS DE PRODUCTOS (Públicos para leer, solo Admin para modificar)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- 4. POLÍTICAS DE PEDIDOS
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users or admins can view orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- =========================================================================
-- DATOS INICIALES (CATEGORÍAS Y PRODUCTOS BASE)
-- =========================================================================

-- Categorías
INSERT INTO public.categories (id, name, description, sort_order) VALUES
  ('Instrumental', 'Instrumental de Mano', 'Turbinas, contra-ángulos, piezas de mano y fresas', 1),
  ('Equipamiento', 'Equipamiento Clínico', 'Localizadores de ápice, lámparas de fotocurado y ultrasonidos', 2),
  ('Materiales', 'Materiales Consumibles', 'Resinas, composites, siliconas de adición y profilaxis', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Productos
INSERT INTO public.products (id, name, brand, price, original_price, image, category, description, specs, is_featured, is_trending, rating, reviews_count, availability, stock) VALUES
  (
    'nsk-z95l',
    'Turbina Contra-Ángulo Ti-Max Z95L',
    'NSK',
    1049000,
    1165000,
    'turbina',
    'Instrumental',
    'Multiplicador 1:5 con luz LED y sistema de spray cuádruple de agua limpia. Cuerpo de titanio duradero y ligero con recubrimiento Duragrip resistente a rayaduras.',
    '["Luz LED de alta luminosidad", "Spray de agua cuádruple", "Cuerpo de Titanio Premium", "Velocidad máx: 200.000 rpm"]'::jsonb,
    true,
    false,
    4.9,
    38,
    'oferta',
    25
  ),
  (
    'woodpecker-apex',
    'Localizador de Ápice Apex ID',
    'Woodpecker',
    699000,
    NULL,
    'apex',
    'Equipamiento',
    'Localizador de ápice digital de alta precisión para endodoncia de última generación. Funciona en canales húmedos y secos con calibración automática en tiempo real.',
    '["Pantalla LCD a color de alto contraste", "Alarmas audibles de proximidad", "Precisión garantizada del 98.4%", "Batería de larga duración"]'::jsonb,
    true,
    false,
    4.8,
    24,
    'disponible',
    18
  ),
  (
    '3m-z350xt',
    'Filtek Z350 XT Resina Inteligente',
    '3M',
    59900,
    NULL,
    'resina',
    'Materiales',
    'Resina compuesta restauradora universal con nanotecnología verdadera. Ofrece una retención de brillo excelente, pulido excepcional y resistencia superior al desgaste.',
    '["Jeringa de 4g - Color A2", "Nanotecnología exclusiva de 3M", "Estética natural insuperable", "Baja contracción de polimerización"]'::jsonb,
    true,
    false,
    5.0,
    142,
    'disponible',
    150
  ),
  (
    'ivoclar-g4',
    'Lámpara de Fotocurado Bluephase G4',
    'Ivoclar',
    889000,
    NULL,
    'lampara',
    'Equipamiento',
    'Lámpara de polimerización LED inteligente con asistente de exposición personalizable. Monitoreo constante del proceso para asegurar resultados homogéneos y profundos.',
    '["Intensidad de luz: 1.200 mW/cm²", "Tecnología Polywave de amplio espectro", "Sensor anti-movimiento patentado", "Diseño ergonómico y ultra-balanceado"]'::jsonb,
    true,
    false,
    4.9,
    56,
    'disponible',
    12
  ),
  (
    'woodpecker-udsj',
    'Ultrasonido Woodpecker UDS-J',
    'Woodpecker',
    349000,
    NULL,
    'ultrasonido',
    'Equipamiento',
    'Escariador piezoeléctrico digital con control automático de frecuencia para remoción eficiente de sarro y profilaxis dental. Incluye 5 puntas de titanio premium.',
    '["Pieza de mano desmontable", "Ajuste de potencia digital fluido", "Frecuencia: 28kHz ± 3kHz", "Diseño compacto y portable"]'::jsonb,
    false,
    true,
    4.7,
    19,
    'disponible',
    30
  ),
  (
    '3m-bulkfill',
    'Resina Filtek Bulk Fill Posterior',
    '3M',
    72000,
    NULL,
    'resina_bulk',
    'Materiales',
    'Restaurador posterior monoincremento de hasta 5 mm de profundidad. Colocación rápida y fácil que ahorra tiempo de sillón con un acabado resistente al desgaste.',
    '["Profundidad de curado de 5mm", "Excelente adaptación cavitaria", "Alta resistencia a la fractura", "Jeringa de 4g"]'::jsonb,
    false,
    true,
    4.8,
    41,
    'disponible',
    95
  ),
  (
    'nsk-fresa',
    'Fresa de Diamante Redonda FG 1/4',
    'NSK',
    8500,
    NULL,
    'fresa',
    'Instrumental',
    'Fresa de diamante de alta velocidad con grano medio para la preparación óptima de cavidades y remoción de restauraciones viejas. Durabilidad extrema.',
    '["Grano de diamante natural seleccionado", "Tallo de acero inoxidable calibrado", "Mínimo nivel de vibración", "Paquete de 5 unidades"]'::jsonb,
    false,
    true,
    4.6,
    88,
    'disponible',
    200
  ),
  (
    'zhermack-putty',
    'Silicona de Adición Putty Hydrorise',
    'Zhermack',
    125000,
    NULL,
    'silicona',
    'Materiales',
    'Silicona de adición hiperhidrofílica para impresiones de alta precisión. Máxima fidelidad de detalles clínicos con tiempos de fraguado óptimos.',
    '["Excelente recuperación elástica", "Alta resistencia al desgarro", "Sabor a menta agradable", "Kit de Base + Catalizador (300ml c/u)"]'::jsonb,
    false,
    true,
    4.9,
    65,
    'disponible',
    40
  ),
  (
    'coltene-onedial',
    'Discos de Pulido OneGloss Set',
    'Coltene',
    49000,
    NULL,
    'pulido',
    'Materiales',
    'Copas, minicopas y puntas de silicona impregnadas de óxido de aluminio para el acabado y pulido en un solo paso de todo tipo de composites.',
    '["Sistema de un solo paso", "Sin pasta de pulido necesaria", "Ajuste de presión controla el acabado", "Caja de 60 piezas"]'::jsonb,
    false,
    false,
    4.8,
    32,
    'disponible',
    60
  ),
  (
    'nsk-smax',
    'Turbina de Acero Inoxidable S-Max M600L',
    'NSK',
    450000,
    NULL,
    'turbina_smax',
    'Instrumental',
    'Turbina de acero inoxidable con rodamiento de cerámica y cabezal estándar. Ofrece excelente visibilidad clínica y una potencia de corte superior.',
    '["Potencia: 20W de corte fluido", "Rodamientos de cerámica japonesa", "Cabezal con sistema de limpieza de cabezal", "Óptica de vidrio celular"]'::jsonb,
    false,
    false,
    4.7,
    15,
    'disponible',
    15
  ),
  (
    'woodpecker-fi-g',
    'Sistema de Obturación Fi-G Endodoncia',
    'Woodpecker',
    1350000,
    NULL,
    'obturacion',
    'Equipamiento',
    'Pistola inalámbrica de obturación de gutapercha termoplástica caliente para conductos radiculares. Calentamiento rápido en menos de 15 segundos.',
    '["Temperatura de control digital precisa", "Boquilla giratoria de 360 grados", "Batería de litio recargable integrada", "Diseño ergonómico premium"]'::jsonb,
    false,
    false,
    4.9,
    11,
    'bajo_pedido',
    5
  ),
  (
    '3m-clinpro',
    'Pasta Profiláctica Clinpro Prophy',
    '3M',
    42000,
    NULL,
    'clinpro',
    'Materiales',
    'Pasta de profilaxis dental que contiene fluoruro y fosfato de calcio amorfo funcionalizado. Limpieza y pulido superiores que reducen la sensibilidad.',
    '["Sabor a cereza refrescante", "Tecnología TCP exclusiva de 3M", "Grano medio-fino variable", "Pote de 340g"]'::jsonb,
    false,
    false,
    4.8,
    74,
    'disponible',
    80
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  specs = EXCLUDED.specs,
  is_featured = EXCLUDED.is_featured,
  is_trending = EXCLUDED.is_trending,
  availability = EXCLUDED.availability,
  stock = EXCLUDED.stock;

-- =========================================================================
-- CÓMO ASIGNAR ROL DE ADMINISTRADOR A TU CUENTA:
-- =========================================================================
-- Una vez te registres en la app con tu email (ej: admin@dentalmatvv.com),
-- ejecuta este comando en el SQL Editor para darte permisos de administrador:
-- 
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'tu_email@ejemplo.com';
-- =========================================================================
