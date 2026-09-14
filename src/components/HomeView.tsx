import React from 'react';
import { Product, SiteContent, DEFAULT_SITE_CONTENT } from '../types';
import { ProductCard } from './ProductCard';
import { ProductSVG } from './ProductSVG';
import { Sparkles, ArrowRight, ShieldCheck, Truck, MessageSquare, Check } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  siteContent?: SiteContent;
  onAddToCart: (product: Product) => void;
  onChangeTab: (tab: 'home' | 'tienda' | 'login') => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  siteContent = DEFAULT_SITE_CONTENT,
  onAddToCart,
  onChangeTab,
  onSelectProduct
}) => {
  const content = siteContent || DEFAULT_SITE_CONTENT;
  const featured = products.filter(p => p.isFeatured);
  const trending = products.filter(p => p.isTrending);

  return (
    <div className="w-full">
      {/* SECTION 1: HERO SECTION - Background image extends to the top behind the super glass navigation menu */}
      <section 
        className="relative w-full overflow-hidden bg-cover bg-top -mt-[84px] md:-mt-[96px] pt-32 md:pt-40 pb-28 md:pb-36"
        style={{ 
          backgroundImage: `url('https://i.postimg.cc/qB19BgCs/Chat-GPT-Image-5-sept-2026-08-48-59-p-m.png')`,
        }}
      >
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text & CTAs */}
            <div className="lg:col-span-6 space-y-6 relative z-10">
              {/* Title & Slogan */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F2C59] tracking-tight leading-tight">
                  {content.hero_title_line1}
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600 tracking-tight leading-tight">
                  {content.hero_title_line2}
                </h2>
              </div>

              {/* Paragraph */}
              <p className="text-slate-600 text-sm md:text-base max-w-lg leading-relaxed font-normal">
                {content.hero_description}
              </p>

              {/* Action Buttons with specified animation on primary CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary CTA */}
                <button
                  id="hero-primary-cta"
                  onClick={() => onChangeTab('tienda')}
                  className="animate-shimmer animate-softglow hover:scale-[1.03] active:scale-95 text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2.5 shadow-lg cursor-pointer"
                >
                  <span>{content.hero_cta_primary}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => onChangeTab('tienda')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-95 text-slate-700 font-bold text-sm md:text-base px-8 py-4 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {content.hero_cta_secondary}
                </button>
              </div>
            </div>

            {/* Right Column Visual layout of screenshot */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center w-full min-h-[360px] select-none z-10">
              
              {/* Floating glassmorphism technology card */}
              <div 
                id="hero-floating-card"
                className="w-full max-w-[320px] md:max-w-[360px] bg-white/35 backdrop-blur-3xl border-2 border-white/50 shadow-[0_30px_70px_rgba(15,23,89,0.22)] rounded-3xl p-8 md:p-10 flex flex-col items-start transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(15,23,89,0.3)]"
                style={{ backdropFilter: 'blur(32px) saturate(130%)', WebkitBackdropFilter: 'blur(32px) saturate(130%)' }}
              >
                <h4 className="text-xl md:text-2xl font-bold text-[#0F2C59] leading-tight tracking-tight select-none">
                  {content.hero_card_title} <br />
                  <span className="text-blue-600 font-extrabold">{content.hero_card_highlight}</span>
                </h4>
                
                {/* Accent horizontal blue indicator */}
                <div className="w-10 h-[4px] bg-blue-600 rounded-full mt-5 mb-10" />
                
                <button 
                  onClick={() => onChangeTab('tienda')}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors group cursor-pointer"
                >
                  <span className="border-b border-transparent group-hover:border-blue-600 transition-all">{content.hero_card_cta}</span>
                  <div className="bg-white/90 group-hover:bg-blue-600 group-hover:text-white text-slate-700 w-10 h-10 rounded-full shadow-sm border border-white/50 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Slider indicators bottom right */}
              <div className="absolute bottom-[-16px] md:bottom-[-24px] right-4 flex items-center gap-1.5">
                <span className="w-5 h-2 rounded-full bg-blue-600 transition-all" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: THREE COLS BOTTOM INFO BAR */}
      <section className="relative z-20 -mt-14 md:-mt-20 max-w-7xl mx-auto px-4 md:px-6">
        <div 
          className="bg-white/35 backdrop-blur-3xl border-2 border-white/55 shadow-[0_25px_60px_rgba(15,23,89,0.18)] rounded-[24px] md:rounded-[32px] p-6 md:p-8"
          style={{ backdropFilter: 'blur(30px) saturate(125%)', WebkitBackdropFilter: 'blur(30px) saturate(125%)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all group">
              <div className="bg-white/60 text-blue-600 p-3 rounded-2xl border border-white/80 shadow-sm group-hover:scale-105 transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">{content.feature1_title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{content.feature1_desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all group">
              <div className="bg-white/60 text-blue-600 p-3 rounded-2xl border border-white/80 shadow-sm group-hover:scale-105 transition-all">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">{content.feature2_title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{content.feature2_desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all group">
              <div className="bg-white/60 text-blue-600 p-3 rounded-2xl border border-white/80 shadow-sm group-hover:scale-105 transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">{content.feature3_title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{content.feature3_desc}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS */}
      <section id="productos-destacados-section" className="max-w-7xl mx-auto px-4 md:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#0F2C59] tracking-tight">
              {content.featured_section_title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{content.featured_section_subtitle}</p>
          </div>
          <button
            onClick={() => onChangeTab('tienda')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ver todos los productos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: BIG HIGH-IMPACT CENTRAL BANNER CTA */}
      <section className="w-full bg-[#0F2C59] relative overflow-hidden py-12 sm:py-20 text-white">
        {/* Abstract glowing medical light effect */}
        <div className="absolute right-[-100px] top-[-100px] w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute left-[-50px] bottom-[-50px] w-80 h-80 bg-cyan-500/15 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {content.banner_title}
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-base leading-relaxed max-w-xl">
              {content.banner_description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>{content.banner_badge1}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>{content.banner_badge2}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>{content.banner_badge3}</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                onClick={() => onChangeTab('tienda')}
                className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 hover:shadow-cyan-400/20 flex items-center justify-center gap-2 text-xs sm:text-base cursor-pointer"
              >
                <span>{content.banner_cta}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRENDING PRODUCTS ("Productos en tendencia") */}
      <section id="productos-tendencia-section" className="max-w-7xl mx-auto px-4 md:px-6 py-10 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#0F2C59] tracking-tight">
            {content.trending_section_title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{content.trending_section_subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {trending.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

