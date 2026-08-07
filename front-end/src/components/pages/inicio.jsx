import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Globe,
  Handshake,
  LayoutDashboard,
  Users,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PlatformLayout from '@/components/layout/platform-layout';
import { COPY } from './login-i18n';
import { navigateToModule } from '@/config/platform-modules';

export default function Inicio({ language, onLanguageChange, isDarkMode, onToggleTheme, userProfile }) {
  const t = COPY[language] ?? COPY.es;

  // 1. Datos Reales del Usuario mapeados desde userProfile (con respaldo seguro)
  const user = {
    nombre: userProfile?.name || userProfile?.nombre || 'Usuario',
    apellido: userProfile?.apellido || '',
    rol: userProfile?.role || userProfile?.rol || 'Empresa / Participante',
    organizacion: userProfile?.organizacion || userProfile?.organizacion_nombre || 'Organización Independiente',
    pais: userProfile?.pais || 'México',
    estatusMembresia: userProfile?.estatus_membresia === 'activo' ? 'Activa' : (userProfile?.estatusMembresia || 'Activa'),
  };

  // 2. Estadísticas Globales dinámicas (con valores iniciales en 0 o un respaldo)
  const [estadisticas, setEstadisticas] = useState({
    usuariosRegistrados: 0,
    usuariosActivos: 0,
    empresas: 0,
    patrocinadores: 0,
    paisesRepresentados: 0,
    reunionesB2B: 0,
  });

  // 3. Consultar la API en tiempo real al montar el componente
  useEffect(() => {
    async function fetchEstadisticasGlobales() {
      try {
        const response = await fetch('/api/v1/usuarios/stats/globales');
        if (response.ok) {
          const data = await response.json();
          setEstadisticas(data);
        }
      } catch (error) {
        console.error('Error al sincronizar las estadísticas globales:', error);
      }
    }

    fetchEstadisticasGlobales();
  }, []);


// 3. Estado dinámico para Próximas Reuniones conectadas a la BD
  const [reuniones, setReuniones] = useState([]);

  // 4. Consultar las citas B2B en tiempo real al montar el componente
  useEffect(() => {
    async function fetchReuniones() {
      try {
        const response = await fetch(`/api/v1/reuniones/proximas?usuario_id=${localStorage.getItem('usuario_id') || ''}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setReuniones(data);
          } else {
            setReuniones([]);
          }
        }
      } catch (error) {
        console.error('Error al sincronizar las reuniones:', error);
      }
    }

    fetchReuniones();
  }, []);

  return (
    <PlatformLayout
      activeModuleId="inicio"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={LayoutDashboard}
      badgeLabel={t.inicio?.badge || 'Dashboard'}
      availableModuleIds={['inicio', 'networking', 'agenda']}
    >
      <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6 pb-20 sm:pb-12 animate-in fade-in-0 duration-300">
        
        {/* ENCABEZADO Y TARJETA */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>

          {/* TARJETA DE PERFIL INSTITUCIONAL */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rol</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm mt-0.5 truncate capitalize">{user.rol}</p>
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
        </div>

        {/* COMPONENTE COMPACTO DE MÉTRICAS */}
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

                {/* ACCESO DIRECTO */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateToModule('agenda')}
                    className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    Ver Agenda <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
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

          {/* NETWORKING */}
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-3.5 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-primary shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Networking
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToModule('networking')}
                  className="text-xs text-primary hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Abrir <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col gap-2 active:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-muted-foreground">
                      Encuentra perfiles alineados y agenda reuniones con potenciales socios comerciales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </PlatformLayout>
  );
}