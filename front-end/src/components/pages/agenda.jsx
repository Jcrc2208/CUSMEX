import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock3,
  Globe2,
  MapPin,
  Share2,
  User,
  Building2,
  Briefcase,
  Target,
  Network,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import PlatformLayout from '@/components/layout/platform-layout';
import { navigateToAgenda, navigateToAgendaSession } from '@/config/platform-modules';

const DEFAULT_DAYS = [
  { id: 'day1', label: 'Día 1' },
  { id: 'day2', label: 'Día 2' },
  { id: 'day3', label: 'Día 3' },
];

const DEFAULT_SESSIONS = [
  {
    id: 's1',
    dia_id: 'day1',
    titulo: 'Apertura institucional del CUSMEX',
    descripcion: 'Sesión plenaria de bienvenida con autoridades y visión del proyecto.',
    fecha: 'Mié 19',
    hora_inicio: '09:00',
    hora_fin: '10:00',
    duracion: '1h',
    ubicacion: 'Auditorio principal',
    formato: 'Presencial',
    idioma: 'Español',
    categoria: 'Keynote',
    categoria_tone: 'orange',
    track: 'Institucional',
    ponente_nombre: 'Dra. Elena Morales',
    ponente_cargo: 'Moderadora',
    ponente_iniciales: 'EM',
    estatus_cita: 'PENDIENTE DE RESPUESTA',
  },
];

