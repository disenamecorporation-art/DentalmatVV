import React, { useState, useEffect } from 'react';
import { ActiveTab, CartItem, Product } from './types';
import { PRODUCTS, CATEGORIES } from './data';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { TiendaView } from './components/TiendaView';
import { LoginView } from './components/LoginView';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { ProductSVG } from './components/ProductSVG';
import { 
  fetchProductsFromDB, 
  fetchCategoriesFromDB, 
  getSupabase, 
  UserProfile, 
  CategoryItem 
} from './lib/supabase';
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
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic products and categories state (with seamless local fallback)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Fetch data and auth state from Supabase on mount
  useEffect(() => {
    const initData = async () => {
      const dbProducts = await fetchProductsFromDB();
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }

      const dbCategories = await fetchCategoriesFromDB();
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      }

      const sb = getSupabase();
      if (sb) {
        // Check current active session
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user) {
          const { data: profile } = await sb
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Doctor/a',
            role: profile?.role || (session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer'),
            phone: profile?.phone,
            clinical_id: profile?.clinical_id
          });
        }

        // Listen for auth changes
        const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await sb
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || 'Doctor/a',
              role: profile?.role || (session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer'),
              phone: profile?.phone,
              clinical_id: profile?.clinical_id
            });
          } else {
            setCurrentUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    };

    initData();
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'login') {
      setIsAuthOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  // Scroll to top on tab change
  useEffect(() => {
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
    
    // Auto-open cart for user feedback
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
        currentUser={currentUser}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Main Content Wrapper */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomeView
            products={products}
            onAddToCart={handleAddToCart}
            onChangeTab={handleTabChange}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {activeTab === 'tienda' && (
          <TiendaView
            products={products}
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

      {/* 4. Product Quick-View Detailed Modal */}
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
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedProduct.rating} ({selectedProduct.reviewsCount} evaluaciones clínicas)
                  </span>
                </div>

                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm line-through text-slate-400">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  {selectedProduct.description}
                </p>

                {/* Specs bullets */}
                <div className="pt-2 space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">Especificaciones:</p>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    {selectedProduct.specs.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Add to cart action */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-slate-800/80">
            
            {/* Column 1: Brand details with Logo */}
            <div className="space-y-4 max-w-md">
              <div className="flex items-center">
                <img 
                  src="https://i.postimg.cc/8kmZgcfh/dentalweblogo.png" 
                  alt="DentalMatVV" 
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain brightness-110"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Distribuidora líder de instrumental rotatorio, equipamiento clínico de vanguardia y consumibles odontológicos de máxima precisión.
              </p>
              
              <div className="pt-1 flex items-center gap-3 text-slate-400">
                <a href="#instagram" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#facebook" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#twitter" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Contact details & Sede */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Atención y Sede</h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Urbanización valle lindo, calle principal sector 2, al lado del C.E.I.P Los Niños del Libertador, municipio Santiago mariño, Turmero, Edo. Aragua, Venezuela.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="https://wa.me/584144873395" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 font-semibold text-slate-300">
                    +58 414-4873395 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>+58 244 661 1090 (Oficina)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>ventas@dentalmatvv.com</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Credits bottom bar */}
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

      {/* 6. Login/Register Pop-up Modal */}
      <LoginView 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />

      {/* 7. Full Admin Panel for Products & Categories Management */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        userProfile={currentUser}
        onProductsUpdated={setProducts}
        onCategoriesUpdated={setCategories}
      />

    </div>
  );
}
