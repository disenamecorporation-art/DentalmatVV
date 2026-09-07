import React from 'react';
import { ActiveTab, CartItem } from '../types';
import { Search, User, ShoppingCart, Percent, ShieldCheck, Truck, CreditCard, MessageSquare } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  cartItems: CartItem[];
  onToggleCart: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  cartItems,
  onToggleCart,
  onSearch
}) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [showSearchBox, setShowSearchBox] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');

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
    }
  };

  return (
    <header className="w-full z-50 fixed top-0 left-0">
      {/* Top bar with quick high-value points */}
      <div 
        className="w-full bg-white/30 border-b border-white/20 py-2.5 px-4 text-xs font-semibold text-[#0F2C59]"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] md:text-xs">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Envíos a todo el país</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] md:text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Atención rápida por WhatsApp</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] md:text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Productos 100% originales</span>
          </div>
        </div>
      </div>

      {/* Main sticky navigation header */}
      <div 
        id="main-nav-bar"
        className="w-full z-40 transition-all duration-300 bg-white/40 border-b border-white/35 py-2 md:py-3"
        style={{ backdropFilter: 'blur(30px) saturate(140%)', WebkitBackdropFilter: 'blur(30px) saturate(140%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Logo container strictly crop/bounded per user instructions */}
          <div 
            id="logo-brand"
            className="h-16 md:h-22 flex items-center justify-center cursor-pointer select-none"
            onClick={() => onChangeTab('home')}
          >
            <img 
              src="https://i.postimg.cc/8kmZgcfh/dentalweblogo.png" 
              alt="DentalMatVV" 
              referrerPolicy="no-referrer"
              className="h-full w-auto object-contain transition-all duration-200 hover:scale-[1.03]"
            />
          </div>

          {/* Center Navigation Links matching screenshot */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onChangeTab('home')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-blue-600 font-bold' 
                  : 'hover:text-blue-500'
              }`}
            >
              Inicio
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            
            <button
              onClick={() => onChangeTab('tienda')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'tienda' 
                  ? 'text-blue-600 font-bold' 
                  : 'hover:text-blue-500'
              }`}
            >
              Tienda
              {activeTab === 'tienda' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => { onChangeTab('tienda'); onSearch?.('nsk'); }}
              className="hover:text-blue-500 transition-colors text-slate-500 py-1.5 cursor-pointer"
            >
              Marcas
            </button>

            <button
              onClick={() => { onChangeTab('tienda'); onSearch?.('oferta'); }}
              className="hover:text-blue-500 transition-colors text-slate-500 py-1.5 flex items-center gap-1 cursor-pointer"
            >
              <span>Ofertas</span>
              <span className="bg-red-100 text-red-600 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                %
              </span>
            </button>

            <button
              onClick={() => { onChangeTab('tienda'); onSearch?.('Equipamiento'); }}
              className="hover:text-blue-500 transition-colors text-slate-500 py-1.5 cursor-pointer"
            >
              Novedades
            </button>

            <button
              onClick={() => onChangeTab('login')}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'login' 
                  ? 'text-blue-600 font-bold' 
                  : 'hover:text-blue-500'
              }`}
            >
              Mi Cuenta
              {activeTab === 'login' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Icons (Search, User, Cart count indicator) */}
          <div className="flex items-center gap-4">
            
            {/* Search toggler */}
            <div className="relative">
              {showSearchBox ? (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center bg-white shadow-md border border-slate-200 rounded-full py-1.5 px-3 w-56 md:w-72">
                  <input
                    type="text"
                    placeholder="Buscar instrumental, resinas..."
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
                  className="p-2.5 hover:bg-slate-100 rounded-full text-slate-700 transition-colors cursor-pointer"
                  title="Buscar productos"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile icon linking directly to Login view */}
            <button
              id="user-profile-btn"
              onClick={() => onChangeTab('login')}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'login' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Iniciar sesión"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping cart icon with real badge indicator */}
            <button
              id="cart-toggle-btn"
              onClick={onToggleCart}
              className="p-2.5 hover:bg-slate-100 rounded-full text-slate-700 transition-colors relative cursor-pointer"
              title="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Spacing if scrolled to prevent layout jumping */}
      {scrolled && <div className="h-[73px] w-full" />}
    </header>
  );
};
