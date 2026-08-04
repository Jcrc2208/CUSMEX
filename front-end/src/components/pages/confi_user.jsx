import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UserCog,
  ShieldCheck,
  X,
  Link,
  Mail,
  Lock,
  LogOut,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- OPCIONES PARA TU BASE DE DATOS (UUID char(36)) ---

const ROLE_OPTIONS = [
  { id: '3f8a12b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b', nombre: 'Usuario General / Miembro' },
  { id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', nombre: 'Empresa / Exportador - Importador' },
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', nombre: 'Inversionista / Aliado Comercial' },
  { id: '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c', nombre: 'Administrador / Gestor' }
];

const ORGANIZATION_OPTIONS = [
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', nombre: 'CUSMEX Corp' },
  { id: 'f8e7d6c5-b4a3-2f1e-0d9c-8b7a6f5e4d3c', nombre: 'Universidad Nacional' },
  { id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', nombre: 'Tech Alliance Group' },
  { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', nombre: 'Innovación & Comercio S.A.' },
  { id: '00000000-0000-0000-0000-000000000000', nombre: 'Independiente / Sin Organización' }
];

const AVAILABLE_TOPICS = [
  { id: '1', nombre: 'Inteligencia Artificial Aplicada' },
  { id: '2', nombre: 'Nearshoring y Cadenas Globales' },
  { id: '3', nombre: 'Fintech y Medios de Pago' }
];

const COUNTRY_OPTIONS = [
  'México',
  'Estados Unidos',
  'Colombia'
];

const COMMERCIAL_INTEREST_OPTIONS = [
  'Tecnología y Software',
  'Agroindustria y Alimentos',
  'Manufactura e Industria Automotriz',
  'Energías Limpias y Renovables',
  'Logística y Cadenas de Suministro'
];

const INVESTMENT_GOALS_OPTIONS = [
  'Levantamiento de Capital / Búsqueda de Inversionistas',
  'Inversión Directa en Startups o Proyectos',
  'Expansión e Internacionalización de Mercado',
  'Alianzas Estratégicas y Joint Ventures'
];

const CONNECTION_TYPES_OPTIONS = [
  'Socios Comerciales B2B',
  'Proveedores de Servicios o Materia Prima',
  'Clientes Potenciales',
  'Mentores y Asesores de Industria'
];

export default function ConfiUser({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onNavigate
}) {
  const t = COPY[language] ?? COPY.es;
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const totalSteps = 3;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    if (onNavigate) {
      onNavigate('auth');
    }
  };

  const singleLogoutMenu = [
    {
      id: 'logout',
      label: 'Cerrar sesión',
      title: 'Cerrar sesión',
      icon: LogOut,
      onClick: handleLogout,
      danger: true,
      variant: 'destructive'
    }
  ];

  // Estado sincronizado con las columnas exactas de tu tabla MySQL
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: '',
    idioma_preferido: '',
    organizacion_id: '',         // texto libre
    rol_id: '',                  // texto libre
    interes_comercial: '',
    objetivos_inversion: '',
    interes_export_import: 'ambos',
    tipo_conexion_buscada: '',
    linkedin: '',
    temas: ''
  });

  const isEmailValid = () => {
    const email = formData.email.trim();
    return (
      email !== '' &&
      /^[a-zA-Z0-9._%+-]+@cusmex\.com$/i.test(email)
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLinkedinValid = () => {
    const url = formData.linkedin.trim();
    if (!url) return false;
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      /(^|\.)linkedin\.com$/i.test(parsed.hostname)
    );
  };

  // Validación estricta incluyendo rol_id y organizacion_id
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.nombre.trim() !== '' &&
          formData.apellido.trim() !== '' &&
          isEmailValid() &&
          formData.password.trim() !== '' &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword &&
          formData.pais.trim() !== '' &&
          formData.idioma_preferido.trim() !== '' &&
          formData.organizacion_id.trim() !== '' &&
          formData.rol_id.trim() !== ''
        );
      case 2:
        return (
          formData.interes_export_import.trim() !== '' &&
          formData.interes_comercial.trim() !== '' &&
          formData.objetivos_inversion.trim() !== '' &&
          formData.tipo_conexion_buscada.trim() !== '' &&
          isLinkedinValid()
        );
      case 3:
        return formData.temas.trim() !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowTermsModal(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmTermsAndFinish = () => {
    if (!acceptedTerms) return;
    setShowTermsModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    alert("¡Registro y configuración completados con éxito! Por favor inicia sesión con tu correo corporativo y la contraseña que creaste.");

    localStorage.removeItem('auth_token');

    if (onNavigate) {
      onNavigate('auth');
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <PlatformLayout
      activeModuleId="confi_user"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={UserCog}
      badgeLabel={t.moduleLabels?.confi_user || 'Configuración Inicial'}
      onNavigate={onNavigate}
      isInteractive={true}
      showFloatingAI={false}
      showNotifications={false}
      showModulesMenu={true}
      availableModuleIds={[]}
      userMenuItems={singleLogoutMenu}
      onLogout={handleLogout}
    >
      <main className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 duration-500 py-6 pointer-events-auto">
        
        {/* ENCABEZADO Y BARRA DE PROGRESO */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Configuración Inicial de Perfil
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Completa tus datos de acceso, organización y rol para personalizar tu experiencia en NATP Oakland.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-center">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* WIZARD CARD */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {currentStep === 1 && <><User className="h-5 w-5 text-primary" /> Datos Personales, Rol y Organización</>}
              {currentStep === 2 && <><Briefcase className="h-5 w-5 text-primary" /> Perfil Comercial</>}
              {currentStep === 3 && <><Sparkles className="h-5 w-5 text-primary" /> Temas de Interés</>}
            </CardTitle>
            <CardDescription className="text-xs">
              {currentStep === 1 && 'Ingresa tus datos personales, rol, organización, credenciales y preferencias.'}
              {currentStep === 2 && 'Define tus objetivos comerciales, enlace profesional y tipo de conexiones que buscas.'}
              {currentStep === 3 && 'Selecciona los temas de tu interés para personalizar tu feed e inteligencia.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* PASO 1: DATOS PERSONALES, ROL Y ORGANIZACIÓN */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Nombre *</label>
                  <Input 
                    value={formData.nombre} 
                    onChange={(e) => handleInputChange('nombre', e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Apellido *</label>
                  <Input 
                    value={formData.apellido} 
                    onChange={(e) => handleInputChange('apellido', e.target.value)} 
                  />
                </div>

                {/* CORREO INSTITUCIONAL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Correo Institucional *
                  </label>
                  <Input 
                    type="email"
                    placeholder="user@cusmex.com"
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                  />
                  {formData.email.trim() !== '' && !isEmailValid() && (
                    <p className="text-[10px] text-destructive font-medium mt-1">
                      El correo debe ser institucional, con el dominio @cusmex.com (ej. usuario@cusmex.com).
                    </p>
                  )}
                </div>

                {/* CONTRASEÑA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Contraseña *
                  </label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password} 
                    onChange={(e) => handleInputChange('password', e.target.value)} 
                  />
                </div>

                {/* CONFIRMACIÓN DE CONTRASEÑA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Confirmar Contraseña *
                  </label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword} 
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                  />
                  {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                    <p className="text-[10px] text-destructive font-medium mt-1">
                      Las contraseñas no coinciden.
                    </p>
                  )}
                </div>

                {/* ORGANIZACIÓN (organizacion_id) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Organización *
                  </label>
                  <Input 
                    type="text"
                    value={formData.organizacion_id} 
                    onChange={(e) => handleInputChange('organizacion_id', e.target.value)} 
                  />
                </div>

                {/* ROL EN EL SISTEMA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" /> Rol en la Plataforma *
                  </label>
                  <Input 
                    type="text"
                    value={formData.rol_id} 
                    onChange={(e) => handleInputChange('rol_id', e.target.value)} 
                  />
                </div>

                {/* PAÍS DE REPRESENTACIÓN */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">País de representación *</label>
                  <Input 
                    type="text"
                    value={formData.pais} 
                    onChange={(e) => handleInputChange('pais', e.target.value)} 
                  />
                </div>

                {/* IDIOMA PREFERIDO */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Idioma Preferido *</label>
                  <Input 
                    type="text"
                    value={formData.idioma_preferido} 
                    onChange={(e) => handleInputChange('idioma_preferido', e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* PASO 2: PERFIL COMERCIAL Y ENLACE PROFESIONAL */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Perfil Comercial Principal *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['exportador', 'importador', 'ambos', 'ninguno'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('interes_export_import', type)}
                        className={`p-2 rounded-md border text-xs capitalize transition-colors ${
                          formData.interes_export_import === type 
                            ? 'bg-primary text-primary-foreground border-primary font-semibold' 
                            : 'bg-card hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Interés Comercial *</label>
                  <Input 
                    type="text"
                    value={formData.interes_comercial} 
                    onChange={(e) => handleInputChange('interes_comercial', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Objetivos de Inversión / Proyectos *</label>
                  <Input 
                    type="text"
                    value={formData.objetivos_inversion} 
                    onChange={(e) => handleInputChange('objetivos_inversion', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Tipo de Conexión Buscada *</label>
                  <Input 
                    type="text"
                    value={formData.tipo_conexion_buscada} 
                    onChange={(e) => handleInputChange('tipo_conexion_buscada', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1.5">
                    <Link className="h-4 w-4 text-primary" />
                    Perfil Profesional (URL de LinkedIn) *
                  </label>
                  <Input 
                    type="url"
                    placeholder="https://www.linkedin.com/in/tu-perfil"
                    value={formData.linkedin} 
                    onChange={(e) => handleInputChange('linkedin', e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* PASO 3: TEMAS DE INTERÉS */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Temas de Interés (Feed e Inteligencia) *
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Escribe los temas que te interesan para personalizar el contenido que verás en la plataforma.
                  </p>
                  <Input 
                    type="text"
                    value={formData.temas} 
                    onChange={(e) => handleInputChange('temas', e.target.value)} 
                  />
                </div>
              </div>
            )}
          </CardContent>

          {/* BOTONES DE NAVEGACIÓN */}
          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="gap-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Anterior
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-1 text-xs"
            >
              {currentStep === totalSteps ? (
                <>Finalizar e ir a Iniciar Sesión <CheckCircle2 className="h-3.5 w-3.5" /></>
              ) : (
                <>Siguiente <ArrowRight className="h-3.5 w-3.5" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in-0 duration-300">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[70vh] sm:max-h-[80vh] flex flex-col overflow-hidden my-auto">
            
            <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Términos y Condiciones
                </h2>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 sm:p-4 pr-2 overflow-y-auto space-y-2.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed flex-1">
              <p className="font-medium text-foreground">
                Al usar esta plataforma de <strong>CUSMEX</strong>, usted acepta los siguientes puntos clave:
              </p>

              <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground">
                <li><strong>Uso y Capacidad:</strong> Declara que su información es veraz y que usará el sistema de forma ética y conforme a la ley. Es responsable de la seguridad de sus credenciales.</li>
                <li><strong>Propiedad de Datos:</strong> Conserva la propiedad de sus documentos, pero autoriza a CUSMEX a procesarlos únicamente para la prestación de los servicios. Queda prohibido subir datos bancarios o información confidencial no autorizada.</li>
                <li><strong>Prohibiciones:</strong> No se permite la suplantación de identidad, manipulación de votaciones, extracción masiva de datos ni actividades fraudulentas. CUSMEX podrá suspender cuentas en caso de incumplimiento.</li>
                <li><strong>Jurisdicción:</strong> Estos términos se rigen bajo las leyes aplicables de <strong>Alberta, Canadá</strong>.</li>
              </ul>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border space-y-1">
                <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" /> Funciones de IA y Deslinde
                </h3>
                <p className="text-[10px] sm:text-[11px] leading-snug">
                  Las funciones de asistencia e IA (matchmaking, resúmenes, traducciones) son de carácter meramente informativo y no garantizan contratos o inversiones. Las decisiones finales son responsabilidad del usuario.
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-border bg-muted/20 space-y-2.5 shrink-0">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4 accent-primary shrink-0"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="text-[10px] sm:text-xs text-foreground font-medium leading-tight">
                  He leído y acepto los <span className="text-primary underline">Términos y Condiciones</span> y la Política de Privacidad de CUSMEX.
                </span>
              </label>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTermsModal(false)}
                  className="text-xs h-8 px-3"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!acceptedTerms}
                  onClick={handleConfirmTermsAndFinish}
                  className="text-xs h-8 px-3 gap-1.5"
                >
                  Finalizar e Iniciar Sesión <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </PlatformLayout>
  );
}