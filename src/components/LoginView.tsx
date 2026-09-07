import React from 'react';
import { Shield, Sparkles, CheckCircle, Mail, Lock, User, Check, ArrowRight, X } from 'lucide-react';

interface LoginViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login');
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    clinicalId: '',
    acceptTerms: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Simulate login and let them experience success
    }, 2000);
  };

  const handleToggle = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Dynamic blurred background backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Premium Super Glassmorphic Card Container */}
      <div 
        id="auth-popup-container"
        className="max-w-md w-full bg-white/35 backdrop-blur-3xl rounded-[32px] overflow-hidden border-2 border-white/60 shadow-[0_40px_90px_rgba(15,23,89,0.25)] relative z-10 flex flex-col transition-all duration-300 hover:shadow-[0_50px_100px_rgba(15,23,89,0.32)]"
        style={{ backdropFilter: 'blur(32px) saturate(140%)', WebkitBackdropFilter: 'blur(32px) saturate(140%)' }}
      >
        
        {/* Soft glowing ambient lighting behind card */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/15 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full filter blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-white/40 hover:bg-white/60 text-slate-700 hover:text-slate-950 rounded-full border border-white/50 transition-all cursor-pointer shadow-sm"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Selection with Super Glass theme */}
        <div className="flex border-b border-white/20 bg-white/20 p-2 relative z-10">
          <button
            onClick={() => handleToggle('login')}
            className={`flex-1 text-center py-3.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white/85 text-blue-600 shadow-md backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/10'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => handleToggle('register')}
            className={`flex-1 text-center py-3.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white/85 text-blue-600 shadow-md backdrop-blur-md'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/10'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] relative z-10">
          
          {/* Logo brand and welcome text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-[#0F2C59] tracking-tight leading-tight select-none">
              {activeTab === 'login' ? '¡Bienvenido de vuelta!' : 'Únete a la red de cirujanos'}
            </h2>
            <p className="text-xs text-slate-500/90 max-w-xs mx-auto leading-relaxed">
              {activeTab === 'login' 
                ? 'Accede a precios especiales de distribuidor clínico inmediato.' 
                : 'Regístrate gratis para facturación simplificada y despacho gratis.'
              }
            </p>
          </div>

          {submitted ? (
            /* Success Feedback Layout - Super Glass card styled */
            <div className="space-y-5 py-6 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50/70 border border-emerald-100/80 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0F2C59]">
                  {activeTab === 'login' ? '¡Sesión Iniciada con éxito!' : '¡Registro Completado!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {activeTab === 'login'
                    ? 'Hemos autenticado tus credenciales médicas. Ahora cuentas con un descuento adicional del 10% en el catálogo.'
                    : `Se ha enviado un enlace de verificación a ${formData.email || 'tu correo'}. Completa tu alta en tu perfil para comenzar a operar.`
                  }
                </p>
              </div>

              <div className="bg-white/45 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-left text-xs text-slate-600 space-y-2 shadow-sm">
                <div className="flex justify-between font-bold text-[#0F2C59]">
                  <span>Usuario:</span>
                  <span>{formData.name || 'Doctor/a Dental'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Credencial Médica:</span>
                  <span className="text-blue-600 font-mono font-bold">Activa (#DM-934)</span>
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all cursor-pointer"
              >
                Volver a {activeTab === 'login' ? 'Formulario' : 'Crear Cuenta'}
              </button>
            </div>
          ) : (
            /* Interactive Forms */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Registration specific fields */}
              {activeTab === 'register' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1.5">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Dr. Matías Vicuña"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full text-xs bg-white/45 border-2 border-white/60 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 focus:bg-white/70 text-[#0F2C59] font-semibold placeholder-slate-500/70 transition-all"
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Shared inputs */}
              <div>
                <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="doctor@clinicadental.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full text-xs bg-white/45 border-2 border-white/60 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 focus:bg-white/70 text-[#0F2C59] font-semibold placeholder-slate-500/70 transition-all"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full text-xs bg-white/45 border-2 border-white/60 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 focus:bg-white/70 text-[#0F2C59] font-semibold placeholder-slate-500/70 transition-all"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* Registration specific confirm password & terms */}
              {activeTab === 'register' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1.5">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full text-xs bg-white/45 border-2 border-white/60 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 focus:bg-white/70 text-[#0F2C59] font-semibold placeholder-slate-500/70 transition-all"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-[11px] text-slate-600 font-bold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-white/60 bg-white/30 rounded focus:ring-blue-500 cursor-pointer accent-blue-600 mt-0.5"
                    />
                    <span className="leading-normal">
                      Acepto los términos de comercialización regulada de insumos médicos de DentalMatVV.
                    </span>
                  </label>
                </>
              )}

              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="flex items-center gap-2 text-slate-600 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-3.5 h-3.5 text-blue-600 border-white/60 bg-white/30 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span>Recordarme</span>
                  </label>
                  <button type="button" className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                    ¿Olvidó su contraseña?
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <span>{activeTab === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
