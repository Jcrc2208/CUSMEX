import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  UserCog,
  FileText,
  ShieldCheck,
  X,
  Upload,
  FileCheck,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';

// Opciones predefinidas de Comités y Temas según BD
const AVAILABLE_COMMITTEES = [
  { id: 'c1', nombre: 'Comité de Comercio y Cadenas de Suministro' },
  { id: 'c2', nombre: 'Comité de Energía y Sostenibilidad' },
  { id: 'c3', nombre: 'Comité de Innovación y Tecnología' },
  { id: 'c4', nombre: 'Comité de Infraestructura y Logística' },
];

const AVAILABLE_TOPICS = [
  { id: 't1', nombre: 'Nearshoring' },
  { id: 't2', nombre: 'Energías Limpias' },
  { id: 't3', nombre: 'Movilidad Eléctrica' },
  { id: 't4', nombre: 'Aranceles y Normativa' },
  { id: 't5', nombre: 'Inversión Extranjera' },
  { id: 't6', nombre: 'Pymes en Cadenas Globales' },
];

// Opciones predefinidas para País de representación
const COUNTRY_OPTIONS = [
  'Canadá',
  'Estados Unidos',
  'México'
];

// Opciones predefinidas para Interés Comercial
const COMMERCIAL_INTEREST_OPTIONS = [
  'Apertura de nuevos mercados de exportación',
  'Búsqueda de proveedores y materias primas',
  'Establecimiento de operaciones (Nearshoring)',
  'Licitaciones y contratos gubernamentales',
  'Representación comercial o distribución local',
  'Inversión conjunta / Coinversión de capital'
];

// Opciones predefinidas para Objetivos de Inversión
const INVESTMENT_GOALS_OPTIONS = [
  'Alianzas estratégicas y Joint Ventures',
  'Coinversión en proyectos de infraestructura',
  'Desarrollo de proveeduría local y Nearshoring',
  'Atracción de capital extranjero directo (IED)',
  'Transferencia tecnológica e innovación',
  'Expansión de red comercial y exportaciones'
];

