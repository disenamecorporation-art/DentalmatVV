import React from 'react';
import { CartItem, Product } from '../types';
import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { ProductSVG } from './ProductSVG';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [checkoutStep, setCheckoutStep] = React.useState<'cart' | 'checkout-success'>('cart');
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    payMethod: 'pagomovil'
  });

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (value: number) => {
    const usdValue = value / 1000;
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payment method display name
    const payMethodsObj: { [key: string]: string } = {
      pagomovil: 'PagoMóvil',
      zelle: 'Zelle',
      binance: 'Binance',
      efectivo: 'Efectivo',
      transferencia: 'Transferencia Bancaria'
    };
    const payMethodName = payMethodsObj[formData.payMethod] || formData.payMethod;

    // Build cart items detailed text
    const itemsText = cartItems.map(item => {
      const productPriceUsd = item.product.price / 1000;
      const subtotalPriceUsd = productPriceUsd * item.quantity;
      return `• ${item.product.name} (x${item.quantity}) - $${subtotalPriceUsd.toFixed(2)} USD`;
    }).join('\n');

    const totalAmountUsd = totalAmount / 1000;

    // Build gorgeous message
    const message = `🦷 *NUEVO PEDIDO - DENTALMATVV* 🦷\n\n` +
      `👋 Hola, me gustaría confirmar mi pedido:\n\n` +
      `👤 *Cliente:* ${formData.name}\n` +
      `📞 *Teléfono:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      `📍 *Ubicación de entrega:* ${formData.address}\n\n` +
      `🛍️ *Detalle del Pedido:*\n${itemsText}\n\n` +
      `💰 *Total:* $${totalAmountUsd.toFixed(2)} USD\n` +
      `💳 *Método de Pago:* ${payMethodName}\n\n` +
      `🙏 Quedo atento/a para coordinar la entrega y el pago.`;

    // Encode text and redirect to whatsapp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/584144873395?text=${encodedMessage}`;

    // Redirect to whatsapp
    const a = document.createElement('a');
    a.href = whatsappUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();

    // Move to checkout success step
    setCheckoutStep('checkout-success');
  };

  const resetFlow = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div id="cart-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Dark overlay backdrop with click-to-close */}
      <div 
        id="cart-backdrop"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Floating glassmorphism drawer */}
      <div 
        id="cart-panel"
        className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/80 shadow-2xl flex flex-col z-10 transition-transform duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Tu Carrito</h2>
              <p className="text-[11px] text-slate-400">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} añadidos
              </p>
            </div>
          </div>
          <button 
            id="cart-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body based on checkout stage */}
        {checkoutStep === 'cart' ? (
          <>
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-12 h-12" strokeWidth={1} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">El carrito está vacío</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Navega por nuestra tienda virtual y añade los mejores materiales e instrumental odontológico.
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {cartItems.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-4 bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100/80 transition-colors"
                  >
                    {/* Item Image representation */}
                    <div className="w-14 h-14 bg-white rounded-lg p-1 border border-slate-100/50 flex-shrink-0">
                      <ProductSVG type={item.product.image} className="w-full h-full" />
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-900 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        title="Eliminar item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-slate-500 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-1 min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-slate-500 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Simulated Checkout Form */}
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    Datos de Envío y Pago
                  </h3>
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dr./Dra. Juan Pérez"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Teléfono</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+58 412 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email</label>
                        <input 
                          type="email" 
                          required
                          placeholder="doctor@dental.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dirección de Envío (Consultorio)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Urb. Valle Lindo, Calle Principal Sector 2, Turmero"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Método de Pago</label>
                      <select
                        value={formData.payMethod}
                        onChange={(e) => setFormData({...formData, payMethod: e.target.value})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="pagomovil">PagoMóvil</option>
                        <option value="zelle">Zelle</option>
                        <option value="binance">Binance</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <span>Confirmar Pedido ({formatPrice(totalAmount)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Footer calculations if item present but not checkout yet */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-semibold">¡Bonificado gratis!</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-800 pt-2 border-t border-slate-200/60">
                  <span>Total Estimado</span>
                  <span className="text-base text-blue-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Checkout Success Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-500">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">¡Pedido recibido con éxito!</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              Estimado/a <strong className="text-slate-800">{formData.name || 'Doctor/a'}</strong>, hemos registrado su solicitud de pedido para el consultorio en <strong>{formData.address || 'su dirección'}</strong>.
              <br />
              Un asesor de ventas premium de <strong className="text-blue-600">DentalMatVV</strong> se pondrá en contacto al <strong>{formData.phone}</strong> para coordinar la entrega.
            </p>

            <div className="w-full bg-white p-4 rounded-xl border border-slate-200/60 mb-6 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>ID Pedido:</span>
                <span className="font-mono font-semibold text-slate-600">#DM-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Facturado:</span>
                <span className="font-bold text-slate-800">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forma de pago:</span>
                <span className="font-semibold text-blue-600">
                  {formData.payMethod === 'pagomovil' ? 'PagoMóvil' : 
                   formData.payMethod === 'zelle' ? 'Zelle' : 
                   formData.payMethod === 'binance' ? 'Binance' : 
                   formData.payMethod === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria'}
                </span>
              </div>
            </div>

            <button
              onClick={resetFlow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Listo, volver a la tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
