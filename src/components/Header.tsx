import React from 'react';
import { ActiveTab, CartItem } from '../types';
import { UserProfile } from '../lib/supabase';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Percent, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  Database, 
  Shield, 
  Menu, 
  X,
  Home,
  Store,
  Sparkles,
  Phone,
  Flame,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  cartItems: CartItem[];
  onToggleCart: () => void;
  onSearch?: (query: string) => void;
  currentUser?: UserProfile | null;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  cartItems,
  onToggleCart,
  onSearch,
  currentUser,
  onOpenAdmin
}) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [showSearchBox, setShowSearchBox] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
      onChangeTab('tienda');
      setShowSearchBox(false);
      setMobileMenuOpen(false);
    }
  };

  const navigateTo = (tab: ActiveTab, searchKeyword?: string) => {
    onChangeTab(tab);
    if (searchKeyword && onSearch) {
      onSearch(searchKeyword);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/40 backdrop-blur-3xl border-b border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_10px_35px_rgba(15,23,89,0.08)] transition-all duration-300">
      
      {/* Main Navigation Bar with Super Glass aesthetics */}
      <div className={`max-w-7xl mx-auto px-4 md:px-8 transition-all duration-200 ${scrolled ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'}`}>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Burger Button (Visible on Mobile & Tablet < lg) & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-burger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 bg-white/60 hover:bg-white/90 active:scale-95 backdrop-blur-2xl border border-white/80 shadow-sm rounded-2xl text-slate-700 transition-all cursor-pointer"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-[#0F2C59]" />}
            </button>

            {/* Main Logo Brand */}
            <div 
              onClick={() => navigateTo('home')}
              className="cursor-pointer flex items-center select-none py-0.5"
            >
              <img 
                src="https://i.postimg.cc/8kmZgcfh/dentalweblogo.png" 
                alt="DentalMatVV" 
                referrerPolicy="no-referrer"
                className="h-12 sm:h-16 md:h-20 lg:h-22 max-h-24 w-auto object-contain transition-all duration-200 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700 bg-white/50 backdrop-blur-2xl px-6 py-2 rounded-full border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_24px_rgba(15,23,89,0.06)]">
            <button
              onClick={() => onChangeTab('home')}
              className={`relative py-1 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-blue-600 font-bold bg-white/80 border border-white/90 shadow-sm backdrop-blur-lg' 
                  : 'hover:text-blue-600 hover:bg-white/60'
              }`}
            >
              Inicio
            </button>
            
            <button
              onClick={() => onChangeTab('tienda')}
              className={`relative py-1 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tienda' 
                  ? 'text-blue-600 font-bold bg-white/80 border border-white/90 shadow-sm backdrop-blur-lg' 
                  : 'hover:text-blue-600 hover:bg-white/60'
              }`}
            >
              Tienda
            </button>

            <button
              onClick={() => { onChangeTab('tienda'); onSearch?.('oferta'); }}
              className="hover:text-blue-600 hover:bg-white/60 transition-all text-slate-600 py-1 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ofertas</span>
              <span className="bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                %
              </span>
            </button>

            <button
              onClick={() => { onChangeTab('tienda'); onSearch?.('Equipamiento'); }}
              className="hover:text-blue-600 hover:bg-white/60 transition-all text-slate-600 py-1 px-3 rounded-xl cursor-pointer"
            >
              Novedades
            </button>

            <button
              onClick={onOpenAdmin}
              className={`py-1 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                currentUser?.role === 'admin'
                  ? 'bg-blue-600 text-white shadow-blue-600/25 hover:bg-blue-700'
                  : 'bg-slate-900 text-cyan-300 hover:bg-slate-800 border border-slate-700'
              }`}
              title="Panel de Administración (Productos, Textos y Redes)"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              <span>Panel Admin</span>
            </button>

            <button
              onClick={() => onChangeTab('login')}
              className={`relative py-1 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'text-blue-600 font-bold bg-white/80 border border-white/90 shadow-sm backdrop-blur-lg' 
                  : 'hover:text-blue-600 hover:bg-white/60'
              }`}
            >
              {currentUser ? `Hola, ${currentUser.full_name?.split(' ')[0] || 'Doctor'}` : 'Mi Cuenta'}
            </button>
          </nav>

          {/* Right Action Icons (Search, Admin, User, Cart count indicator) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Search toggler */}
            <div className="relative">
              {showSearchBox ? (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center bg-white/90 backdrop-blur-3xl shadow-2xl border border-white/90 rounded-full py-1.5 px-3 w-56 sm:w-72">
                  <input
                    type="text"
                    placeholder="Buscar instrumental..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full text-xs bg-transparent focus:outline-none text-slate-700 pr-2"
                    autoFocus
                  />
                  <button type="submit" className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    <Search className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowSearchBox(false)}
                    className="text-slate-400 hover:text-slate-600 ml-1 text-xs px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  id="search-toggle-btn"
                  onClick={() => setShowSearchBox(true)}
                  className="p-2 sm:p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] rounded-2xl sm:rounded-full text-slate-700 transition-all cursor-pointer"
                  title="Buscar productos"
                >
                  <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Admin Quick Access Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 sm:p-2.5 bg-slate-900 hover:bg-blue-600 text-cyan-300 hover:text-white rounded-2xl sm:rounded-full shadow-md transition-all cursor-pointer border border-slate-700"
              title="Panel de Administración (Editar Productos, Textos, Redes)"
            >
              <Shield className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-cyan-300" />
            </button>

            {/* Profile icon */}
            <button
              id="user-profile-btn"
              onClick={() => onChangeTab('login')}
              className={`p-2 sm:p-2.5 rounded-2xl sm:rounded-full backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] transition-all cursor-pointer ${
                activeTab === 'login' || currentUser ? 'bg-blue-50/90 text-blue-600' : 'bg-white/50 hover:bg-white/80 text-slate-700'
              }`}
              title={currentUser ? currentUser.email : "Iniciar sesión"}
            >
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Shopping cart icon */}
            <button
              id="cart-toggle-btn"
              onClick={onToggleCart}
              className="p-2 sm:p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] rounded-2xl sm:rounded-full text-slate-700 transition-all relative cursor-pointer"
              title="Ver carrito"
            >
              <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE SUPER GLASS MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-fadeIn">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 top-[68px] bg-slate-950/40 backdrop-blur-md z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Card */}
          <div className="relative z-50 mx-3 mb-4 mt-2 bg-white/85 backdrop-blur-3xl rounded-3xl border-2 border-white/90 shadow-[0_20px_60px_rgba(15,23,89,0.25)] p-5 space-y-4 overflow-hidden">
            
            {/* Mobile Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar instrumental, resinas, turbinas..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full text-xs bg-slate-100/80 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Nav Items List */}
            <div className="grid grid-cols-1 gap-1.5 text-sm font-bold text-slate-700">
              <button
                onClick={() => navigateTo('home')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'home' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                    : 'hover:bg-white/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4.5 h-4.5" />
                  <span>Inicio</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => navigateTo('tienda')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'tienda' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                    : 'hover:bg-white/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4.5 h-4.5" />
                  <span>Catálogo Odontológico</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => navigateTo('tienda', 'oferta')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/80 text-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Flame className="w-4.5 h-4.5 text-red-500" />
                  <span>Promociones y Ofertas</span>
                </div>
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  HOT
                </span>
              </button>

              <button
                onClick={() => navigateTo('login')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'login' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                    : 'hover:bg-white/80 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4.5 h-4.5" />
                  <span>{currentUser ? `Cuenta: ${currentUser.full_name || currentUser.email}` : 'Mi Cuenta / Acceso'}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            </div>

            {/* Admin Panel Quick Action on Mobile */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin?.();
                }}
                className="w-full py-3 bg-gradient-to-r from-slate-900 to-[#0F2C59] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md border border-slate-700 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-cyan-300" />
                <span>Panel de Administración (Textos, Redes y Productos)</span>
              </button>
            </div>

            {/* Direct WhatsApp Callout in Mobile Menu */}
            <div className="pt-2 border-t border-slate-200/80">
              <a
                href="https://wa.me/584144873395"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Asesoría Directa por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
