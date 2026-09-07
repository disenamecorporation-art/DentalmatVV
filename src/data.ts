import { Product } from './types';

// Dental products database with realistic details and premium SVG visual configurations
export const PRODUCTS: Product[] = [
  {
    id: 'nsk-z95l',
    name: 'Turbina Contra-Ángulo Ti-Max Z95L',
    brand: 'NSK',
    price: 1049000,
    originalPrice: 1165000,
    category: 'Instrumental',
    image: 'turbina', // will render as a premium vector drawing or detailed icon
    description: 'Multiplicador 1:5 con luz LED y sistema de spray cuádruple de agua limpia. Cuerpo de titanio duradero y ligero con recubrimiento Duragrip resistente a rayaduras.',
    specs: ['Luz LED de alta luminosidad', 'Spray de agua cuádruple', 'Cuerpo de Titanio Premium', 'Velocidad máx: 200.000 rpm'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 38,
    availability: 'oferta'
  },
  {
    id: 'woodpecker-apex',
    name: 'Localizador de Ápice Apex ID',
    brand: 'Woodpecker',
    price: 699000,
    category: 'Equipamiento',
    image: 'apex',
    description: 'Localizador de ápice digital de alta precisión para endodoncia de última generación. Funciona en canales húmedos y secos con calibración automática en tiempo real.',
    specs: ['Pantalla LCD a color de alto contraste', 'Alarmas audibles de proximidad', 'Precisión garantizada del 98.4%', 'Batería de larga duración'],
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 24,
    availability: 'disponible'
  },
  {
    id: '3m-z350xt',
    name: 'Filtek Z350 XT Resina Inteligente',
    brand: '3M',
    price: 59900,
    category: 'Materiales',
    image: 'resina',
    description: 'Resina compuesta restauradora universal con nanotecnología verdadera. Ofrece una retención de brillo excelente, pulido excepcional y resistencia superior al desgaste.',
    specs: ['Jeringa de 4g - Color A2', 'Nanotecnología exclusiva de 3M', 'Estética natural insuperable', 'Baja contracción de polimerización'],
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 142,
    availability: 'disponible'
  },
  {
    id: 'ivoclar-g4',
    name: 'Lámpara de Fotocurado Bluephase G4',
    brand: 'Ivoclar',
    price: 889000,
    category: 'Equipamiento',
    image: 'lampara',
    description: 'Lámpara de polimerización LED inteligente con asistente de exposición personalizable. Monitoreo constante del proceso para asegurar resultados homogéneos y profundos.',
    specs: ['Intensidad de luz: 1.200 mW/cm²', 'Tecnología Polywave de amplio espectro', 'Sensor anti-movimiento patentado', 'Diseño ergonómico y ultra-balanceado'],
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 56,
    availability: 'disponible'
  },
  // Trending Section
  {
    id: 'woodpecker-udsj',
    name: 'Ultrasonido Woodpecker UDS-J',
    brand: 'Woodpecker',
    price: 349000,
    category: 'Equipamiento',
    image: 'ultrasonido',
    description: 'Escariador piezoeléctrico digital con control automático de frecuencia para remoción eficiente de sarro y profilaxis dental. Incluye 5 puntas de titanio premium.',
    specs: ['Pieza de mano desmontable', 'Ajuste de potencia digital fluido', 'Frecuencia: 28kHz ± 3kHz', 'Diseño compacto y portable'],
    isTrending: true,
    rating: 4.7,
    reviewsCount: 19,
    availability: 'disponible'
  },
  {
    id: '3m-bulkfill',
    name: 'Resina Filtek Bulk Fill Posterior',
    brand: '3M',
    price: 72000,
    category: 'Materiales',
    image: 'resina_bulk',
    description: 'Restaurador posterior monoincremento de hasta 5 mm de profundidad. Colocación rápida y fácil que ahorra tiempo de sillón con un acabado resistente al desgaste.',
    specs: ['Profundidad de curado de 5mm', 'Excelente adaptación cavitaria', 'Alta resistencia a la fractura', 'Jeringa de 4g'],
    isTrending: true,
    rating: 4.8,
    reviewsCount: 41,
    availability: 'disponible'
  },
  {
    id: 'nsk-fresa',
    name: 'Fresa de Diamante Redonda FG 1/4',
    brand: 'NSK',
    price: 8500,
    category: 'Instrumental',
    image: 'fresa',
    description: 'Fresa de diamante de alta velocidad con grano medio para la preparación óptima de cavidades y remoción de restauraciones viejas. Durabilidad extrema.',
    specs: ['Grano de diamante natural seleccionado', 'Tallo de acero inoxidable calibrado', 'Mínimo nivel de vibración', 'Paquete de 5 unidades'],
    isTrending: true,
    rating: 4.6,
    reviewsCount: 88,
    availability: 'disponible'
  },
  {
    id: 'zhermack-putty',
    name: 'Silicona de Adición Putty Hydrorise',
    brand: 'Zhermack',
    price: 125000,
    category: 'Materiales',
    image: 'silicona',
    description: 'Silicona de adición hiperhidrofílica para impresiones de alta precisión. Máxima fidelidad de detalles clínicos con tiempos de fraguado óptimos.',
    specs: ['Excelente recuperación elástica', 'Alta resistencia al desgarro', 'Sabor a menta agradable', 'Kit de Base + Catalizador (300ml c/u)'],
    isTrending: true,
    rating: 4.9,
    reviewsCount: 65,
    availability: 'disponible'
  },
  // Additional Shop Catalog Items
  {
    id: 'coltene-onedial',
    name: 'Discos de Pulido OneGloss Set',
    brand: 'Coltene',
    price: 49000,
    category: 'Materiales',
    image: 'pulido',
    description: 'Copas, minicopas y puntas de silicona impregnadas de óxido de aluminio para el acabado y pulido en un solo paso de todo tipo de composites.',
    specs: ['Sistema de un solo paso', 'Sin pasta de pulido necesaria', 'Ajuste de presión controla el acabado', 'Caja de 60 piezas'],
    rating: 4.8,
    reviewsCount: 32,
    availability: 'disponible'
  },
  {
    id: 'nsk-smax',
    name: 'Turbina de Acero Inoxidable S-Max M600L',
    brand: 'NSK',
    price: 450000,
    category: 'Instrumental',
    image: 'turbina_smax',
    description: 'Turbina de acero inoxidable con rodamiento de cerámica y cabezal estándar. Ofrece excelente visibilidad clínica y una potencia de corte superior.',
    specs: ['Potencia: 20W de corte fluido', 'Rodamientos de cerámica japonesa', 'Cabezal con sistema de limpieza de cabezal', 'Óptica de vidrio celular'],
    rating: 4.7,
    reviewsCount: 15,
    availability: 'disponible'
  },
  {
    id: 'woodpecker-fi-g',
    name: 'Sistema de Obturación Fi-G Endodoncia',
    brand: 'Woodpecker',
    price: 1350000,
    category: 'Equipamiento',
    image: 'obturacion',
    description: 'Pistola inalámbrica de obturación de gutapercha termoplástica caliente para conductos radiculares. Calentamiento rápido en menos de 15 segundos.',
    specs: ['Temperatura de control digital precisa', 'Boquilla giratoria de 360 grados', 'Batería de litio recargable integrada', 'Diseño ergonómico premium'],
    rating: 4.9,
    reviewsCount: 11,
    availability: 'bajo_pedido'
  },
  {
    id: '3m-clinpro',
    name: 'Pasta Profiláctica Clinpro Prophy',
    brand: '3M',
    price: 42000,
    category: 'Materiales',
    image: 'clinpro',
    description: 'Pasta de profilaxis dental que contiene fluoruro y fosfato de calcio amorfo funcionalizado. Limpieza y pulido superiores que reducen la sensibilidad.',
    specs: ['Sabor a cereza refrescante', 'Tecnología TCP exclusiva de 3M', 'Grano medio-fino variable', 'Pote de 340g'],
    rating: 4.8,
    reviewsCount: 74,
    availability: 'disponible'
  }
];

export const CATEGORIES = [
  { id: 'Todos', name: 'Todas las Categorías' },
  { id: 'Instrumental', name: 'Instrumental de Mano' },
  { id: 'Equipamiento', name: 'Equipamiento Clínico' },
  { id: 'Materiales', name: 'Materiales Consumibles' }
];

export const BRANDS = ['NSK', '3M', 'Woodpecker', 'Ivoclar', 'Zhermack', 'Coltene'];
