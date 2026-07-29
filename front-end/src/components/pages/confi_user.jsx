import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  UserCog,
  FileText,
  ShieldCheck,
  X,
  Link,
  Mail,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// --- VALORES REALES DE TU BASE DE DATOS ---

// Temas de Interés (temas_interes)
const AVAILABLE_TOPICS = [
  { id: '1', nombre: 'Inteligencia Artificial Aplicada' },
  { id: '2', nombre: 'Nearshoring y Cadenas Globales' },
  { id: '3', nombre: 'Fintech y Medios de Pago' }
];

// Países (organizaciones)
const COUNTRY_OPTIONS = [
  'México',
  'Estados Unidos',
  'Colombia'
];

// Intereses Comerciales (intereses_comerciales)
const COMMERCIAL_INTEREST_OPTIONS = [
  'Tecnología y Software',
  'Agroindustria y Alimentos',
  'Manufactura e Industria Automotriz',
  'Energías Limpias y Renovables',
  'Logística y Cadenas de Suministro'
];

// Objetivos de Inversión (objetivos_inversion)
const INVESTMENT_GOALS_OPTIONS = [
  'Levantamiento de Capital / Búsqueda de Inversionistas',
  'Inversión Directa en Startups o Proyectos',
  'Expansión e Internacionalización de Mercado',
  'Alianzas Estratégicas y Joint Ventures'
];

