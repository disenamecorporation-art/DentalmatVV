import React from 'react';
import { ActiveTab, CartItem, Product } from './types';
import { PRODUCTS } from './data';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { TiendaView } from './components/TiendaView';
import { LoginView } from './components/LoginView';
import { CartDrawer } from './components/CartDrawer';
import { ProductSVG } from './components/ProductSVG';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  ShieldCheck, 
  Star, 
  X, 
  Plus, 
  Minus, 
  ShoppingBag,
  Clock,
  ThumbsUp
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('home');
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [searchFilter, setSearchFilter] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'login') {
      setIsAuthOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Scroll to top on tab change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    // Auto-open cart for premium user feedback
    setIsCartOpen(true);
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    }));
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handle header search
  const handleSearch = (query: string) => {
    setSearchFilter(query);
    setActiveTab('tienda');
  };

  // Helper formatting for currency (USD $ format - value divided by 1000 for realistic USD dental pricing)
  const formatPrice = (value: number) => {
    const usdValue = value / 1000;
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* 1. Header Component with sticky effects & top notice bar */}
      <Header
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        cartItems={cartItems}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onSearch={handleSearch}
      />

      {/* 2. Main Content Wrapper */}
      <main className={`flex-grow ${activeTab !== 'home' ? 'pt-[140px] md:pt-[175px]' : ''}`}>
        {activeTab === 'home' && (
          <HomeView
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onChangeTab={handleTabChange}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {activeTab === 'tienda' && (
          <TiendaView
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            searchFilter={searchFilter}
          />
        )}
      </main>

      {/* 3. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 4. Product Quick-View Detailed Modal (Premium Feature) */}
      {selectedProduct && (
        <div id="product-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          />
          
          <div 
            id="product-modal-content"
            className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/60 shadow-2xl p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-8 animate-fadeIn no-scrollbar"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Vector rendering */}
            <div className="w-full md:w-1/2 aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 relative">
              <div className="w-48 h-48">
                <ProductSVG type={selectedProduct.image} />
              </div>
              
              {selectedProduct.originalPrice && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase">
                  Oferta Especial
                </span>
              )}
            </div>

            {/* Right side: Information and interactive purchase */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded uppercase tracking-wider">
                  {selectedProduct.brand}
                </span>
                
                <h2 className="text-lg md:text-xl font-extrabold text-[#0F2C59] tracking-tight leading-snug">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {selectedProduct.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({selectedProduct.reviewsCount} evaluaciones verificadas)
                  </span>
                </div>

                <div className="pt-2">
                  {selectedProduct.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-xl font-extrabold text-[#0F2C59]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-2">
                  {selectedProduct.description}
                </p>

                {/* Specs */}
                <div className="space-y-1 pt-3">
                  <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Ficha Técnica Destacada</h4>
                  <ul className="space-y-1">
                    {selectedProduct.specs.map((spec, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action purchase */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Clinical Sophisticated Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand presentation */}
            <div className="space-y-4">
              {/* Logo container strictly crop/bounded per user instructions */}
              <div className="h-16 w-56 flex items-center justify-start select-none">
                <img 
                  src="https://i.postimg.cc/8kmZgcfh/dentalweblogo.png" 
                  alt="DentalMatVV" 
                  referrerPolicy="no-referrer"
                  className="h-full w-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Su partner estratégico en materiales e instrumental odontológico de alta fidelidad. Soluciones premium para consultorios, clínicas y laboratorios dentales.
              </p>
              <div className="flex items-center gap-3">
                <a href="#instagram" className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Siga nuestro Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#facebook" className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Siga nuestro Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#twitter" className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Siga nuestro Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Navegación</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Inicio - Portada Principal
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tienda')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Tienda Virtual WooCommerce
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tienda'); setSearchFilter('nsk'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Equipamiento NSK Japón
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tienda'); setSearchFilter('3m'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Consumibles y Resinas 3M ESPE
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('login')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Matrícula y Alta de Odontólogos
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact clinical info */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Contacto Directo</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Urbanización valle lindo, calle principal sector 2, al lado del C.E.I.P Los Niños del Libertador, municipio Santiago mariño, Turmero, Edo. Aragua, Venezuela</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>WhatsApp: +58 414-4873395 / +58 244 661 1090</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>contacto@dentalmatvv.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Quality & Legal badge */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Garantía Certificada</h3>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-white">ISO 13485:2016</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cumplimos rigurosamente con las normativas del Ministerio de Salud para el almacenamiento y distribución de dispositivos médicos autorizados.
                </p>
              </div>
            </div>

          </div>

          {/* Credits bottom bar containing exactly the requested corporate line */}
          <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} DentalMatVV. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-1.5">
              <span>Desarrollo de Software y Diseño:</span>
              <strong className="text-slate-400 font-semibold">Hecho por Legaint Corporation</strong>
            </div>
          </div>

        </div>
      </footer>

      {/* 6. Login/Register Pop-up Modal (Super Glassmorphic) */}
      <LoginView 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
}
