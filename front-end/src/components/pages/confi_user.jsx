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
  UserCog
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

export default function ConfiUser({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onNavigate
}) {
  const t = COPY[language] ?? COPY.es;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Estado que mapea exactamente los campos de la BD (sin rol)
  const [formData, setFormData] = useState({
    // Step 1: Usuarios
    nombre: '',
    apellido: '',
    pais: 'México',
    idioma_preferido: 'es',

    // Step 2: Organizaciones
    isNewOrg: false,
    organizacion_id: '',
    org_nombre: '',
    org_pais: 'México',
    org_sector: '',
    org_descripcion: '',

    // Step 3: Perfil de Negocio
    interes_comercial: '',
    objetivos_inversion: '',
    interes_export_import: 'ambos',
    tipo_conexion_buscada: '',

    // Step 4: Comités y Temas
    comites: [],
    temas: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Guardar y redirigir al módulo de inicio
      onNavigate('inicio');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
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
    >
      <main className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 duration-500 py-6">
        
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
              {currentStep === 2 && 'Indica la empresa u organismo al que representas en el parlamento.'}
              {currentStep === 3 && 'Define tus objetivos comerciales y el tipo de conexiones que buscas.'}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">País de representación *</label>
                  <Input 
                    placeholder="Ej. México, Canadá, EE.UU." 
                    value={formData.pais} 
                    onChange={(e) => handleInputChange('pais', e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Idioma Preferido</label>
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
                <div className="flex items-center gap-4 border-b border-border pb-3">
                  <label className="text-xs font-medium cursor-pointer flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="orgType" 
                      checked={!formData.isNewOrg} 
                      onChange={() => handleInputChange('isNewOrg', false)} 
                    />
                    Seleccionar existente
                  </label>
                  <label className="text-xs font-medium cursor-pointer flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="orgType" 
                      checked={formData.isNewOrg} 
                      onChange={() => handleInputChange('isNewOrg', true)} 
                    />
                    Registrar nueva organización
                  </label>
                </div>

                {!formData.isNewOrg ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Organización registrada</label>
                    <select 
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm"
                      value={formData.organizacion_id}
                      onChange={(e) => handleInputChange('organizacion_id', e.target.value)}
                    >
                      <option value="">Selecciona tu organización...</option>
                      <option value="org-1">Secretaría de Economía</option>
                      <option value="org-2">Tech Trade Global</option>
                      <option value="org-3">Cámara de Comercio de Oakland</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium">Nombre de la Organización</label>
                      <Input 
                        placeholder="Ej. Empresa / Cámara / Organismo" 
                        value={formData.org_nombre} 
                        onChange={(e) => handleInputChange('org_nombre', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">País de la Organización</label>
                      <Input 
                        placeholder="País de origen" 
                        value={formData.org_pais} 
                        onChange={(e) => handleInputChange('org_pais', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Sector Industrial</label>
                      <Input 
                        placeholder="Ej. Manufactura, Energía, Software" 
                        value={formData.org_sector} 
                        onChange={(e) => handleInputChange('org_sector', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium">Descripción breve</label>
                      <textarea 
                        className="w-full min-h-[70px] rounded-md border border-input bg-background p-2 text-xs shadow-sm"
                        placeholder="A qué se dedica tu organización..."
                        value={formData.org_descripcion}
                        onChange={(e) => handleInputChange('org_descripcion', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: PERFIL COMERCIAL Y MATCHMAKING */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Perfil Comercial Principal</label>
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
                  <label className="text-xs font-medium">Interés Comercial</label>
                  <textarea 
                    className="w-full min-h-[60px] rounded-md border border-input bg-background p-2 text-xs shadow-sm"
                    placeholder="Describe los productos, servicios o proyectos que ofreces o buscas..."
                    value={formData.interes_comercial}
                    onChange={(e) => handleInputChange('interes_comercial', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Objetivos de Inversión / Proyectos</label>
                  <Input 
                    placeholder="Ej. Alianzas estratégicas, coinversión, proveeduría..." 
                    value={formData.objetivos_inversion} 
                    onChange={(e) => handleInputChange('objetivos_inversion', e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Tipo de Conexión Buscada</label>
                  <Input 
                    placeholder="Ej. Socios comerciales, autoridades, proveedores locales..." 
                    value={formData.tipo_conexion_buscada} 
                    onChange={(e) => handleInputChange('tipo_conexion_buscada', e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* PASO 4: COMITÉS Y TEMAS */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Comités de Participación</label>
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
                  <label className="text-xs font-semibold text-foreground">Temas de Interés (Feed e Inteligencia)</label>
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
    </PlatformLayout>
  );
}