// Tipos de Conexión Buscada (tipos_conexion)
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

  // Estado que mapea los campos de la BD
  const [formData, setFormData] = useState({
    // Step 1: Usuarios y Cuenta
    nombre: '',
    apellido: '',
    emailPrefix: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: '',
    idioma_preferido: 'es',

    // Step 2: Organizaciones
    organizacion_nombre: '',

    // Step 3: Perfil de Negocio + CV PDF
    interes_comercial: '',
    objetivos_inversion: '',
    interes_export_import: 'ambos',
    tipo_conexion_buscada: '',
    linkedin: '',

    // Step 3: Temas de Interés
    temas: []
  });

  // Manejo de cambios en los inputs (incluyendo autocompletado de correo)
  const handleInputChange = (field, value) => {
    if (field === 'emailPrefix') {
      const cleanPrefix = value.replace(/[\s@]/g, '');
      setFormData(prev => ({
        ...prev,
        emailPrefix: cleanPrefix,
        email: cleanPrefix ? `${cleanPrefix}@natp.com` : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleSelection = (arrayField, itemId) => {
    setFormData(prev => {
      const current = prev[arrayField];
      const exists = current.includes(itemId);
      return {
        ...prev,
        [arrayField]: exists 
          ? current.filter(id => id !== itemId) 
          : [...current, itemId]
      };
    });
  };

  // Validación requerida para avanzar de paso
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.nombre.trim() !== '' &&
          formData.apellido.trim() !== '' &&
          formData.emailPrefix.trim() !== '' &&
          formData.password.trim() !== '' &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword &&
          formData.pais.trim() !== '' &&
          formData.idioma_preferido.trim() !== ''
        );
      case 2:
        return (
          formData.interes_export_import.trim() !== '' &&
          formData.interes_comercial.trim() !== '' &&
          formData.objetivos_inversion.trim() !== '' &&
          formData.tipo_conexion_buscada.trim() !== '' &&
          formData.linkedin.trim() !== ''
        );
      case 3:
        return formData.temas.length > 0;
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
    onNavigate('inicio');
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
      isInteractive={false}
      showFloatingAI={false}
      showNotifications={false}
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
                Completa tus datos de acceso y preferencias para personalizar tu experiencia en NATP Oakland.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-center">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* CONTENEDOR DEL FORMULARIO (WIZARD) */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {currentStep === 1 && <><User className="h-5 w-5 text-primary" /> Datos Personales y Cuenta</>}
              {currentStep === 2 && <><Briefcase className="h-5 w-5 text-primary" /> Perfil Comercial</>}
              {currentStep === 3 && <><Sparkles className="h-5 w-5 text-primary" /> Temas de Interés</>}
            </CardTitle>
            <CardDescription className="text-xs">
              {currentStep === 1 && 'Ingresa tus datos personales, correo corporativo, contraseña, país e idioma preferido.'}
              {currentStep === 2 && 'Define tus objetivos comerciales, enlace profesional y tipo de conexiones que buscas.'}
              {currentStep === 3 && 'Selecciona los temas de tu interés para personalizar tu feed e inteligencia.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* PASO 1: DATOS PERSONALES Y DE CUENTA */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Nombre *</label>
                  <Input 
                    placeholder="Tu nombre"
                    value={formData.nombre} 
                    onChange={(e) => handleInputChange('nombre', e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Apellido *</label>
                  <Input 
                    placeholder="Tu apellido"
                    value={formData.apellido} 
                    onChange={(e) => handleInputChange('apellido', e.target.value)} 
                  />
                </div>

                {/* CORREO AUTOCOMPLETADO @natp.com */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Correo Institucional *
                  </label>
                  <div className="flex items-center">
                    <Input 
                      type="text"
                      placeholder="usuario"
                      className="rounded-r-none focus-visible:z-10"
                      value={formData.emailPrefix} 
                      onChange={(e) => handleInputChange('emailPrefix', e.target.value)} 
                    />
                    <span className="inline-flex items-center px-3 h-9 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-xs font-semibold select-none">
                      @natp.com
                    </span>
                  </div>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">País de representación *</label>
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                  >
                    <option value="">Selecciona tu país...</option>
                    {COUNTRY_OPTIONS.map((country, idx) => (
                      <option key={idx} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Idioma Preferido *</label>
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.idioma_preferido}
                    onChange={(e) => handleInputChange('idioma_preferido', e.target.value)}
                  >
                    <option value="es">Español (ES)</option>
                    <option value="en">English (EN)</option>
                    <option value="fr">Français (FR)</option>
                  </select>
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
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.interes_comercial}
                    onChange={(e) => handleInputChange('interes_comercial', e.target.value)}
                  >
                    <option value="">Selecciona tu interés comercial...</option>
                    {COMMERCIAL_INTEREST_OPTIONS.map((interest, idx) => (
                      <option key={idx} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Objetivos de Inversión / Proyectos *</label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.objetivos_inversion}
                    onChange={(e) => handleInputChange('objetivos_inversion', e.target.value)}
                  >
                    <option value="">Selecciona un objetivo...</option>
                    {INVESTMENT_GOALS_OPTIONS.map((goal, idx) => (
                      <option key={idx} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Tipo de Conexión Buscada *</label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.tipo_conexion_buscada}
                    onChange={(e) => handleInputChange('tipo_conexion_buscada', e.target.value)}
                  >
                    <option value="">Selecciona un tipo de conexión...</option>
                    {CONNECTION_TYPES_OPTIONS.map((conn, idx) => (
                      <option key={idx} value={conn}>
                        {conn}
                      </option>
                    ))}
                  </select>
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

            {/* PASO 3: TEMAS DE INTERÉS (BD) */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Temas de Interés (Feed e Inteligencia) *
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Selecciona al menos un tema para personalizar el contenido que verás en la plataforma.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {AVAILABLE_TOPICS.map((topic) => {
                      const isSelected = formData.temas.includes(topic.id);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleSelection('temas', topic.id)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground font-medium shadow-xs' 
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {topic.nombre}
                        </button>
                      );
                    })}
                  </div>
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
                <>Finalizar e ir al Inicio <CheckCircle2 className="h-3.5 w-3.5" /></>
              ) : (
                <>Siguiente <ArrowRight className="h-3.5 w-3.5" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Términos y Condiciones de Uso</h2>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs text-muted-foreground leading-relaxed flex-1">
              <p className="font-semibold text-foreground">
                Bienvenido a la plataforma NATP Oakland (North American Trade Partnership).
              </p>
              <p>
                Al continuar y hacer uso de este sistema, aceptas cumplir con las reglas de interacción trilateral entre delegaciones de Canadá, Estados Unidos y México.
              </p>
              
              <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> Puntos clave del acuerdo:
                </h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Privacidad de datos:</strong> Tu información personal y perfil profesional serán procesados únicamente con fines de vinculación comercial B2B.</li>
                  <li><strong>Uso responsable:</strong> El envío de mensajes directos y solicitudes de agenda debe limitarse a fines profesionales y de colaboración empresarial.</li>
                  <li><strong>Confidencialidad:</strong> Los documentos restringidos compartidos en la plataforma son confidenciales.</li>
                </ul>
              </div>

              <p>
                Puedes consultar nuestra política completa de privacidad y tratamiento de datos personales en cualquier momento desde el menú de soporte de la plataforma.
              </p>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4 accent-primary"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="text-xs text-foreground font-medium">
                  He leído y acepto los <span className="text-primary underline">Términos y Condiciones</span> así como la Política de Privacidad de la plataforma.
                </span>
              </label>

              <div className="flex gap-2 justify-end pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTermsModal(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!acceptedTerms}
                  onClick={handleConfirmTermsAndFinish}
                  className="text-xs gap-1.5"
                >
                  Aceptar y Comenzar <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </PlatformLayout>
  );
}