function SessionCategoryBadge({ label, tone }) {
  const toneClasses = {
    orange: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${
        toneClasses[tone] ?? toneClasses.blue
      }`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = (status || 'PENDIENTE DE RESPUESTA').toUpperCase();

  const styles = {
    'PENDIENTE DE RESPUESTA': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CONFIRMADA: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    RECHAZADA: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold transition-colors ${
        styles[normalizedStatus] || styles['PENDIENTE DE RESPUESTA']
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

function SessionCard({ session, onOpen }) {
  if (!session) return null;

  return (
    <Card
      className="cursor-pointer transition-all hover:ring-2 hover:ring-ring/50 focus-within:ring-2 focus-within:ring-ring min-h-[160px] flex flex-col justify-between w-full"
      onClick={() => onOpen?.(session.id)}
    >
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <SessionCategoryBadge
              label={session.categoria || 'General'}
              tone={session.categoria_tone || 'blue'}
            />
          </div>
          <StatusBadge status={session.estatus_cita} />
        </div>

        <CardTitle className="text-base leading-snug line-clamp-2 break-words">
          {session.titulo || 'Sin título'}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0">
            <Clock3 className="h-3.5 w-3.5" />
            {session.hora_inicio || '--:--'} · {session.duracion || ''}
          </span>
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{session.ubicacion || 'Por definir'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {session.ponente_iniciales || <User className="h-3.5 w-3.5" />}
          </div>
          <span className="text-xs font-medium text-foreground truncate">
            {session.interesado_nombre || session.ponente_nombre || 'Participante'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function AgendaList({
  sessions = [],
  days = [],
  activeDayId,
  onDayChange,
  onOpenSession,
}) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeDays = Array.isArray(days) ? days : [];

  const filteredSessions = useMemo(() => {
    return safeSessions.filter((session) => session.dia_id === activeDayId);
  }, [activeDayId, safeSessions]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredSessions.forEach((session) => {
      const time = session.hora_inicio || 'Por definir';
      if (!groups[time]) groups[time] = [];
      groups[time].push(session);
    });
    return Object.entries(groups);
  }, [filteredSessions]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Agenda</h1>
          </div>
        </div>
      </header>

      {/* SELECTOR DE DÍAS */}
      <div className="flex items-center">
        <div className="inline-flex w-full sm:w-auto rounded-lg bg-muted p-1 text-muted-foreground" role="tablist">
          {safeDays.map((day) => {
            const isActive = activeDayId === day.id;
            return (
              <button
                key={day.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`flex-1 sm:flex-none rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:text-foreground'
                }`}
                onClick={() => onDayChange?.(day.id)}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 pt-2">
        {grouped.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Utiliza Match para crear conexiones estratégicas y gestionar reuniones con otros usuarios.
          </div>
        )}
        {grouped.map(([time, sessionsList]) => (
          <section key={time} className="grid grid-cols-1 gap-4 md:grid-cols-[80px_1fr]">
            <div className="text-sm font-semibold text-muted-foreground md:pt-2">{time}</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessionsList.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onOpen={onOpenSession}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

/* ========================================================================
   AGENDA DETAIL (RESPUESTA DE SOLICITUD Y CANCELACIÓN DE CITA B2B)
   ======================================================================== */
function AgendaDetail({ session, onUpdateStatus }) {
  const [currentStatus, setCurrentStatus] = useState(
    session?.estatus_cita || 'PENDIENTE DE RESPUESTA'
  );
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (session?.estatus_cita) {
      setCurrentStatus(session.estatus_cita);
    }
  }, [session?.id, session?.estatus_cita]);

  if (!session) {
    return (
      <main className="max-w-3xl mx-auto space-y-6 text-center py-12 animate-in fade-in-0 duration-300">
        <Button variant="ghost" size="sm" onClick={() => navigateToAgenda()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la agenda
        </Button>
        <p className="text-muted-foreground">Sesión o cita B2B no encontrada</p>
      </main>
    );
  }

  const getPerfilComercialLabel = (val) => {
    if (!val) return 'No especificado';
    const v = String(val).toLowerCase();
    if (v === 'exportador') return 'Exportador';
    if (v === 'importador') return 'Importador';
    if (v === 'ambos') return 'Exportador / Importador';
    return val;
  };

  const handleAccept = () => {
    setCurrentStatus('CONFIRMADA');
    setShowRejectPanel(false);
    onUpdateStatus?.(session.id, 'CONFIRMADA');
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Por favor indica el motivo del rechazo.');
      return;
    }
    setCurrentStatus('RECHAZADA');
    setShowRejectPanel(false);
    onUpdateStatus?.(session.id, 'RECHAZADA', rejectReason);
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-400">
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigateToAgenda()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la agenda
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-8 shadow-sm">
        {/* ENCABEZADO Y ESTATUS */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={currentStatus} />
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
              Reunión B2B
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {session.titulo || 'Cita de Negocios B2B'}
          </h1>
        </div>

        {/* METADATOS DE LA CITA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> FECHA
            </span>
            <p className="text-xs font-semibold text-foreground">{session.fecha || 'N/A'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Clock3 className="h-3 w-3" /> HORARIO
            </span>
            <p className="text-xs font-semibold text-foreground">
              {session.hora_inicio || '--:--'} – {session.hora_fin || '--:--'} ({session.duracion || '30m'})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3" /> UBICACIÓN
            </span>
            <p className="text-xs font-semibold text-foreground">{session.ubicacion || 'Mesa B2B / Virtual'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Globe2 className="h-3 w-3" /> FORMATO / IDIOMA
            </span>
            <p className="text-xs font-semibold text-foreground">
              {session.formato || 'Presencial'} · {session.interesado_idioma || session.idioma || 'Español'}
            </p>
          </div>
        </div>

        <Separator />

        {/* ACERCA DE LA REUNIÓN B2B */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Acerca de la Reunión B2B</h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {session.descripcion_agenda || session.descripcion || 'Sin descripción provista en la solicitud.'}
          </p>
        </div>

        <Separator />

        {/* PARTICIPANTE INTERESADO */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Participante Interesado</h2>

          <div className="rounded-xl border border-border p-5 bg-background space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary uppercase">
                  {session.interesado_iniciales ||
                    (session.interesado_nombre
                      ? session.interesado_nombre.slice(0, 2)
                      : <User className="h-6 w-6" />)}
                </div>
                <div>
                  <strong className="block text-base font-bold text-foreground">
                    {session.interesado_nombre || 'Usuario Interesado'}
                  </strong>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Building2 className="h-3.5 w-3.5" />
                    {session.interesado_empresa || 'Empresa no especificada'}
                  </span>
                </div>
              </div>

              {session.linkedln_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 self-start sm:self-center"
                  onClick={() => window.open(session.linkedln_url, '_blank')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Ver LinkedIn
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-lg">
              <div>
                <span className="text-muted-foreground">País / Idioma:</span>{' '}
                <span className="font-semibold text-foreground">
                  {session.interesado_pais || 'No registrado'} ({session.interesado_idioma || 'Español'})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Perfil Comercial:</span>{' '}
                <span className="font-semibold text-foreground">
                  {getPerfilComercialLabel(session.interes_export_import)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/50 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Oferta / Productos:
                </span>
                <p className="text-muted-foreground">
                  {session.usuario_intereses || 'No especificado.'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-primary" /> Busca / Objetivos:
                </span>
                <p className="text-muted-foreground">
                  {session.usuario_objetivos || 'No especificado.'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Network className="h-3.5 w-3.5 text-primary" /> Tipo de Conexión:
                </span>
                <p className="text-muted-foreground">
                  {session.usuario_conexiones || 'No especificado.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES DE ACEPTACIÓN / RECHAZO / GOOGLE CALENDAR */}
        <div className="space-y-4 pt-4 border-t border-border">
          {currentStatus === 'PENDIENTE DE RESPUESTA' && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                onClick={handleAccept}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aceptar Cita
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-xl font-semibold"
                onClick={() => setShowRejectPanel(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar Cita
              </Button>
            </div>
          )}

          {/* PANEL RECHAZO (FORMULARIO MOTIVO) */}
          {showRejectPanel && (
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>¿Por qué deseas rechazar la cita?</span>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Escribe brevemente el motivo de rechazo (ej. Conflicto de horario, fuera de interés comercial, etc.)..."
                className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => setShowRejectPanel(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="rounded-lg text-xs font-semibold"
                  onClick={handleConfirmReject}
                >
                  Confirmar Rechazo
                </Button>
              </div>
            </div>
          )}

          {/* SI FUE ACEPTADA: HABILITA GOOGLE CALENDAR */}
          {currentStatus === 'CONFIRMADA' && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="flex-1 rounded-xl bg-primary text-primary-foreground font-semibold"
                onClick={() => {
                  const title = encodeURIComponent(session.titulo || 'Cita B2B CUSMEX');
                  const details = encodeURIComponent(session.descripcion_agenda || session.descripcion || '');
                  const location = encodeURIComponent(session.ubicacion || 'Remoto / Mesa B2B');

                  const now = new Date();
                  const startIso = now.toISOString().replace(/-|:|\.\d+/g, '');
                  const endDate = new Date(now.getTime() + 30 * 60 * 1000);
                  const endIso = endDate.toISOString().replace(/-|:|\.\d+/g, '');

                  const dates = `${startIso}/${endIso}`;
                  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
                  window.open(url, '_blank');
                }}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Agregar a Google Calendar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: session.titulo,
                        text: session.descripcion_agenda || session.descripcion,
                        url: window.location.href,
                      });
                    } catch (error) {
                      if (error.name !== 'AbortError') {
                        console.error('Error al compartir:', error);
                      }
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('¡Enlace copiado al portapapeles!');
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Agenda({
  sessionId,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  sessions = DEFAULT_SESSIONS,
  days = DEFAULT_DAYS,
}) {
  const activeSessions = sessions.length > 0 ? sessions : DEFAULT_SESSIONS;
  const activeDays = days.length > 0 ? days : DEFAULT_DAYS;

  const [activeDayId, setActiveDayId] = useState(activeDays[0]?.id || 'day1');

  const selectedSession = useMemo(
    () => activeSessions.find((s) => String(s.id) === String(sessionId)),
    [activeSessions, sessionId]
  );

  function handleOpenSession(id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigateToAgendaSession(id);
  }

  function handleUpdateStatus(id, newStatus, reason = '') {
    // Aquí puedes realizar la llamada a tu API backend (ej. updateCitaStatus(id, newStatus, reason))
    console.log(`Cita ID ${id} actualizada a status ${newStatus} con motivo: "${reason}"`);
  }

  return (
    <PlatformLayout
      activeModuleId="agenda"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={CalendarDays}
      badgeLabel="Agenda"
    >
      {sessionId ? (
        <AgendaDetail
          session={selectedSession}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <AgendaList
          sessions={activeSessions}
          days={activeDays}
          activeDayId={activeDayId}
          onDayChange={setActiveDayId}
          onOpenSession={handleOpenSession}
        />
      )}
    </PlatformLayout>
  );
}