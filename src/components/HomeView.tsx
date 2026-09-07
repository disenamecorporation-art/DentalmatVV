import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductSVG } from './ProductSVG';
import { Sparkles, ArrowRight, ShieldCheck, Truck, CreditCard, ChevronRight, Check, MessageSquare } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onChangeTab: (tab: 'home' | 'tienda' | 'login') => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onAddToCart,
  onChangeTab,
  onSelectProduct
}) => {
  const featured = products.filter(p => p.isFeatured);
  const trending = products.filter(p => p.isTrending);

  return (
    <div className="w-full">
      {/* SECTION 1: HERO SECTION - Exact layout representation from screenshot with full background image stretching behind fixed header */}
      <section 
        className="relative w-full overflow-hidden bg-cover bg-center pt-36 pb-36 md:pt-48 md:pb-40"
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
                  Equipamiento que eleva tu práctica.
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600 tracking-tight leading-tight">
                  Resultados que <br /> inspiran confianza.
                </h2>
              </div>

              {/* Paragraph */}
              <p className="text-slate-600 text-sm md:text-base max-w-lg leading-relaxed font-normal">
                Instrumental, materiales y tecnología dental seleccionados por expertos, para expertos. Eleve el nivel de su clínica con la máxima precisión del mercado global.
              </p>

              {/* Action Buttons with specified animation on primary CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary CTA - shimmer effect & soft blue-sky glow pulse */}
                <button
                  id="hero-primary-cta"
                  onClick={() => onChangeTab('tienda')}
                  className="animate-shimmer animate-softglow hover:scale-[1.03] active:scale-95 text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2.5 shadow-lg cursor-pointer"
                >
                  <span>Ver productos</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => onChangeTab('tienda')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-95 text-slate-700 font-bold text-sm md:text-base px-8 py-4 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Conocer más
                </button>
              </div>
            </div>

            {/* Right Column Visual layout of screenshot - Glass card floats elegantly over the full hero background */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center w-full min-h-[360px] select-none z-10">
              
              {/* Floating glassmorphism technology card exactly as seen in screenshot - Made "Mas GLASS" with high blur and lower opacity */}
              <div 
                id="hero-floating-card"
                className="w-full max-w-[320px] md:max-w-[360px] bg-white/35 backdrop-blur-3xl border-2 border-white/50 shadow-[0_30px_70px_rgba(15,23,89,0.22)] rounded-3xl p-8 md:p-10 flex flex-col items-start transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(15,23,89,0.3)]"
                style={{ backdropFilter: 'blur(32px) saturate(130%)', WebkitBackdropFilter: 'blur(32px) saturate(130%)' }}
              >
                <h4 className="text-xl md:text-2xl font-bold text-[#0F2C59] leading-tight tracking-tight select-none">
                  Tecnología <br />
                  en la que <br />
                  puedes <span className="text-blue-600 font-extrabold">confiar</span>
                </h4>
                
                {/* Thick accent horizontal blue indicator underneath the text */}
                <div className="w-10 h-[4px] bg-blue-600 rounded-full mt-5 mb-10" />
                
                <button 
                  onClick={() => onChangeTab('tienda')}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors group cursor-pointer"
                >
                  <span className="border-b border-transparent group-hover:border-blue-600 transition-all">Explorar categoría</span>
                  <div className="bg-white/90 group-hover:bg-blue-600 group-hover:text-white text-slate-700 w-10 h-10 rounded-full shadow-sm border border-white/50 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Simple aesthetic slider indicators bottom right */}
              <div className="absolute bottom-[-16px] md:bottom-[-24px] right-4 flex items-center gap-1.5">
                <span className="w-5 h-2 rounded-full bg-blue-600 transition-all" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: THREE COLS BOTTOM INFO BAR - OVERLAPPING HERO WITH SUPER GLASS STYLE */}
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
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">Garantía oficial</h4>
                <p className="text-xs text-slate-500 mt-0.5">en todos los productos de nuestro catálogo</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all group">
              <div className="bg-white/60 text-blue-600 p-3 rounded-2xl border border-white/80 shadow-sm group-hover:scale-105 transition-all">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">Envíos rápidos</h4>
                <p className="text-xs text-slate-500 mt-0.5">a todo el país para que tu clínica nunca se detenga</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/20 transition-all group">
              <div className="bg-white/60 text-blue-600 p-3 rounded-2xl border border-white/80 shadow-sm group-hover:scale-105 transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">Atención directa</h4>
                <p className="text-xs text-slate-500 mt-0.5">vía WhatsApp para asesoría personalizada y pedidos rápidos</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS ("Productos destacados") */}
      <section id="productos-destacados-section" className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0F2C59] tracking-tight">
              Productos destacados
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Los instrumentos de máxima precisión preferidos por cirujanos dentales</p>
          </div>
          <button
            onClick={() => onChangeTab('tienda')}
            className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>Ver todos los productos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* SECTION 4: BIG HIGH-IMPACT HERO BANNER CTA */}
      <section className="w-full bg-[#0F2C59] relative overflow-hidden py-16 md:py-20 text-white">
        {/* Abstract glowing medical light effect */}
        <div className="absolute right-[-100px] top-[-100px] w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute left-[-50px] bottom-[-50px] w-80 h-80 bg-cyan-500/15 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="bg-blue-500/20 border border-blue-400/30 text-cyan-300 font-extrabold text-[11px] px-3.5 py-1.5 rounded-full uppercase tracking-widest">
              CONTRATACIÓN CORPORATIVA & CLÍNICAS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              ¿Equipando un nuevo consultorio dental?
            </h2>
            <p className="text-blue-100/80 text-sm md:text-base leading-relaxed max-w-xl">
              Ofrecemos planes de financiamiento a medida, instalación técnica certificada de sillones y autoclaves, y descuentos por volumen corporativo para clínicas y facultades de odontología.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>Asistencia Técnica 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>Capacitaciones de uso</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
                <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>Garantía de hasta 3 años</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onChangeTab('tienda')}
                className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 hover:shadow-cyan-400/20 flex items-center gap-2 text-sm md:text-base cursor-pointer"
              >
                <span>Solicitar presupuesto corporativo</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRENDING PRODUCTS ("Productos en tendencia") */}
      <section id="productos-tendencia-section" className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0F2C59] tracking-tight">
            Productos en tendencia
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Los consumibles y accesorios más comprados esta semana por laboratorios y odontólogos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
