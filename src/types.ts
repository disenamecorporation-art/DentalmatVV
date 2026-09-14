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

export interface SiteContent {
  // Hero section
  hero_title_line1: string;
  hero_title_line2: string;
  hero_description: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_card_title: string;
  hero_card_highlight: string;
  hero_card_cta: string;

  // Features bar (3 columns)
  feature1_title: string;
  feature1_desc: string;
  feature2_title: string;
  feature2_desc: string;
  feature3_title: string;
  feature3_desc: string;

  // Featured section header
  featured_section_title: string;
  featured_section_subtitle: string;

  // Central Banner ("¿Equipando un nuevo consultorio dental?")
  banner_title: string;
  banner_description: string;
  banner_badge1: string;
  banner_badge2: string;
  banner_badge3: string;
  banner_cta: string;

  // Trending section header
  trending_section_title: string;
  trending_section_subtitle: string;

  // Footer & Contact
  footer_description: string;
  footer_address: string;
  footer_whatsapp: string;
  footer_whatsapp_link: string;
  footer_office_phone: string;
  footer_email: string;
  footer_credits: string;

  // Social Links
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero_title_line1: "Equipamiento que eleva tu práctica.",
  hero_title_line2: "Resultados que inspiran confianza.",
  hero_description: "Instrumental, materiales y tecnología dental seleccionados por expertos, para expertos. Eleve el nivel de su clínica con la máxima precisión del mercado global.",
  hero_cta_primary: "Ver productos",
  hero_cta_secondary: "Conocer más",
  hero_card_title: "Tecnología en la que puedes",
  hero_card_highlight: "confiar",
  hero_card_cta: "Explorar categoría",

  feature1_title: "Garantía oficial",
  feature1_desc: "en todos los productos de nuestro catálogo",
  feature2_title: "Envíos rápidos",
  feature2_desc: "a todo el país para que tu clínica nunca se detenga",
  feature3_title: "Atención directa",
  feature3_desc: "vía WhatsApp para asesoría personalizada y pedidos rápidos",

  featured_section_title: "Productos destacados",
  featured_section_subtitle: "Los instrumentos de máxima precisión preferidos por cirujanos dentales",

  banner_title: "¿Equipando un nuevo consultorio dental?",
  banner_description: "Ofrecemos planes de financiamiento a medida, instalación técnica certificada de sillones y autoclaves, y descuentos por volumen corporativo para clínicas y facultades de odontología.",
  banner_badge1: "Asistencia Técnica 24/7",
  banner_badge2: "Capacitaciones de uso",
  banner_badge3: "Garantía de hasta 3 años",
  banner_cta: "Solicitar presupuesto corporativo",

  trending_section_title: "Productos en tendencia",
  trending_section_subtitle: "Los consumibles y accesorios más comprados esta semana por laboratorios y odontólogos",

  footer_description: "Distribuidora líder de instrumental rotatorio, equipamiento clínico de vanguardia y consumibles odontológicos de máxima precisión.",
  footer_address: "Urbanización valle lindo, calle principal sector 2, al lado del C.E.I.P Los Niños del Libertador, municipio Santiago mariño, Turmero, Edo. Aragua, Venezuela.",
  footer_whatsapp: "+58 414-4873395 (WhatsApp)",
  footer_whatsapp_link: "https://wa.me/584144873395",
  footer_office_phone: "+58 244 661 1090 (Oficina)",
  footer_email: "ventas@dentalmatvv.com",
  footer_credits: "Hecho por Legaint Corporation",

  social_instagram: "https://instagram.com/dentalmatvv",
  social_facebook: "https://facebook.com/dentalmatvv",
  social_tiktok: "https://tiktok.com/@dentalmatvv"
};
