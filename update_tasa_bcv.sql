-- ==============================================================================
-- DENTALMATVV - ACTUALIZACIÓN O CONFIGURACIÓN DE LA TASA DEL DÍA (BOLÍVARES / USD)
-- Ejecutar en el SQL Editor de Supabase si deseas cambiar la tasa manualmente
-- ==============================================================================

-- 1. Si ya existe la fila 'main' en site_settings, actualiza o añade la tasa del día:
UPDATE public.site_settings
SET content = jsonb_set(
  jsonb_set(
    COALESCE(content, '{}'::jsonb),
    '{exchange_rate}',
    '45.00'::jsonb, -- Cambia 45.00 por el valor deseado (ej: 46.50)
    true
  ),
  '{exchange_rate_label}',
  '"Tasa Oficial del Día (BCV)"'::jsonb,
  true
),
updated_at = timezone('utc'::text, now())
WHERE id = 'main';

-- 2. Si aún no existe la fila 'main', la crea con la tasa por defecto:
INSERT INTO public.site_settings (id, content, updated_at)
VALUES (
  'main',
  jsonb_build_object(
    'exchange_rate', 45.00,
    'exchange_rate_label', 'Tasa Oficial del Día (BCV)'
  ),
  timezone('utc'::text, now())
)
ON CONFLICT (id) DO NOTHING;
