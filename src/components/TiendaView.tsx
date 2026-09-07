import React from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, RefreshCw, Star, Info } from 'lucide-react';
import { CATEGORIES, BRANDS } from '../data';

interface TiendaViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  searchFilter: string;
}

export const TiendaView: React.FC<TiendaViewProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
  searchFilter
}) => {
  // State for active filters
  const [filters, setFilters] = React.useState<FilterState>({
    searchQuery: searchFilter || '',
    category: 'Todos',
    brand: [],
    priceRange: [0, 1500000],
    availability: [],
    sortBy: 'popular'
  });

  const [visibleCount, setVisibleCount] = React.useState(8);

  // Synchronize when the user types in the Header's search bar
  React.useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery: searchFilter }));
  }, [searchFilter]);

  // Handle category selection
  const handleCategoryChange = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId }));
  };

  // Handle brand checkbox toggling
  const handleBrandToggle = (brandName: string) => {
    setFilters(prev => {
      const isChecked = prev.brand.includes(brandName);
      const newBrands = isChecked 
        ? prev.brand.filter(b => b !== brandName)
        : [...prev.brand, brandName];
      return { ...prev, brand: newBrands };
    });
  };

  // Handle availability toggling
  const handleAvailabilityToggle = (status: string) => {
    setFilters(prev => {
      const isChecked = prev.availability.includes(status);
      const newAvailability = isChecked
        ? prev.availability.filter(a => a !== status)
        : [...prev.availability, status];
      return { ...prev, availability: newAvailability };
    });
  };

  // Handle slider changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({ ...prev, priceRange: [0, value] }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'Todos',
      brand: [],
      priceRange: [0, 1500000],
      availability: [],
      sortBy: 'popular'
    });
    setVisibleCount(8);
  };

  // Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        // Check brand or name or description or category matches
        const matchesQuery = 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        
        // Custom tag/special queries like 'oferta'
        if (query === 'oferta') {
          return product.availability === 'oferta';
        }
        
        if (!matchesQuery) return false;
      }

      // 2. Category
      if (filters.category !== 'Todos') {
        if (product.category !== filters.category) return false;
      }

      // 3. Brands list
      if (filters.brand.length > 0) {
        if (!filters.brand.includes(product.brand)) return false;
      }

      // 4. Price range limit
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // 5. Availability status
      if (filters.availability.length > 0) {
        if (!filters.availability.includes(product.availability)) return false;
      }

      return true;
    }).sort((a, b) => {
      // 6. Sorting configuration
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'novedad') {
        // Mocking novelty by product id order
        return b.id.localeCompare(a.id);
      }
      // 'popular' rating sort
      return b.rating - a.rating;
    });
  }, [products, filters]);

  // Paginated/Sliced subset
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      
      {/* Intro banner with sharp glassmorphism background */}
      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 border border-white/60 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(0,102,255,0.03)]">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F2C59] tracking-tight">
            Catálogo Odontológico
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Explore los insumos y equipamientos líderes importados de Alemania, Japón y EE.UU. con certificación internacional y soporte clínico de primer nivel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Stats inside Header Banner */}
          <div className="bg-white/80 border border-slate-100 rounded-xl px-4 py-2.5 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total items</span>
            <span className="text-sm font-extrabold text-blue-600">{filteredProducts.length}</span>
          </div>
          <div className="bg-white/80 border border-slate-100 rounded-xl px-4 py-2.5 text-center">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Categorías</span>
            <span className="text-sm font-extrabold text-[#0F2C59]">4</span>
          </div>
          <button 
            onClick={handleResetFilters}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl border border-blue-100/50 transition-colors cursor-pointer"
            title="Limpiar filtros"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTER SIDEBAR (Defined Glassmorphism) */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-[120px]">
          
          {/* Search box within Tienda */}
          <div className="glass-card rounded-2xl p-5 border border-white/50 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              <span>Búsqueda Rápida</span>
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por marca, modelo..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full text-xs bg-white/90 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/50 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Categorías
            </h3>
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    filters.category === cat.id
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span>{cat.name}</span>
                  {filters.category === cat.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/50 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Presupuesto Máx
              </h3>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                $ {filters.priceRange[1].toLocaleString('es-CL')}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="1500000"
              step="5000"
              value={filters.priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>$ 5.000</span>
              <span>$ 1.500.000+</span>
            </div>
          </div>

          {/* Brands Filter Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/50 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Marcas autorizadas
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {BRANDS.map(brandName => {
                const isChecked = filters.brand.includes(brandName);
                return (
                  <label 
                    key={brandName}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBrandToggle(brandName)}
                      className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span>{brandName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Availability Filter Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/50 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Disponibilidad
            </h3>
            <div className="space-y-2">
              {[
                { id: 'disponible', label: 'En Stock / Entrega Inmediata' },
                { id: 'oferta', label: 'En Oferta / Descuento especial' },
                { id: 'bajo_pedido', label: 'Importación bajo pedido' }
              ].map(item => {
                const isChecked = filters.availability.includes(item.id);
                return (
                  <label 
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-slate-950 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAvailabilityToggle(item.id)}
                      className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: SEARCH BAR, SORTING & PRODUCTS GRID */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Sorter and summary header bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">
              Mostrando <strong className="text-slate-800">{displayedProducts.length}</strong> de <strong className="text-slate-800">{filteredProducts.length}</strong> productos disponibles
            </div>

            {/* Sorting selectors */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Ordenar por:</span>
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="text-xs bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700 cursor-pointer"
              >
                <option value="popular">Popularidad y Rating</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="novedad">Novedades del Mes</option>
              </select>
            </div>
          </div>

          {/* Empty Results state */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No se encontraron productos</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                No hay coincidencias para los filtros seleccionados o el término de búsqueda. Intente modificando el rango de precios o buscando con otras palabras clave.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Restablecer Catálogo
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onSelectProduct}
              />
            ))}
          </div>

          {/* Load More Button for infinite scroll look and feel */}
          {filteredProducts.length > displayedProducts.length && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-blue-600 font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Cargar más productos</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