// Opciones predefinidas para Tipo de Conexión Buscada
const CONNECTION_TYPES_OPTIONS = [
  'Socios comerciales y distribuidores',
  'Autoridades gubernamentales y reguladores',
  'Proveedores locales de materias primas/servicios',
  'Inversionistas y fondos de capital',
  'Instituciones académicas y centros de R&D',
  'Cámaras de comercio y asociaciones empresariales'
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
  const totalSteps = 4;

  // Estado que mapea los campos de la BD
  const [formData, setFormData] = useState({
    // Step 1: Usuarios
    nombre: '',
    apellido: '',
    pais: '',
    idioma_preferido: 'es',

    // Step 2: Organizaciones
    organizacion_id: '',

    // Step 3: Perfil de Negocio + CV PDF
    interes_comercial: '',
    objetivos_inversion: '',
    interes_export_import: 'ambos',
    tipo_conexion_buscada: '',
    cv_pdf: null,

    // Step 4: Comités y Temas
    comites: [],
    temas: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, cv_pdf: file }));
    } else if (file) {
      alert('Por favor selecciona un archivo en formato PDF.');
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, cv_pdf: null }));
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
          formData.pais.trim() !== '' &&
          formData.idioma_preferido.trim() !== ''
        );
      case 2:
        return formData.organizacion_id.trim() !== '';
      case 3:
        return (
          formData.interes_export_import.trim() !== '' &&
          formData.interes_comercial.trim() !== '' &&
          formData.objetivos_inversion.trim() !== '' &&
          formData.tipo_conexion_buscada.trim() !== '' &&
          formData.cv_pdf !== null
        );
      case 4:
        return formData.comites.length > 0 && formData.temas.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Al llegar al final, mostramos el modal de términos y condiciones
      setShowTermsModal(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirmTermsAndFinish = () => {
    if (!acceptedTerms) return;
    setShowTermsModal(false);
    // Desplazar el scroll hacia la parte superior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Redirigir al módulo de inicio (al iniciar sesión se desbloquea el resto de la interfaz)
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
      // DESHABILITAR BARRA DE MENÚS, NOTIFICACIONES Y BOTÓN IA HASTA COMPLETAR CONFIGURACIÓN
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
                Completa tus datos para personalizar tu experiencia en la plataforma NATP Oakland.
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
              {currentStep === 1 && <><User className="h-5 w-5 text-primary" /> Datos Personales</>}
              {currentStep === 2 && <><Building2 className="h-5 w-5 text-primary" /> Organización</>}
              {currentStep === 3 && <><Briefcase className="h-5 w-5 text-primary" /> Perfil Comercial</>}
              {currentStep === 4 && <><Users className="h-5 w-5 text-primary" /> Comités y Temas de Interés</>}
            </CardTitle>
            <CardDescription className="text-xs">
              {currentStep === 1 && 'Actualiza tu nombre, país de representación e idioma preferido.'}
              {currentStep === 2 && 'Indica la empresa u organismo al que representas.'}
              {currentStep === 3 && 'Define tus objetivos comerciales, adjunta tu CV en PDF y tipo de conexiones que buscas.'}
              {currentStep === 4 && 'Selecciona los grupos de trabajo e intereses para personalizar tu feed.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* PASO 1: DATOS PERSONALES */}
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

            {/* PASO 2: ORGANIZACIÓN */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Organización registrada *</label>
                  <select 
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.organizacion_id}
                    onChange={(e) => handleInputChange('organizacion_id', e.target.value)}
                  >
                    <option value="">Selecciona tu organización...</option>
                    <option value="org-1">Secretaría de Economía</option>
                    <option value="org-2">Tech Trade Global</option>
                    <option value="org-3">Cámara de Comercio de Oakland</option>
                  </select>
                </div>
              </div>
            )}

            {/* PASO 3: PERFIL COMERCIAL Y MATCHMAKING */}
            {currentStep === 3 && (
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

                {/* CAMPO DE SUBIDA DE CV EN PDF */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    Curriculum Vitae / Perfil Profesional (PDF) *
                  </label>
                  
                  {!formData.cv_pdf ? (
                    <label className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs font-medium text-foreground">Haz clic para subir tu CV</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Formato PDF (Máx. 10MB)</span>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileCheck className="h-5 w-5 text-primary shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-foreground truncate">{formData.cv_pdf.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {(formData.cv_pdf.size / (1024 * 1024)).toFixed(2)} MB • PDF listo
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PASO 4: COMITÉS Y TEMAS */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Comités de Participación *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_COMMITTEES.map((comite) => {
                      const isSelected = formData.comites.includes(comite.id);
                      return (
                        <div
                          key={comite.id}
                          onClick={() => toggleSelection('comites', comite.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary font-medium' 
                              : 'border-border bg-card hover:border-muted-foreground/30'
                          }`}
                        >
                          <span>{comite.nombre}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Temas de Interés (Feed e Inteligencia) *</label>
                  <div className="flex flex-wrap gap-2">
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
            
            {/* Encabezado Modal */}
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

            {/* Texto del Acuerdo */}
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
                  <li><strong>Privacidad de datos:</strong> Tu información institucional y CV serán procesados únicamente con fines de vinculación comercial B2B y agenda de comités.</li>
                  <li><strong>Uso responsable:</strong> El envío de mensajes directos y solicitudes de agenda debe limitarse a fines profesionales y de colaboración empresarial.</li>
                  <li><strong>Confidencialidad:</strong> Los documentos restringidos compartidos dentro de comités de trabajo son confidenciales para los miembros del grupo.</li>
                </ul>
              </div>

              <p>
                Puedes consultar nuestra política completa de privacidad y tratamiento de datos personales en cualquier momento desde el menú de soporte de la plataforma.
              </p>
            </div>

            {/* Footer Modal con Checkbox y Acción */}
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