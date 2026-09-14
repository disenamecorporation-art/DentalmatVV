import React from 'react';
import { ActiveTab, CartItem } from '../types';
import { UserProfile } from '../lib/supabase';
import { Search, User, ShoppingCart, Percent, ShieldCheck, Truck, CreditCard, MessageSquare, Database, Shield } from 'lucide-react';

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
    <header className="w-full sticky top-0 z-50 bg-white/35 backdrop-blur-3xl border-b border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_10px_35px_rgba(15,23,89,0.08)] transition-all duration-300">
      
      {/* Main Navigation Bar with Super Glass aesthetics */}
      <div className={`max-w-7xl mx-auto px-4 md:px-8 transition-all duration-200 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Main Logo Brand - Much bigger */}
          <div 
            onClick={() => onChangeTab('home')}
            className="cursor-pointer flex items-center select-none py-1"
          >
            <img 
              src="https://i.postimg.cc/8kmZgcfh/dentalweblogo.png" 
              alt="DentalMatVV" 
              referrerPolicy="no-referrer"
              className="h-16 sm:h-20 md:h-22 lg:h-24 max-h-24 w-auto object-contain transition-all duration-200 hover:scale-[1.03]"
            />
          </div>

          {/* Center Navigation Links */}
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
              onClick={() => { onChangeTab('tienda'); onSearch?.('nsk'); }}
              className="hover:text-blue-600 hover:bg-white/60 transition-all text-slate-600 py-1 px-3 rounded-xl cursor-pointer"
            >
              Marcas
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

            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="py-1 px-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/25 hover:bg-blue-700"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-200" />
                <span>Administración</span>
              </button>
            )}

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
          <div className="flex items-center gap-2.5">
            
            {/* Search toggler */}
            <div className="relative">
              {showSearchBox ? (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center bg-white/70 backdrop-blur-3xl shadow-2xl border border-white/90 rounded-full py-1.5 px-3 w-56 md:w-72">
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
                  className="p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] rounded-full text-slate-700 transition-all cursor-pointer"
                  title="Buscar productos"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Admin Quick Access Button */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                title="Panel de Administración"
              >
                <Shield className="w-5 h-5 text-cyan-200" />
              </button>
            )}

            {/* Profile icon */}
            <button
              id="user-profile-btn"
              onClick={() => onChangeTab('login')}
              className={`p-2.5 rounded-full backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] transition-all cursor-pointer ${
                activeTab === 'login' || currentUser ? 'bg-blue-50/90 text-blue-600' : 'bg-white/50 hover:bg-white/80 text-slate-700'
              }`}
              title={currentUser ? currentUser.email : "Iniciar sesión"}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping cart icon */}
            <button
              id="cart-toggle-btn"
              onClick={onToggleCart}
              className="p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(15,23,89,0.05)] rounded-full text-slate-700 transition-all relative cursor-pointer"
              title="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
