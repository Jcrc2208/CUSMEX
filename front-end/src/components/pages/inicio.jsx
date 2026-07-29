import React from 'react';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Globe,
  Handshake,
  HeartHandshake,
  LayoutDashboard,
  ShieldCheck,
  Users,
  UserCheck,
  Vote,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';
import { navigateToModule } from '@/config/platform-modules';

export default function Inicio({ language, onLanguageChange, isDarkMode, onToggleTheme, userProfile }) {
  const t = COPY[language] ?? COPY.es;

  // =========================================================================
  // BACKEND INTEGRATION PLACEHOLDERS
  // =========================================================================

  // 1. Datos del Usuario / Perfil
  const user = userProfile ?? {
    nombre: 'Carlos',
    apellido: 'Mendoza',
    rol: 'Delegado Titular',
    organizacion: 'Cámara de Comercio e Industria',
    pais: 'México',
    estatusMembresia: 'Activa',
    es_elegible_para_votar: true,
  };

  // 2. Estadísticas Globales de la Plataforma
  const estadisticas = {
    usuariosRegistrados: 1250,
    usuariosActivos: 840,
    empresas: 180,
    patrocinadores: 24,
    paisesRepresentados: 12,
    reunionesB2B: 320,
  };

  // 3. Próximas Reuniones
  const reuniones = [
    {
      id: 'r1',
      titulo: 'Mesa Técnica: Cadena de Suministro y Nearshoring',
      fecha_hora: 'Hoy · 11:30 - 12:30 AM',
      lugar: 'Sala Pacífico',
    },
    {
      id: 'r2',
      titulo: 'Asamblea General Ordinaria CUSMEX',
      fecha_hora: 'Mañana · 09:00 - 10:30 AM',
      lugar: 'Auditorio Principal',
    },
  ];

  // 4. Alertas de Votación
  const votacionesActivas = [
    {
      id: 'v1',
      titulo: 'Votación para Elección de Junta Directiva 2026-2028',
      fecha_cierre: 'Cierra hoy a las 18:00 hrs',
      puedeParticipar: user.es_elegible_para_votar,
    },
  ];

  return (
    <PlatformLayout
      activeModuleId="inicio"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={LayoutDashboard}
      badgeLabel={t.inicio?.badge || 'Dashboard'}
    >
      <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6 pb-20 sm:pb-12 animate-in fade-in-0 duration-300">
        
        {/* ENCABEZADO PERSONALIZADO */}
        <div className="border-b border-border pb-3 pt-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
        </div>

        {/* TARJETA DE PERFIL INSTITUCIONAL */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                    Perfil Institucional
                  </h2>
                  <p className="text-[11px] text-muted-foreground hidden sm:block">
                    Acreditación y facultades de representación
                  </p>
                </div>
              </div>

              <div>
                {user.es_elegible_para_votar ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    <CheckCircle2 className="w-3 h-3" /> Voto Habilitado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3 h-3" /> Sin Voto
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rol</p>
                <p className="font-semibold text-foreground text-xs sm:text-sm mt-0.5 truncate">{user.rol}</p>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Organización
                </p>
                <p className="font-semibold text-foreground text-xs sm:text-sm mt-0.5 truncate">{user.organizacion}</p>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" /> País
                </p>
                <p className="font-semibold text-foreground text-xs sm:text-sm mt-0.5 truncate">{user.pais}</p>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Estatus</p>
                <p className="font-semibold text-[#10B981] text-xs sm:text-sm mt-0.5 truncate">
                  {user.estatusMembresia}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* COMPONENTE COMPACTO DE MÉTRICAS (Un solo panel unificado) */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 grid grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-border/50 -m-3 sm:-m-4">
            
            {/* Metrica 1 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-primary shrink-0" /> Registrados
              </span>
              <p className="text-base sm:text-xl font-black text-foreground mt-1">
                {estadisticas.usuariosRegistrados.toLocaleString()}
              </p>
            </div>

            {/* Metrica 2 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#10B981] shrink-0" /> Activos
              </span>
              <p className="text-base sm:text-xl font-black text-[#10B981] mt-1">
                {estadisticas.usuariosActivos.toLocaleString()}
              </p>
            </div>

            {/* Metrica 3 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-primary shrink-0" /> Empresas
              </span>
              <p className="text-base sm:text-xl font-black text-foreground mt-1">
                {estadisticas.empresas}
              </p>
            </div>

            {/* Metrica 4 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-amber-500 shrink-0" /> Sponsors
              </span>
              <p className="text-base sm:text-xl font-black text-foreground mt-1">
                {estadisticas.patrocinadores}
              </p>
            </div>

            {/* Metrica 5 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#22D3EE] shrink-0" /> Países
              </span>
              <p className="text-base sm:text-xl font-black text-[#22D3EE] mt-1">
                {estadisticas.paisesRepresentados}
              </p>
            </div>

            {/* Metrica 6 */}
            <div className="p-3 sm:p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Handshake className="w-3 h-3 text-primary shrink-0" /> Citas B2B
              </span>
              <p className="text-base sm:text-xl font-black text-foreground mt-1">
                {estadisticas.reunionesB2B}+
              </p>
            </div>

          </div>
        </Card>

        {/* SECCIONES SECUNDARIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* PRÓXIMAS REUNIONES */}
          <Card className="lg:col-span-2 border border-border bg-card shadow-sm">
            <CardContent className="p-3.5 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-primary shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Próximas Reuniones
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToModule('agenda')}
                  className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Ver Agenda <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {reuniones.length > 0 ? (
                <div className="space-y-2.5">
                  {reuniones.map((reunion) => (
                    <div
                      key={reunion.id}
                      className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 active:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug">
                          {reunion.titulo}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {reunion.fecha_hora} · <span className="text-foreground font-medium">{reunion.lugar}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateToModule('agenda')}
                        className="w-full sm:w-auto text-center px-3 py-1.5 text-[11px] rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-colors shrink-0"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                Utiliza Match para crear conexiones estratégicas y gestionar reuniones con otros usuarios.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ALERTAS DE VOTACIÓN */}
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-3.5 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Vote className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  Alertas de Votación
                </h3>
              </div>

              {votacionesActivas.length > 0 ? (
                <div className="space-y-2.5">
                  {votacionesActivas.map((votacion) => (
                    <div
                      key={votacion.id}
                      className="p-3 rounded-lg border border-border bg-muted/20 space-y-2"
                    >
                      <h4 className="font-bold text-xs text-foreground leading-snug">
                        {votacion.titulo}
                      </h4>
                      <p className="text-[11px] text-[#22D3EE] font-medium">
                        {votacion.fecha_cierre}
                      </p>
                      {votacion.puedeParticipar ? (
                        <button
                          type="button"
                          onClick={() => navigateToModule('votaciones')}
                          className="w-full py-2 px-3 rounded-md bg-[#D80621] hover:bg-[#D80621]/90 text-white text-xs font-bold transition-all text-center shadow-sm"
                        >
                          Emitir Voto Ahora
                        </button>
                      ) : (
                        <p className="text-[10px] text-muted-foreground italic">
                          Su rol actual no incluye facultades de voto para esta sesión.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No hay convocatorias de votación activas.
                </p>
              )}
            </CardContent>
          </Card>

        </div>

      </main>
    </PlatformLayout>
  );
}