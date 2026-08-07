import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  FileText, 
  CalendarPlus, 
  CheckCircle2, 
  Building2,
  Edit3,
  Search,
  SlidersHorizontal,
  X,
  Filter,
  Globe,
  Clock,
  Calendar,
  Send
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import PlatformLayout from '@/components/layout/platform-layout';
// NOTA: Ya no necesitamos importar NETWORKING_PROFILES de archivos estáticos

export default function Networking({ language, onLanguageChange, isDarkMode, onToggleTheme }) {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'search'
  const [requestedMeetings, setRequestedMeetings] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado dinámico para los perfiles que vienen de FastAPI
  const [NETWORKING_PROFILES, setNetworkingProfiles] = useState([]);
  
  // Modal de Filtros
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // ------------------------------------------------------------------
  // ESTADO DEL MODAL B2B
  // ------------------------------------------------------------------
  const [selectedProfileForB2B, setSelectedProfileForB2B] = useState(null);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [b2bFormData, setB2bFormData] = useState({
    tema_interes: '',
    asunto: '',
    descripcion_agenda: '',
    fecha_propuesta: '',
    hora_inicio: '',
    hora_fin: ''
  });

  // ------------------------------------------------------------------
  // ESTADO DEL FORMULARIO DE ONBOARDING (Alineado a la BD Nexus)
  // ------------------------------------------------------------------
  const [formData, setFormData] = useState({
    puesto_cargo: '',
    empresa_institucion: '',
    tamano_empresa: '',
    servicios_ofrece: '',
    servicios_busca: '',
    objetivo_networking: '',
    formato_reunion: '',
    perfil_linkedin: '',
    sitio_web: '',
    resumen_ejecutivo: '',
    perfil_publico: true
  });

  // ------------------------------------------------------------------
  // FILTROS DE BÚSQUEDA LIBRE (Sincronizados con tablas y ENUMs de Nexus)
  // ------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOffering, setFilterOffering] = useState('');
  const [filterLookingFor, setFilterLookingFor] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterOffering) count++;
    if (filterLookingFor) count++;
    if (filterOrganization) count++;
    if (filterRole) count++;
    if (filterCountry) count++;
    if (filterLanguage) count++;
    return count;
  }, [filterOffering, filterLookingFor, filterOrganization, filterRole, filterCountry, filterLanguage]);

  // Cargar perfiles desde FastAPI al iniciar el componente
  useEffect(() => {
    const fetchNetworkingProfiles = async () => {
      try {
        const response = await fetch('/api/v1/networking/perfiles');
        if (!response.ok) throw new Error('Error al obtener perfiles de networking');
        const result = await response.json();
        setNetworkingProfiles(result.data || []);
      } catch (error) {
        console.error("Error cargando red:", error);
      }
    };
    fetchNetworkingProfiles();
  }, []);

  // Efecto para regresar al inicio de la página al cambiar vistas
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isProfileComplete, activeTab]);

  // ------------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------------
  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsProfileComplete(true);
      setActiveTab('ai');
    } catch (error) {
      console.error('Error al guardar el perfil de networking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenB2BModal = (profile) => {
    setSelectedProfileForB2B(profile);
    setB2bFormData({
      tema_interes: '',
      asunto: '',
      descripcion_agenda: '',
      fecha_propuesta: '',
      hora_inicio: '09:00',
      hora_fin: '10:00'
    });
    setIsB2BModalOpen(true);
  };


  
const handleSubmitB2BRequest = async (e) => {
    e.preventDefault();
    if (!selectedProfileForB2B) return;

    try {
      // Tomamos el ID del usuario actual del localStorage (o uno de respaldo para pruebas)
      const usuarioActualId = localStorage.getItem('usuario_id') || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      // Validar que no intentes agendarte a ti mismo
      if (usuarioActualId === selectedProfileForB2B.id) {
        alert('No puedes solicitar una reunión contigo mismo.');
        return;
      }

      // Payload adaptado 100% a la clase CrearCitaB2B de tu main.py
      const payload = {
        solicitante_id: usuarioActualId,
        destinatario_id: selectedProfileForB2B.id,
        titulo: b2bFormData.asunto,                      // Mapea a 'titulo' (String)
        proposito_reunion: b2bFormData.tema_interes,     // Mapea a 'proposito_reunion' (Text)
        mensaje_propuesta: b2bFormData.descripcion_agenda, // Mapea a 'mensaje_propuesta' (Text)
        fecha: b2bFormData.fecha_propuesta,              // Fecha en formato 'YYYY-MM-DD'
        hora_inicio: b2bFormData.hora_inicio + (b2bFormData.hora_inicio.length === 5 ? ':00' : ''), // Asegurar formato HH:MM:SS
        hora_fin: b2bFormData.hora_fin + (b2bFormData.hora_fin.length === 5 ? ':00' : '')
      };

      const response = await fetch('/api/v1/citas_b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalle del error del servidor:", errorData);
        throw new Error('Error al registrar la cita B2B');
      }

      setRequestedMeetings((prev) => new Set(prev).add(selectedProfileForB2B.id));
      setIsB2BModalOpen(false);
      setSelectedProfileForB2B(null);
      
      alert('¡Solicitud de reunión B2B enviada con éxito!');
    } catch (error) {
      console.error("Error al enviar cita B2B:", error);
      alert('Hubo un error al enviar la solicitud. Revisa la consola.');
    }
  };

  // Filtrado dinámico para la pestaña de Búsqueda Libre
  const filteredProfiles = useMemo(() => {
    return NETWORKING_PROFILES.filter((profile) => {
      const query = searchQuery.trim().toLowerCase();
      
      const matchesQuery = !query || 
        profile.name?.toLowerCase().includes(query) || 
        profile.company?.toLowerCase().includes(query) ||
        profile.organization?.toLowerCase().includes(query) ||
        profile.role?.toLowerCase().includes(query);

      const matchesOffering = !filterOffering || profile.offering?.includes(filterOffering);
      const matchesLookingFor = !filterLookingFor || profile.lookingFor?.includes(filterLookingFor);
      const matchesOrganization = !filterOrganization || profile.organization === filterOrganization || profile.company === filterOrganization;
      const matchesRole = !filterRole || profile.role === filterRole;
      const matchesCountry = !filterCountry || profile.country === filterCountry;
      const matchesLanguage = !filterLanguage || profile.preferredLanguage === filterLanguage;

      return matchesQuery && matchesOffering && matchesLookingFor && matchesOrganization && matchesRole && matchesCountry && matchesLanguage;
    });
  }, [NETWORKING_PROFILES, searchQuery, filterOffering, filterLookingFor, filterOrganization, filterRole, filterCountry, filterLanguage]);

  const clearFilters = () => {
    setFilterOffering('');
    setFilterLookingFor('');
    setFilterOrganization('');
    setFilterRole('');
    setFilterCountry('');
    setFilterLanguage('');
  };

  // Estilo dinámico según % de Match
  const getMatchBadgeStyle = (percentage) => {
    if (percentage >= 90) {
      return 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30';
    }
    if (percentage >= 80) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
  };


  // Renderizado dinámico de tarjetas
  const renderProfileCard = (profile) => {
    const hasRequested = requestedMeetings.has(profile.id);

    return (
      <Card key={profile.id} className="flex flex-col justify-between border-border hover:border-primary/40 transition-all shadow-sm">
        <CardHeader className="p-5 pb-3 space-y-3">
          
          {/* Fila superior: % Match, Tag de IA y Botón LinkedIn */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${getMatchBadgeStyle(profile.matchPercentage)}`}>
                {profile.matchPercentage}% Match
              </span>
              <span className="text-[10px] font-medium text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded-md">
                Sugerido por IA
              </span>
            </div>

            {(profile.linkedinUrl || profile.cvUrl) && (
              <a href={profile.linkedinUrl || profile.cvUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="xs" className="text-[11px] text-[#D4AF37] border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 h-7 gap-1 font-medium">
                  <FileText className="h-3.5 w-3.5" />
                  Ver LinkedIn
                </Button>
              </a>
            )}
          </div>

          {/* Datos principales del perfil (Nombre, Rol, Organización, País, Idioma) */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
              {profile.avatar}
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold">{profile.name}</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                <Building2 className="h-3 w-3 shrink-0" />
                <span>{profile.role || 'Participante'}</span>
                <span>·</span>
                <span className="font-medium text-foreground">{profile.organization || profile.company || 'Sin Organización'}</span>
              </p>
              
              {/* Campos Agregados: País e Idioma Sugerido */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 font-medium">
                  <Globe className="h-3 w-3 text-primary shrink-0" />
                  {profile.country || 'México'}
                </span>
                <span className="bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 font-semibold uppercase text-[10px]">
                  Idioma: {profile.preferredLanguage || 'es'}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibilidad */}
          {profile.matchReason && (
            <div className="text-xs text-muted-foreground pt-1 bg-muted/30 p-2 rounded-lg border border-border/40">
              <span className="font-semibold text-foreground">Compatibilidad: </span>
              {profile.matchReason}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4">
          {/* Secciones OFRECE y BUSCA */}
          <div className="space-y-2 text-xs border-t border-border/60 pt-3">
            <div>
              <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider block mb-1.5">
                Ofrece
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.offering?.map((tag) => (
                  <span key={tag} className="rounded-md bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 text-[11px] font-medium border border-[#D4AF37]/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider block mb-1.5">
                Busca
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.lookingFor?.map((tag) => (
                  <span key={tag} className="rounded-md bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 text-[11px] font-medium border border-[#10B981]/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Botón de Solicitud de Reunión */}
          <Button
            type="button"
            variant={hasRequested ? "outline" : "default"}
            className={`w-full rounded-lg text-xs gap-2 h-9 font-semibold ${
              hasRequested 
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20" 
                : ""
            }`}
            onClick={() => handleOpenB2BModal(profile)}
            disabled={hasRequested}
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
          </div>
        </header>

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

          {/* PESTAÑA 1: SUGERENCIAS POR IA */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in-0 duration-300">
              {NETWORKING_PROFILES.filter((profile) => profile.id !== (localStorage.getItem('usuario_id') || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')).map((profile) => renderProfileCard(profile))}
            </div>
          )}

          {/* PESTAÑA 2: BÚSQUEDA LIBRE */}
          {activeTab === 'search' && (
            <div className="space-y-5 animate-in fade-in-0 duration-300">
              
              {/* Barra de búsqueda + Botón Filtros */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    className="pl-9 text-xs h-10 rounded-xl"
                    placeholder="Buscar por nombre, organización o rol..."
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

              {/* Resultados filtrados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => renderProfileCard(profile))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground space-y-2">
                    <p className="text-sm font-medium">No se encontraron perfiles con los filtros seleccionados.</p>
                    <Button variant="link" onClick={clearFilters} className="text-xs text-primary">
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>

              {/* MODAL DE FILTROS COMPLETO */}
              {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in-0 duration-200">
                  <div className="w-full sm:max-w-md bg-background border border-border rounded-t-2xl sm:rounded-2xl p-5 space-y-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 max-h-[90vh] overflow-y-auto">
                    
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

                    {/* Formulario de Filtros */}
                    <div className="space-y-4 text-left">
                      
                      {/* Organización (Tabla organizaciones) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Organización</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterOrganization}
                          onChange={(e) => setFilterOrganization(e.target.value)}
                        >
                          <option value="">Todas las organizaciones</option>
                          <option value="CUSMEX Trade Group">CUSMEX Trade Group</option>
                          <option value="Tech Global Corp">Tech Global Corp</option>
                          <option value="AgroAgro S.A.">AgroAgro S.A.</option>
                          <option value="TechInnovate">TechInnovate</option>
                          <option value="LogiData">LogiData</option>
                        </select>
                      </div>

                      {/* Rol (Tabla roles) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Rol</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                        >
                          <option value="">Todos los roles</option>
                          <option value="admin">Administrador</option>
                          <option value="participante">Participante</option>
                          <option value="patrocinador">Patrocinador</option>
                          <option value="CEO & Co-fundadora">CEO & Co-fundadora</option>
                          <option value="Director de Operaciones">Director de Operaciones</option>
                        </select>
                      </div>

                      {/* País (Columna usuarios.pais) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">País</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterCountry}
                          onChange={(e) => setFilterCountry(e.target.value)}
                        >
                          <option value="">Todos los países</option>
                          <option value="México">México</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="Colombia">Colombia</option>
                        </select>
                      </div>

                      {/* Idioma Sugerido / Preferido (Columna usuarios.idioma_preferido) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Idioma Sugerido</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterLanguage}
                          onChange={(e) => setFilterLanguage(e.target.value)}
                        >
                          <option value="">Todos los idiomas</option>
                          <option value="es">Español (es)</option>
                          <option value="en">Inglés (en)</option>
                          <option value="fr">Francés (fr)</option>
                        </select>
                      </div>

                      {/* Ofrece (Tabla intereses_comerciales) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Ofrece</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterOffering}
                          onChange={(e) => setFilterOffering(e.target.value)}
                        >
                          <option value="">Todos los servicios</option>
                          <option value="Tecnología y Software">Tecnología y Software</option>
                          <option value="Agroindustria y Alimentos">Agroindustria y Alimentos</option>
                          <option value="Manufactura e Industria Automotriz">Manufactura e Industria Automotriz</option>
                          <option value="Energías Limpias y Renovables">Energías Limpias y Renovables</option>
                          <option value="Logística y Cadenas de Suministro">Logística y Cadenas de Suministro</option>
                          <option value="Desarrollo SaaS">Desarrollo SaaS</option>
                          <option value="Consultoría Cloud">Consultoría Cloud</option>
                          <option value="Inversión">Inversión</option>
                        </select>
                      </div>

                      {/* Busca (Tabla tipos_conexion) */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Busca</label>
                        <select 
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterLookingFor}
                          onChange={(e) => setFilterLookingFor(e.target.value)}
                        >
                          <option value="">Cualquiera</option>
                          <option value="Socios Comerciales B2B">Socios Comerciales B2B</option>
                          <option value="Proveedores de Servicios o Materia Prima">Proveedores de Servicios o Materia Prima</option>
                          <option value="Clientes Potenciales">Clientes Potenciales</option>
                          <option value="Mentores y Asesores de Industria">Mentores y Asesores de Industria</option>
                          <option value="Proveedores Frontend">Proveedores Frontend</option>
                          <option value="Socios Comerciales">Socios Comerciales</option>
                          <option value="Talento Senior">Talento Senior</option>
                        </select>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 text-xs h-9"
                        onClick={clearFilters}
                      >
                        Limpiar Filtros
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1 text-xs h-9"
                        onClick={() => setIsFilterModalOpen(false)}
                      >
                        Aplicar Filtros
                      </Button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MODAL DESPLEGABLE DE SOLICITUD B2B */}
        {/* ------------------------------------------------------------------ */}
        {isB2BModalOpen && selectedProfileForB2B && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
            <div className="w-full max-w-xl bg-background border border-border rounded-2xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              
              {/* Header del Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 font-bold text-base text-foreground">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                  <span>Solicitar Reunión B2B</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsB2BModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmitB2BRequest} className="space-y-4 text-left">
                
                {/* 1. Resumen del Destinatario (Jalado dinámicamente) */}
                <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60 space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Destinatario
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20 text-xs">
                      {selectedProfileForB2B.avatar}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-foreground text-sm">{selectedProfileForB2B.name}</p>
                      <p className="text-muted-foreground">
                        {selectedProfileForB2B.company || selectedProfileForB2B.organization} · <span className="font-medium text-foreground">{selectedProfileForB2B.country || 'México'}</span>
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-semibold">
                          {selectedProfileForB2B.commercialProfile || 'Importador / Exportador'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Propósito o Tema de la reunión */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Propósito o Tema de la reunión <span className="text-destructive">*</span>
                  </label>
                  <select 
                    required
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={b2bFormData.tema_interes}
                    onChange={(e) => setB2bFormData({ ...b2bFormData, tema_interes: e.target.value })}
                  >
                    <option value="">Selecciona un tema de interés</option>
                    <option value="Comité de Comercio Exterior">Comité de Comercio Exterior</option>
                    <option value="Comité de Innovación y Tecnología">Comité de Innovación y Tecnología</option>
                    <option value="Comité de Logística y Cadena de Suministro">Comité de Logística y Cadena de Suministro</option>
                    <option value="Alianzas Estratégicas">Alianzas Estratégicas</option>
                    <option value="Inversión y Financiamiento">Inversión y Financiamiento</option>
                  </select>
                </div>

                {/* 3. Título / Asunto corto */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Título / Asunto corto <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="text"
                    className="text-xs h-9 rounded-lg"
                    placeholder="Ejemplo: Alianza estratégica para distribución en México"
                    value={b2bFormData.asunto}
                    onChange={(e) => setB2bFormData({ ...b2bFormData, asunto: e.target.value })}
                  />
                </div>

                {/* 4. Mensaje / Propuesta de valor */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Mensaje / Propuesta de valor <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Describe concretamente qué ofreces y qué buscas en esta reunión..."
                    value={b2bFormData.descripcion_agenda}
                    onChange={(e) => setB2bFormData({ ...b2bFormData, descripcion_agenda: e.target.value })}
                  />
                </div>

                {/* 5. Propuesta de Fecha y Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Fecha</label>
                    <div className="relative">
                      <Input
                        required
                        type="date"
                        className="text-xs h-9 rounded-lg pr-2"
                        value={b2bFormData.fecha_propuesta}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, fecha_propuesta: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Hora inicio</label>
                    <Input
                      required
                      type="time"
                      className="text-xs h-9 rounded-lg"
                      value={b2bFormData.hora_inicio}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, hora_inicio: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Hora fin</label>
                    <Input
                      required
                      type="time"
                      className="text-xs h-9 rounded-lg"
                      value={b2bFormData.hora_fin}
                      onChange={(e) => setB2bFormData({ ...b2bFormData, hora_fin: e.target.value })}
                    />
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-3 pt-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 text-xs h-9"
                    onClick={() => setIsB2BModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 text-xs h-9 gap-2 font-semibold"
                  >
                    <Send className="h-3.5 w-3.5" /> Enviar Solicitud
                  </Button>
                </div>

              </form>

            </div>
          </div>
        )}

      </main>
    </PlatformLayout>
  );
}