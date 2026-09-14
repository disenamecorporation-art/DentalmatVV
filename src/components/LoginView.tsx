import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  CheckCircle, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  X, 
  AlertCircle,
  Database,
  LogOut,
  Settings,
  Phone,
  Building
} from 'lucide-react';
import { getSupabase, isSupabaseConfigured, UserProfile } from '../lib/supabase';

interface LoginViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  onOpenAdminPanel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  isOpen, 
  onClose,
  currentUser,
  onUserChange,
  onOpenAdminPanel
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    clinicalId: '',
    acceptTerms: true
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const sb = getSupabase();

    if (!sb) {
      // Offline / Local Demo mode
      setTimeout(() => {
        const demoUser: UserProfile = {
          id: 'demo-admin-id',
          email: formData.email || 'admin@dentalmatvv.com',
          full_name: formData.name || (activeTab === 'login' ? 'Dr. Administrador Dental' : 'Dr. ' + formData.name),
          role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'customer',
          clinical_id: formData.clinicalId || 'CLINIC-902',
          phone: formData.phone || '+58 412 1234567'
        };
        onUserChange(demoUser);
        setSuccessMessage(
          activeTab === 'login' 
            ? '¡Sesión iniciada con éxito! (Modo Local / Demo)' 
            : '¡Cuenta registrada con éxito! (Modo Local / Demo)'
        );
        setLoading(false);
      }, 700);
      return;
    }

    try {
      if (activeTab === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('Las contraseñas no coinciden.');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
          setLoading(false);
          return;
        }

        // Supabase SignUp with metadata (profile trigger handles the rest)
        const { data, error } = await sb.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.name.trim(),
              phone: formData.phone.trim(),
              clinical_id: formData.clinicalId.trim(),
              role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'customer'
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || formData.email,
            full_name: formData.name,
            role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'customer',
            phone: formData.phone,
            clinical_id: formData.clinicalId
          };
          onUserChange(profile);
          setSuccessMessage('¡Cuenta creada e iniciada exitosamente sin confirmación!');
        }
      } else {
        // Supabase SignIn
        const { data, error } = await sb.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Fetch user role from profiles table
          const { data: profData } = await sb
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || formData.email,
            full_name: profData?.full_name || data.user.user_metadata?.full_name || 'Doctor/a',
            role: profData?.role || (data.user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer'),
            phone: profData?.phone,
            clinical_id: profData?.clinical_id
          };
          onUserChange(profile);
          setSuccessMessage('¡Bienvenido de vuelta!');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'Error al autenticar. Por favor verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const sb = getSupabase();
    if (sb) {
      await sb.auth.signOut();
    }
    onUserChange(null);
    setSuccessMessage('Has cerrado sesión.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Dynamic blurred background backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Premium Super Glassmorphic Card Container */}
      <div 
        id="auth-popup-container"
        className="max-w-md w-full bg-white/40 backdrop-blur-3xl rounded-[36px] overflow-hidden border-2 border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_40px_100px_rgba(15,23,89,0.3)] relative z-10 flex flex-col transition-all duration-300"
      >
        
        {/* Soft glowing ambient lighting behind card */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/25 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-400/25 rounded-full filter blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-white/60 hover:bg-white/90 backdrop-blur-2xl text-slate-700 hover:text-slate-950 rounded-full border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* User Profile View (Already Logged In) */
          <div className="p-8 space-y-6 text-center relative z-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-blue-600/30 border-2 border-white">
              {currentUser.full_name?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-bold text-[#0F2C59]">
                  {currentUser.full_name || 'Doctor Clínico'}
                </h3>
                {currentUser.role === 'admin' && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-300 shadow-sm">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{currentUser.email}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 pt-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0F2C59] to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/25 transition-all cursor-pointer border border-white/20"
                >
                  <Shield className="w-4 h-4 text-cyan-300" />
                  <span>Abrir Panel de Administración</span>
                </button>
              ) : (
                <div className="p-3.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-xs text-blue-900 text-left space-y-1 shadow-sm">
                  <p className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Cuenta Médica Verificada
                  </p>
                  <p className="text-[11px] text-blue-700/90 font-medium">
                    Disfruta de tarifas preferenciales en instrumental y compras con entrega prioritaria.
                  </p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-white/60 hover:bg-red-50/80 backdrop-blur-xl text-slate-700 hover:text-red-600 border border-white/80 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login & Registration Flow */
          <>
            {/* Tab Selection */}
            <div className="flex border-b border-white/60 bg-white/25 backdrop-blur-2xl p-2 relative z-10">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 text-center py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white/80 text-blue-600 shadow-md backdrop-blur-xl border border-white/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 text-center py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white/80 text-blue-600 shadow-md backdrop-blur-xl border border-white/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8 space-y-5 overflow-y-auto max-h-[75vh] relative z-10">
              
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl font-extrabold text-[#0F2C59] tracking-tight">
                  {activeTab === 'login' ? '¡Bienvenido de vuelta!' : 'Únete a DentalMatVV'}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {activeTab === 'login' 
                    ? 'Ingresa a tu cuenta para gestionar pedidos y catálogo.' 
                    : 'Registro inmediato sin esperas ni confirmación de email.'
                  }
                </p>
              </div>

              {/* Status Alert Messages */}
              {errorMessage && (
                <div className="p-3 bg-red-50/90 backdrop-blur-xl border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50/90 backdrop-blur-xl border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Registration fields */}
                {activeTab === 'register' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                        Nombre y Apellido
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Dr. Carlos Rodríguez"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                          Teléfono
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="0412-1234567"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                          Clínica (Opcional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Centro Odontológico"
                            value={formData.clinicalId}
                            onChange={(e) => setFormData({...formData, clinicalId: e.target.value})}
                            className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                          />
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email & Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="doctor@clinicadental.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {activeTab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider mb-1">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full text-xs bg-white/50 border border-white/80 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 backdrop-blur-xl text-slate-800 font-semibold shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                      />
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer border border-white/20"
                >
                  <span>{loading ? 'Procesando...' : (activeTab === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

              {/* Admin Shortcut for Testing / Fast Preview */}
              <div className="pt-2 border-t border-white/60 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const testAdmin: UserProfile = {
                      id: 'admin-master-id',
                      email: 'admin@dentalmatvv.com',
                      full_name: 'Administrador DentalMatVV',
                      role: 'admin',
                      clinical_id: 'ADMIN-01'
                    };
                    onUserChange(testAdmin);
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Acceso Directo Modo Administrador</span>
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
