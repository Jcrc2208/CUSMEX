import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  FileText, 
  CalendarPlus, 
  CheckCircle2, 
  Building2,
  Upload,
  ArrowRight,
  Edit3,
  Bot,
  Search,
  SlidersHorizontal,
  X,
  Filter,
  Loader2,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import PlatformLayout from '@/components/layout/platform-layout';
import { NETWORKING_PROFILES } from '@/data/networking-data';

export default function Networking({ language, onLanguageChange, isDarkMode, onToggleTheme }) {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'search'
  const [requestedMeetings, setRequestedMeetings] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal de Filtros
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // ------------------------------------------------------------------
  // ESTADO DEL FORMULARIO DE ONBOARDING (Alineado a la BD y al PDF)
  // ------------------------------------------------------------------
  const [cvFile, setCvFile] = useState(null);
  const [formData, setFormData] = useState({
    // Informacion Laboral y Corporativa
    puesto_cargo: '',
    empresa_institucion: '',
    tamano_empresa: '',
    
    // Oferta y Demanda B2B
    servicios_ofrece: '',
    servicios_busca: '',
    objetivo_networking: '',
    formato_reunion: '',
    
    // Links y Perfil Publico
    perfil_linkedin: '',
    sitio_web: '',
    resumen_ejecutivo: '',
    
    // Visibilidad
    perfil_publico: true
  });

  // Filtros para la Búsqueda Libre
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOffering, setFilterOffering] = useState('');
  const [filterLookingFor, setFilterLookingFor] = useState('');
  const [filterGoal, setFilterGoal] = useState('');
  const [filterFormat, setFilterFormat] = useState('');

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterOffering) count++;
    if (filterLookingFor) count++;
    if (filterGoal) count++;
    if (filterFormat) count++;
    return count;
  }, [filterOffering, filterLookingFor, filterGoal, filterFormat]);

  // Efecto para regresar al inicio de la página al cambiar vistas
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isProfileComplete, activeTab]);

  // ------------------------------------------------------------------
  // HANDLER DE SUBMIT (Envío al Backend / DB)
  // ------------------------------------------------------------------
  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      /* 
        ==================================================================
        BACKEND INTEGRATION: INSERT INTO perfil_networking
        ==================================================================
        Cuando el backend esté listo, usa FormData para enviar tanto el PDF 
        como los campos de texto en una sola petición multipart/form-data.

        const bodyData = new FormData();
        if (cvFile) bodyData.append('cv_pdf', cvFile);
        bodyData.append('puesto_cargo', formData.puesto_cargo);
        bodyData.append('empresa_institucion', formData.empresa_institucion);
        bodyData.append('tamano_empresa', formData.tamano_empresa);
        bodyData.append('servicios_ofrece', formData.servicios_ofrece);
        bodyData.append('servicios_busca', formData.servicios_busca);
        bodyData.append('objetivo_networking', formData.objetivo_networking);
        bodyData.append('formato_reunion', formData.formato_reunion);
        bodyData.append('perfil_linkedin', formData.perfil_linkedin);
        bodyData.append('sitio_web', formData.sitio_web);
        bodyData.append('resumen_ejecutivo', formData.resumen_ejecutivo);
        bodyData.append('perfil_publico', formData.perfil_publico);

        const response = await fetch('/api/networking/perfil', {
          method: 'POST', // o 'PUT' si el perfil ya existe
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
          body: bodyData,
        });

        const result = await response.json();
      */

      // Simulación de envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsProfileComplete(true);
      setActiveTab('ai');
    } catch (error) {
      console.error('Error al guardar el perfil de networking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestMeeting = async (id) => {
    /* 
      ==================================================================
      BACKEND INTEGRATION: INSERT INTO solicitudes_reunion
      ==================================================================
      await fetch('/api/networking/reuniones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfil_destino_id: id })
      });
    */
    setRequestedMeetings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtrado dinámico para la pestaña de Búsqueda Libre
  const filteredProfiles = useMemo(() => {
    return NETWORKING_PROFILES.filter((profile) => {
      const query = searchQuery.trim().toLowerCase();
      
      const matchesQuery = !query || 
        profile.name.toLowerCase().includes(query) || 
        profile.company.toLowerCase().includes(query) ||
        profile.role.toLowerCase().includes(query);

      const matchesOffering = !filterOffering || profile.offering.includes(filterOffering);
      const matchesLookingFor = !filterLookingFor || profile.lookingFor.includes(filterLookingFor);
      const matchesGoal = !filterGoal || profile.networkingGoal === filterGoal;
      const matchesFormat = !filterFormat || profile.meetingPreference === filterFormat;

      return matchesQuery && matchesOffering && matchesLookingFor && matchesGoal && matchesFormat;
    });
  }, [searchQuery, filterOffering, filterLookingFor, filterGoal, filterFormat]);

  const clearFilters = () => {
    setFilterOffering('');
    setFilterLookingFor('');
    setFilterGoal('');
    setFilterFormat('');
  };

  const getMatchBadgeStyle = (percentage) => {
    if (percentage >= 90) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
    if (percentage >= 80) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
  };

  return (
    <PlatformLayout
      activeModuleId="networking"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={Briefcase}
      badgeLabel="Networking"
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        
        {/* Header del Módulo */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3.5 py-1 text-xs font-semibold shadow-sm">
              Networking
            </span>
            
            {isProfileComplete && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-semibold bg-background hover:bg-muted border-primary/40 text-primary shadow-sm gap-2 transition-all hover:scale-105"
                onClick={() => setIsProfileComplete(false)}
              >
                <Edit3 className="h-3.5 w-3.5 text-primary" /> Editar Mi Perfil
              </Button>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Conexiones Estratégicas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isProfileComplete 
                ? 'Explora perfiles recomendados por IA o realiza búsquedas avanzadas.' 
                : 'Completa tu información de oferta y demanda para activar el matchmaking.'}
            </p>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* PASO 1: CONFIGURACIÓN INICIAL DE PERFIL                       */}
        {/* ------------------------------------------------------------- */}
        {!isProfileComplete ? (
          <Card className="max-w-2xl mx-auto border-border shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl font-bold">
                Configuración Inicial de Perfil
              </CardTitle>

              <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
                <p>
                  Responde las preguntas clave para hacer match y conectar con otros asistentes.
                </p>
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/30 dark:border-indigo-400/30 flex items-start gap-3 text-indigo-900 dark:text-indigo-200 shadow-sm">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs font-medium leading-normal">
                    <strong className="font-bold text-indigo-700 dark:text-indigo-300">Sugerencias Inteligentes por IA:</strong>
                    {" "}Analizaremos tus respuestas para recomendarte a los socios y clientes más afines a tu negocio.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompleteSetup} className="space-y-5">
                
                {/* 1. Carga de CV / Presentación */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    1. Carga tu CV o Presentación Corporativa (PDF)
                  </label>
                  <div className="p-5 border border-dashed border-border rounded-xl text-center space-y-2 hover:bg-muted/40 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setCvFile(e.target.files[0])}
                    />
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">
                      {cvFile ? cvFile.name : 'Haz clic o arrastra tu archivo PDF aquí'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Formato PDF (máx. 10 MB)</p>
                  </div>
                </div>

                <Separator />

                {/* 2. Información Profesional y de Empresa */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-foreground block">
                    2. Información Profesional
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Puesto / Cargo
                      </label>
                      <Input
                        type="text"
                        placeholder="Ej. Director de Innovación"
                        className="h-9 text-xs"
                        value={formData.puesto_cargo}
                        onChange={(e) => setFormData({ ...formData, puesto_cargo: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Empresa u Organización
                      </label>
                      <Input
                        type="text"
                        placeholder="Ej. TechCorp"
                        className="h-9 text-xs"
                        value={formData.empresa_institucion}
                        onChange={(e) => setFormData({ ...formData, empresa_institucion: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Tamaño de la Empresa
                    </label>
                    <select 
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.tamano_empresa}
                      onChange={(e) => setFormData({ ...formData, tamano_empresa: e.target.value })}
                    >
                      <option value="">Selecciona tamaño...</option>
                      <option value="Startup / Inicios (1-10)">Startup / Inicios (1-10 colaboradores)</option>
                      <option value="PyME (11-50)">PyME (11-50 colaboradores)</option>
                      <option value="Mediana (51-200)">Mediana (51-200 colaboradores)</option>
                      <option value="Corporativo (+200)">Corporativo (+200 colaboradores)</option>
                    </select>
                  </div>
                </div>

                <Separator />

                {/* 3. Preguntas de Oferta y Demanda B2B */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-foreground block">
                    3. Intercambio Comercial & Objetivos
                  </span>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      ¿Qué servicios, productos o soluciones OFRECES?
                    </label>
                    <select 
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.servicios_ofrece}
                      onChange={(e) => setFormData({...formData, servicios_ofrece: e.target.value})}
                      required
                    >
                      <option value="">Selecciona una opción principal...</option>
                      <option value="Desarrollo de Software & TI">Desarrollo de Software & TI</option>
                      <option value="Servicios Cloud & Infraestructura">Servicios Cloud & Infraestructura</option>
                      <option value="Consultoría Financiera / Legal">Consultoría Financiera / Legal</option>
                      <option value="Marketing Digital & Ventas">Marketing Digital & Ventas</option>
                      <option value="Inversión y Capital de Riesgo">Inversión y Capital de Riesgo</option>
                      <option value="Logística & Cadena de Suministro">Logística & Cadena de Suministro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      ¿Qué tipo de alianzas, clientes o soluciones BUSCAS?
                    </label>
                    <select 
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.servicios_busca}
                      onChange={(e) => setFormData({...formData, servicios_busca: e.target.value})}
                      required
                    >
                      <option value="">Selecciona qué buscas conectar...</option>
                      <option value="Proveedores Técnicos / Software">Proveedores Técnicos / Software</option>
                      <option value="Inversionistas B2B / Capital">Inversionistas B2B / Capital</option>
                      <option value="Socios Comerciales / Distribuidores">Socios Comerciales / Distribuidores</option>
                      <option value="Clientes Corporativos">Clientes Corporativos</option>
                      <option value="Consultoría Especializada">Consultoría Especializada</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Objetivo principal de networking
                      </label>
                      <select 
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.objetivo_networking}
                        onChange={(e) => setFormData({...formData, objetivo_networking: e.target.value})}
                      >
                        <option value="">Selecciona objetivo...</option>
                        <option value="Conseguir Clientes">Conseguir Clientes</option>
                        <option value="Levantar Capital">Levantar Capital</option>
                        <option value="Buscar Proveedores">Buscar Proveedores</option>
                        <option value="Alianzas Estratégicas">Alianzas Estratégicas</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Formato preferido de reunión
                      </label>
                      <select 
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.formato_reunion}
                        onChange={(e) => setFormData({...formData, formato_reunion: e.target.value})}
                      >
                        <option value="">Selecciona formato...</option>
                        <option value="Presencial en Stand">Presencial en Stand</option>
                        <option value="Virtual (15 min)">Virtual (15 min)</option>
                        <option value="Llamada Rápida">Llamada Rápida</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 4. Enlaces & Resumen Ejecutivo */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-foreground block">
                    4. Presencia Digital & Pitch
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Perfil de LinkedIn (URL)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/usuario"
                        className="h-9 text-xs"
                        value={formData.perfil_linkedin}
                        onChange={(e) => setFormData({ ...formData, perfil_linkedin: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        Sitio Web / Portfolio (URL)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://tuempresa.com"
                        className="h-9 text-xs"
                        value={formData.sitio_web}
                        onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Resumen Ejecutivo / Pitch Corto
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve descripción de lo que hace tu empresa o tu especialidad comercial..."
                      className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      value={formData.resumen_ejecutivo}
                      onChange={(e) => setFormData({ ...formData, resumen_ejecutivo: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full rounded-lg gap-2 mt-4 font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando Perfil...
                    </>
                  ) : (
                    <>
                      Guardar Perfil y Ver Matches
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (


          
        /* ------------------------------------------------------------- */
        /* PASO 2: VISTAS CON PESTAÑAS (IA vs BÚSQUEDA LIBRE)            */
        /* ------------------------------------------------------------- */
          <div className="space-y-6">
            
            {/* Pestañas de Navegación */}
            <div className="flex rounded-lg bg-muted p-1 max-w-md" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ai'}
                className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'ai'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                Sugerencias por IA
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'search'}
                className={`flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'search'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('search')}
              >
                Búsqueda Libre
              </button>
            </div>

            {/* CONTENIDO DE PESTAÑA: SUGERENCIAS POR IA */}
            {activeTab === 'ai' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in-0 duration-300">
                {NETWORKING_PROFILES.map((profile) => {
                  const hasRequested = requestedMeetings.has(profile.id);

                  return (
                    <Card key={profile.id} className="flex flex-col justify-between border-border hover:border-primary/40 transition-all shadow-sm">
                      <CardHeader className="p-5 pb-3 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${getMatchBadgeStyle(profile.matchPercentage)}`}>
                              {profile.matchPercentage}% Match
                            </span>
                            <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded-md">
                              Sugerido por IA
                            </span>
                          </div>

                          {profile.cvUrl && (
                            <Button variant="outline" size="xs" className="text-[11px] text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 h-7 gap-1 font-medium">
                              <FileText className="h-3.5 w-3.5" />
                              Ver CV
                            </Button>
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                            {profile.avatar}
                          </div>
                          <div className="space-y-0.5">
                            <CardTitle className="text-base font-semibold">{profile.name}</CardTitle>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {profile.role} · <span className="font-medium text-foreground">{profile.company}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground pt-1 bg-muted/30 p-2 rounded-lg border border-border/40">
                          <span className="font-semibold text-foreground">Compatibilidad: </span>
                          {profile.matchReason}
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-4">
                        <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                          <div>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1.5">
                              Ofrece
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {profile.offering.map((tag) => (
                                <span key={tag} className="rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[11px] font-medium border border-blue-200 dark:border-blue-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1">
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
                              Busca
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {profile.lookingFor.map((tag) => (
                                <span key={tag} className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant={hasRequested ? "outline" : "default"}
                          className={`w-full rounded-lg text-xs gap-2 h-9 font-semibold ${
                            hasRequested 
                              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" 
                              : ""
                          }`}
                          onClick={() => handleRequestMeeting(profile.id)}
                        >
                          {hasRequested ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              Solicitud Enviada
                            </>
                          ) : (
                            <>
                              <CalendarPlus className="h-3.5 w-3.5" />
                              Solicitar Reunión B2B
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* CONTENIDO DE PESTAÑA: BÚSQUEDA LIBRE */}
            {activeTab === 'search' && (
              <div className="space-y-5 animate-in fade-in-0 duration-300">
                
                {/* BARRA DE BÚSQUEDA + BOTÓN DE FILTRO INTEGRADAS */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="search"
                      className="pl-9 text-xs h-10 rounded-xl"
                      placeholder="Buscar por nombre, empresa o rol..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Button
                    variant={activeFiltersCount > 0 ? "default" : "outline"}
                    className="h-10 px-3.5 rounded-xl gap-2 shrink-0 text-xs font-semibold"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground text-[10px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>

                {/* MODAL / BOTTOM SHEET DE FILTROS */}
                {isFilterModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in-0 duration-200">
                    <div className="w-full sm:max-w-md bg-background border border-border rounded-t-2xl sm:rounded-2xl p-5 space-y-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
                      
                      {/* Header del Modal */}
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <Filter className="h-4 w-4 text-primary" />
                          <span>Filtros de Búsqueda</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => setIsFilterModalOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Campos de Filtro */}
                      <div className="space-y-4 text-left">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Servicios</label>
                          <select 
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={filterOffering}
                            onChange={(e) => setFilterOffering(e.target.value)}
                          >
                            <option value="">Todos los servicios</option>
                            <option value="Desarrollo de Software & TI">Desarrollo de Software & TI</option>
                            <option value="Servicios Cloud & Infraestructura">Servicios Cloud & Infraestructura</option>
                            <option value="Consultoría Financiera / Legal">Consultoría Financiera / Legal</option>
                            <option value="Marketing Digital & Ventas">Marketing Digital & Ventas</option>
                            <option value="Inversión y Capital de Riesgo">Inversión y Capital de Riesgo</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Busca</label>
                          <select 
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={filterLookingFor}
                            onChange={(e) => setFilterLookingFor(e.target.value)}
                          >
                            <option value="">Cualquier búsqueda</option>
                            <option value="Proveedores Técnicos / Software">Proveedores Técnicos / Software</option>
                            <option value="Inversionistas B2B / Capital">Inversionistas B2B / Capital</option>
                            <option value="Socios Comerciales / Distribuidores">Socios Comerciales / Distribuidores</option>
                            <option value="Clientes Corporativos">Clientes Corporativos</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Objetivo</label>
                          <select 
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={filterGoal}
                            onChange={(e) => setFilterGoal(e.target.value)}
                          >
                            <option value="">Cualquier objetivo</option>
                            <option value="Conseguir Clientes">Conseguir Clientes</option>
                            <option value="Levantar Capital">Levantar Capital</option>
                            <option value="Buscar Proveedores">Buscar Proveedores</option>
                            <option value="Alianzas Estratégicas">Alianzas Estratégicas</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Formato</label>
                          <select 
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={filterFormat}
                            onChange={(e) => setFilterFormat(e.target.value)}
                          >
                            <option value="">Cualquier formato</option>
                            <option value="Presencial en Stand">Presencial en Stand</option>
                            <option value="Virtual (15 min)">Virtual (15 min)</option>
                            <option value="Llamada Rápida">Llamada Rápida</option>
                          </select>
                        </div>
                      </div>

                      {/* Botones del Modal */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {activeFiltersCount > 0 && (
                          <Button 
                            variant="outline" 
                            className="flex-1 text-xs h-9"
                            onClick={clearFilters}
                          >
                            Limpiar
                          </Button>
                        )}
                        <Button 
                          className="flex-1 text-xs h-9 font-semibold"
                          onClick={() => setIsFilterModalOpen(false)}
                        >
                          Aplicar Filtros
                        </Button>
                      </div>

                    </div>
                  </div>
                )}

                {/* Resultados de Búsqueda */}
                {filteredProfiles.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No se encontraron perfiles con los filtros seleccionados.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProfiles.map((profile) => {
                      const hasRequested = requestedMeetings.has(profile.id);

                      return (
                        <Card key={profile.id} className="flex flex-col justify-between border-border hover:border-primary/40 transition-all shadow-sm">
                          <CardHeader className="p-5 pb-3 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${getMatchBadgeStyle(profile.matchPercentage)}`}>
                                {profile.matchPercentage}% Match
                              </span>

                              {profile.cvUrl && (
                                <Button variant="outline" size="xs" className="text-[11px] text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 h-7 gap-1 font-medium">
                                  <FileText className="h-3.5 w-3.5" />
                                  Ver CV
                                </Button>
                              )}
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                                {profile.avatar}
                              </div>
                              <div className="space-y-0.5">
                                <CardTitle className="text-base font-semibold">{profile.name}</CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {profile.role} · <span className="font-medium text-foreground">{profile.company}</span>
                                </p>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-5 pt-0 space-y-4">
                            <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                              <div>
                                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1.5">
                                  Ofrece
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {profile.offering.map((tag) => (
                                    <span key={tag} className="rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[11px] font-medium border border-blue-200 dark:border-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-1">
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
                                  Busca
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {profile.lookingFor.map((tag) => (
                                    <span key={tag} className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button
                              type="button"
                              variant={hasRequested ? "outline" : "default"}
                              className={`w-full rounded-lg text-xs gap-2 h-9 font-semibold ${
                                hasRequested 
                                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" 
                                  : ""
                              }`}
                              onClick={() => handleRequestMeeting(profile.id)}
                            >
                              {hasRequested ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                  Solicitud Enviada
                                </>
                              ) : (
                                <>
                                  <CalendarPlus className="h-3.5 w-3.5" />
                                  Solicitar Reunión B2B
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>
    </PlatformLayout>
  );
}