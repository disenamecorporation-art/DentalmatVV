import React, { useState } from 'react';
import { Product } from '../types';
import { 
  CategoryItem, 
  getSupabase, 
  isSupabaseConfigured, 
  UserProfile,
  fetchProductsFromDB,
  fetchCategoriesFromDB
} from '../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Sparkles,
  RefreshCw,
  PackagePlus,
  Layers,
  ArrowRight,
  Image as ImageIcon,
  ExternalLink,
  Tag,
  DollarSign,
  Star,
  Check,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { ProductSVG } from './ProductSVG';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: CategoryItem[];
  userProfile: UserProfile | null;
  onProductsUpdated: (products: Product[]) => void;
  onCategoriesUpdated: (categories: CategoryItem[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  userProfile,
  onProductsUpdated,
  onCategoriesUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // In-app Delete Confirmation State (Bypasses iframe window.confirm blocks)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'category'; id: string; name: string } | null>(null);

  // Edit/Create Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Product Form Data
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brand: 'NSK',
    price: 0,
    originalPrice: 0,
    image: '',
    category: categories[0]?.id || 'Instrumental',
    description: '',
    specs: '',
    isFeatured: false,
    isTrending: false,
    availability: 'disponible' as 'disponible' | 'oferta' | 'bajo_pedido',
    rating: 5.0,
    reviewsCount: 10
  });

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleOpenAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setProductForm({
      id: `prod-${Date.now().toString().slice(-6)}`,
      name: '',
      brand: 'NSK',
      price: 50000,
      originalPrice: 0,
      image: 'https://i.postimg.cc/8kmZgcfh/dentalweblogo.png',
      category: categories[0]?.id || 'Instrumental',
      description: '',
      specs: 'Garantía oficial de fábrica\nEsterilizable en autoclave\nCertificación médica internacional',
      isFeatured: false,
      isTrending: false,
      availability: 'disponible',
      rating: 5.0,
      reviewsCount: 12
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setIsNewProduct(false);
    setEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      image: prod.image,
      category: prod.category,
      description: prod.description,
      specs: prod.specs.join('\n'),
      isFeatured: Boolean(prod.isFeatured),
      isTrending: Boolean(prod.isTrending),
      availability: prod.availability,
      rating: prod.rating,
      reviewsCount: prod.reviewsCount
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showFeedback('error', 'El nombre del producto es obligatorio.');
      return;
    }

    setLoading(true);
    const specsArray = productForm.specs
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const savedProduct: Product = {
      id: productForm.id.trim() || `prod-${Date.now().toString().slice(-6)}`,
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice > 0 ? Number(productForm.originalPrice) : undefined,
      image: productForm.image.trim() || 'turbina',
      category: productForm.category,
      description: productForm.description.trim(),
      specs: specsArray.length > 0 ? specsArray : ['Garantía oficial y soporte clínico'],
      isFeatured: productForm.isFeatured,
      isTrending: productForm.isTrending,
      availability: productForm.availability,
      rating: Number(productForm.rating) || 5.0,
      reviewsCount: Number(productForm.reviewsCount) || 1
    };

    const sb = getSupabase();
    if (sb) {
      try {
        const payload = {
          id: savedProduct.id,
          name: savedProduct.name,
          brand: savedProduct.brand,
          price: savedProduct.price,
          original_price: savedProduct.originalPrice || null,
          image: savedProduct.image,
          category: savedProduct.category,
          description: savedProduct.description,
          specs: savedProduct.specs,
          is_featured: savedProduct.isFeatured,
          is_trending: savedProduct.isTrending,
          availability: savedProduct.availability,
          rating: savedProduct.rating,
          reviews_count: savedProduct.reviewsCount
        };

        const { error } = await sb.from('products').upsert(payload, { onConflict: 'id' });
        if (error) {
          throw error;
        }

        // Re-fetch fresh products directly from Supabase database
        const freshProducts = await fetchProductsFromDB();
        if (freshProducts && freshProducts.length > 0) {
          onProductsUpdated(freshProducts);
        } else {
          onProductsUpdated(
            isNewProduct 
              ? [savedProduct, ...products] 
              : products.map(p => p.id === savedProduct.id ? savedProduct : p)
          );
        }
      } catch (err: any) {
        console.error('Error guardando en Supabase:', err);
        showFeedback('error', `Error en Supabase: ${err.message || 'Verifica permisos RLS de la base de datos'}`);
        setLoading(false);
        return;
      }
    } else {
      // Fallback
      if (isNewProduct) {
        onProductsUpdated([savedProduct, ...products]);
      } else {
        onProductsUpdated(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      }
    }

    showFeedback('success', `Producto "${savedProduct.name}" guardado exitosamente en la base de datos.`);
    setLoading(false);
    setIsProductModalOpen(false);
  };

  const confirmExecuteDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);

    if (itemToDelete.type === 'product') {
      const productId = itemToDelete.id;
      const sb = getSupabase();
      if (sb) {
        try {
          const { error } = await sb.from('products').delete().eq('id', productId);
          if (error) throw error;

          // Re-fetch fresh products from database
          const freshProducts = await fetchProductsFromDB();
          if (freshProducts) {
            onProductsUpdated(freshProducts);
          } else {
            onProductsUpdated(products.filter(p => p.id !== productId));
          }
          showFeedback('success', `Producto "${itemToDelete.name}" eliminado de la base de datos.`);
        } catch (err: any) {
          console.error('Error eliminando en Supabase:', err);
          showFeedback('error', `Error al eliminar de Supabase: ${err.message || 'Error de permisos'}`);
        }
      } else {
        onProductsUpdated(products.filter(p => p.id !== productId));
        showFeedback('success', `Producto eliminado.`);
      }
    } else {
      // Delete category
      const categoryId = itemToDelete.id;
      const sb = getSupabase();
      if (sb) {
        try {
          const { error } = await sb.from('categories').delete().eq('id', categoryId);
          if (error) throw error;

          const freshCategories = await fetchCategoriesFromDB();
          if (freshCategories) {
            onCategoriesUpdated(freshCategories);
          } else {
            onCategoriesUpdated(categories.filter(c => c.id !== categoryId));
          }
          showFeedback('success', `Categoría eliminada de la base de datos.`);
        } catch (err: any) {
          console.error('Error eliminando categoría en Supabase:', err);
          showFeedback('error', `Error al eliminar categoría: ${err.message}`);
        }
      } else {
        onCategoriesUpdated(categories.filter(c => c.id !== categoryId));
        showFeedback('success', `Categoría eliminada.`);
      }
    }

    setItemToDelete(null);
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const id = (newCategoryId.trim() || newCategoryName.trim().replace(/\s+/g, '-')).toLowerCase();
    const newCat: CategoryItem = {
      id,
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim() || undefined,
      sort_order: categories.length + 1
    };

    setLoading(true);
    const sb = getSupabase();
    if (sb) {
      try {
        const { error } = await sb.from('categories').insert({
          id: newCat.id,
          name: newCat.name,
          description: newCat.description || null,
          sort_order: newCat.sort_order
        });
        if (error) throw error;

        // Re-fetch categories directly from database
        const freshCategories = await fetchCategoriesFromDB();
        if (freshCategories) {
          onCategoriesUpdated(freshCategories);
        } else {
          onCategoriesUpdated([...categories, newCat]);
        }
      } catch (err: any) {
        console.error('Error creando categoría en Supabase:', err);
        showFeedback('error', `Error al crear categoría: ${err.message}`);
        setLoading(false);
        return;
      }
    } else {
      onCategoriesUpdated([...categories, newCat]);
    }

    setNewCategoryName('');
    setNewCategoryId('');
    setNewCategoryDesc('');
    showFeedback('success', `Categoría "${newCat.name}" agregada con éxito.`);
    setLoading(false);
  };

  const handleRefreshFromDB = async () => {
    setLoading(true);
    const freshProducts = await fetchProductsFromDB();
    if (freshProducts) {
      onProductsUpdated(freshProducts);
    }
    const freshCategories = await fetchCategoriesFromDB();
    if (freshCategories) {
      onCategoriesUpdated(freshCategories);
    }
    showFeedback('success', 'Catálogo sincronizado directamente desde la base de datos Supabase.');
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      {/* Super Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />

      <div 
        id="admin-panel-container"
        className="max-w-6xl w-full h-[92vh] bg-white/70 backdrop-blur-3xl rounded-[32px] overflow-hidden border-2 border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_30px_90px_rgba(15,23,89,0.35)] relative z-10 flex flex-col"
      >
        
        {/* Header Bar */}
        <div className="p-5 md:px-8 bg-gradient-to-r from-[#0F2C59]/90 to-blue-900/90 text-white flex items-center justify-between border-b border-white/20 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Panel de Administración</h2>
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Gestión de catálogo, imágenes web, precios e inventario en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshFromDB}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-white/15"
              title="Sincronizar con Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sincronizar BD</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-xl transition-all cursor-pointer border border-white/15"
              title="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Pill */}
        {feedback && (
          <div className={`px-6 py-3 text-xs font-semibold flex items-center gap-2 border-b animate-slideDown ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/20 text-emerald-950 border-emerald-300/40' 
              : 'bg-red-500/20 text-red-950 border-red-300/40'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs & Actions Toolbar */}
        <div className="p-4 md:px-8 bg-white/40 backdrop-blur-2xl border-b border-white/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xl p-1 rounded-2xl border border-white/80 shadow-sm">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Productos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categorías ({categories.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            {activeTab === 'products' && (
              <>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar producto por nombre, marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs bg-white/70 backdrop-blur-xl border border-white/90 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
          
          {/* TAB 1: PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const priceUsd = product.price / 1000;
                const isExternalImg = product.image && (product.image.startsWith('http') || product.image.startsWith('data:') || product.image.includes('.'));

                return (
                  <div 
                    key={product.id}
                    className="bg-white/60 backdrop-blur-2xl rounded-2xl p-4 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_20px_rgba(15,23,89,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,89,0.08)] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                          {product.brand}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {product.isFeatured && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              Destacado
                            </span>
                          )}
                          {product.isTrending && (
                            <span className="bg-cyan-100 text-cyan-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-cyan-600" />
                              Tendencia
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Image Preview & Details */}
                      <div className="flex gap-3 mb-3">
                        <div className="w-20 h-20 rounded-xl bg-white/80 border border-white/90 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          <ProductSVG type={product.image} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Cat: <span className="font-medium text-slate-700">{product.category}</span>
                          </p>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="font-extrabold text-blue-600 text-base">
                              ${priceUsd.toFixed(2)} USD
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ${(product.originalPrice / 1000).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Image format indicator */}
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-3 truncate">
                        <ImageIcon className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="truncate">{isExternalImg ? product.image : `Preset SVG: ${product.image}`}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100/80">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="flex-1 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setItemToDelete({ type: 'product', id: product.id, name: product.name })}
                        className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500">
                  <PackagePlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-base text-slate-700">No se encontraron productos</p>
                  <p className="text-xs text-slate-400 mt-1">Crea tu primer producto o ajusta el filtro de búsqueda.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Create Category */}
              <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-md">
                <h3 className="text-base font-extrabold text-[#0F2C59] mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Nueva Categoría</span>
                </h3>

                <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre de la Categoría</label>
                    <input
                      type="text"
                      placeholder="Ej: Ortodoncia y Brackets"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-white/90 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ID Slug (identificador único)</label>
                    <input
                      type="text"
                      placeholder="Ej: ortodoncia"
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-white/90 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Descripción Breve</label>
                    <textarea
                      placeholder="Materiales y consumibles para tratamientos de ortodoncia..."
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      className="w-full p-2.5 bg-white/80 border border-white/90 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar Categoría</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Categories List */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                  <span>Categorías Activas ({categories.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.category === cat.id || p.category === cat.name).length;
                    return (
                      <div 
                        key={cat.id} 
                        className="bg-white/60 backdrop-blur-2xl p-4 rounded-2xl border border-white/80 shadow-sm flex items-start justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{cat.name}</span>
                            <span className="text-[10px] font-bold bg-blue-100/80 text-blue-700 px-2 py-0.2 rounded-full">
                              {count} prods
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                            slug: {cat.id}
                          </span>
                          {cat.description && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                              {cat.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setItemToDelete({ type: 'category', id: cat.id, name: cat.name })}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer shrink-0"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* PRODUCT CREATE / EDIT SUB-MODAL WITH LIVE IMAGE URL PREVIEW */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 md:p-6 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="max-w-3xl w-full max-h-[92vh] bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl border border-white relative z-10">
            
            {/* Modal Header */}
            <div className="p-5 md:px-8 bg-[#0F2C59] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base md:text-lg font-extrabold">
                  {isNewProduct ? 'Añadir Nuevo Producto al Catálogo' : `Editar: ${productForm.name}`}
                </h3>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 md:p-8 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Row 1: ID, Brand, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ID Único (Slug)</label>
                  <input
                    type="text"
                    value={productForm.id}
                    disabled={!isNewProduct}
                    onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
                    placeholder="nsk-ti-max-z95l"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    placeholder="NSK, 3M, Woodpecker, Kerr..."
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Product Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Comercial Completo</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Turbina de Alta Velocidad Ti-Max Z95L con Luz Óptica"
                  required
                />
              </div>

              {/* Row 3: IMAGE URL & LIVE PREVIEW (DEDICATED SECTION) */}
              <div className="p-4 bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>URL de la Imagen del Producto (Cualquier Enlace Web)</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold">Previsualización en Vivo</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Image Preview Box */}
                  <div className="w-32 h-32 rounded-2xl bg-white border-2 border-slate-200 p-2 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden group">
                    <ProductSVG type={productForm.image || 'turbina'} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      Vista previa
                    </div>
                  </div>

                  {/* Input & Helper buttons */}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                      placeholder="https://i.postimg.cc/... o https://tu-sitio.com/foto.jpg"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-500 font-medium">O seleccionar ilustración clínica:</span>
                      {['turbina', 'apex', 'resina', 'lampara', 'ultrasonido', 'fresa'].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: preset })}
                          className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            productForm.image === preset 
                              ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Prices & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio Actual (Ej: 85000 = $85.00)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-blue-600 pl-7 text-sm"
                      placeholder="50000"
                      required
                    />
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio Anterior (Opcional p/ Ofertas)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-600 pl-7 text-sm"
                      placeholder="0"
                    />
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado de Disponibilidad</label>
                  <select
                    value={productForm.availability}
                    onChange={(e) => setProductForm({ ...productForm, availability: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
                  >
                    <option value="disponible">En Stock / Disponible Inmediato</option>
                    <option value="oferta">En Oferta Especial</option>
                    <option value="bajo_pedido">Bajo Pedido</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Switches (Featured & Trending) */}
              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Producto Destacado en Inicio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isTrending}
                    onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Badge de Tendencia</span>
                </label>
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Producto</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 leading-relaxed"
                  rows={3}
                  placeholder="Detalles técnicos, materiales, ergonomía, compatibilidad..."
                />
              </div>

              {/* Row 7: Specs (1 per line) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Especificaciones Técnicas (1 por línea)</label>
                <textarea
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                  rows={3}
                  placeholder="Cabezal miniatura de titanio&#10;Velocidad hasta 400.000 rpm&#10;Sistema de triple spray"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar en Base de Datos'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* IN-APP DELETE CONFIRMATION MODAL (Reliable in iFrame) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            onClick={() => setItemToDelete(null)}
          />

          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-red-200 shadow-2xl relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                ¿Eliminar {itemToDelete.type === 'product' ? 'Producto' : 'Categoría'}?
              </h3>
              <p className="text-xs text-slate-600">
                Esta acción eliminará <strong className="text-slate-900">"{itemToDelete.name}"</strong> permanentemente de la base de datos Supabase.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmExecuteDelete}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{loading ? 'Eliminando...' : 'Sí, Eliminar de la BD'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
