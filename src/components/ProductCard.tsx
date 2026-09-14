import React from 'react';
import { Product } from '../types';
import { ProductSVG } from './ProductSVG';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  // Formatting price to USD (value divided by 1000 for realistic USD dental pricing)
  const formatPrice = (value: number) => {
    const usdValue = value / 1000;
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="glass-card rounded-2xl p-3.5 sm:p-5 flex flex-col relative transition-all duration-300 ease-out hover:-translate-y-1.5 sm:hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,102,255,0.08)] border border-slate-200/60 hover:border-blue-200/80 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Off/Offer Badges or Trend Badges */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 items-start">
        {product.originalPrice && (
          <span id={`badge-off-${product.id}`} className="bg-red-500 text-white font-bold text-[9px] sm:text-[11px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
        {product.isTrending && (
          <span id={`badge-trend-${product.id}`} className="bg-cyan-500 text-white font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-widest shadow-sm">
            Top
          </span>
        )}
        {product.availability === 'bajo_pedido' && (
          <span id={`badge-pre-${product.id}`} className="bg-amber-500 text-white font-semibold text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider">
            Pedido
          </span>
        )}
      </div>

      {/* Heart Wishlist button */}
      <button
        id={`btn-wish-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition-all duration-200 z-10 ${
          isLiked 
            ? 'bg-red-50 text-red-500 scale-110 shadow-sm' 
            : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-red-50'
        } backdrop-blur-md border border-slate-100 cursor-pointer`}
      >
        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" strokeWidth={isLiked ? 0 : 2} />
      </button>

      {/* Product Image Area */}
      <div 
        id={`img-container-${product.id}`}
        className="w-full aspect-square rounded-xl bg-slate-50/70 mb-2 sm:mb-4 flex items-center justify-center p-2 sm:p-3 overflow-hidden relative cursor-pointer"
        onClick={() => onViewDetails?.(product)}
      >
        <div className={`w-28 h-28 sm:w-40 sm:h-40 transition-transform duration-500 ease-out ${isHovered ? 'scale-105 sm:scale-110 rotate-1' : 'scale-100'}`}>
          <ProductSVG type={product.image} />
        </div>
        
        {/* Quick view overlay (desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center pb-3">
          <span className="text-[12px] font-semibold text-blue-600 bg-white/95 px-3 py-1.5 rounded-full shadow-sm border border-blue-50">
            Vista rápida
          </span>
        </div>
      </div>

      {/* Product Category */}
      <div className="flex items-center justify-between mb-1">
        <span id={`category-${product.id}`} className="text-[9px] sm:text-[11px] font-bold text-blue-600/80 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded truncate">
          {product.category}
        </span>
      </div>

      {/* Title */}
      <h3 
        id={`title-${product.id}`}
        className="text-xs sm:text-base font-bold text-slate-800 line-clamp-2 min-h-[32px] sm:min-h-[48px] hover:text-blue-600 transition-colors cursor-pointer mb-1.5"
        onClick={() => onViewDetails?.(product)}
      >
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-1.5">
        <div className="flex items-center text-amber-400">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          <span className="text-[10px] sm:text-xs font-bold text-slate-700 ml-0.5">{product.rating.toFixed(1)}</span>
        </div>
        <span className="text-[9px] sm:text-[11px] text-slate-400">({product.reviewsCount})</span>
      </div>

      {/* Specifications small list (Visible on larger screens) */}
      <div className="hidden sm:block text-[11px] text-slate-500 mb-4 space-y-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100/50 flex-grow">
        {product.specs.slice(0, 2).map((spec, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="truncate">{spec}</span>
          </div>
        ))}
      </div>

      {/* Price and Cart Button area */}
      <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-100/80 flex items-center justify-between gap-1">
        <div className="flex flex-col min-w-0">
          {product.originalPrice && (
            <span id={`orig-price-${product.id}`} className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span id={`price-${product.id}`} className="text-xs sm:text-base md:text-xl font-extrabold text-[#0F2C59] tracking-tight truncate">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          id={`btn-add-cart-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2 sm:p-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Agregar al carrito"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
