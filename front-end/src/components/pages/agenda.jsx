import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock3,
  MapPin,
  Share2,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Target,
  Sparkles,
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
            {session.hora_inicio || '--:--'} – {session.hora_fin || '--:--'}
          </span>
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{session.ubicacion || 'Por definir'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground uppercase">
            {session.destinatario_iniciales || <User className="h-3.5 w-3.5" />}
          </div>
          <span className="text-xs font-medium text-foreground truncate">
            {session.destinatario_nombre || 'Destinatario no especificado'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function AgendaList({
  sessions = [],
  onOpenSession,
}) {

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Agenda</h1>
          </div>
        </div>
      </header>

      <div className="space-y-6 pt-2">
        {safeSessions.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Utiliza Match para crear conexiones estratégicas y gestionar reuniones con otros usuarios.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onOpen={onOpenSession}
            />
          ))}
        </div>
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
        <p className="text-muted-foreground">Sesión o cita no encontrada</p>
      </main>
    );
  }

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
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={currentStatus} />
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
              {session.categoria || 'Reunión B2B'}
            </span>
          </div>
        </div>

        {/* 3. TÍTULO / ASUNTO CORTO */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" /> Asunto Corto
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
            {session.titulo || 'Sin título definido'}
          </h1>
        </div>

        <Separator />

        {/*DATOS DEL DESTINATARIO */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" /> Datos de la Persona Interesada
          </h2>

          <div className="rounded-xl border border-border p-4 sm:p-5 bg-background">
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary uppercase">
                {session.destinatario_iniciales ||
                  (session.destinatario_nombre
                    ? session.destinatario_nombre.slice(0, 2)
                    : <User className="h-6 w-6" />)}
              </div>
              <div className="space-y-1">
                <strong className="block text-base font-bold text-foreground leading-none">
                  {session.destinatario_nombre || 'Destinatario no especificado'}
                </strong>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {session.destinatario_empresa || 'Empresa no especificada'}
                  {session.destinatario_puesto && ` · ${session.destinatario_puesto}`}
                </p>
                {session.destinatario_pais && (
                  <p className="text-[11px] text-muted-foreground">
                    Ubicación: <span className="font-semibold text-foreground">{session.destinatario_pais}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROPÓSITO O TEMA DE LA REUNIÓN */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" /> Propósito o Tema de la Reunión
          </h2>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
            <p className="text-sm font-semibold text-foreground">
              {session.proposito_reunion || 'No se ha definido el propósito de la reunión.'}
            </p>
          </div>
        </div>

        {/* MENSAJE / PROPUESTA DE VALOR */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Mensaje / Propuesta de Valor
          </h2>
          <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {session.propuesta_valor || 'Sin propuesta de valor registrada.'}
            </p>
          </div>
        </div>

        {/* FECHA, HORA INICIO Y HORA FIN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
          {/* 5. FECHA */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-primary" /> 5. Fecha
            </span>
            <p className="text-xs font-semibold text-foreground">{session.fecha || 'Por definir'}</p>
          </div>

          {/*HORA INICIO */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-primary" /> 6. Hora Inicio
            </span>
            <p className="text-xs font-semibold text-foreground">{session.hora_inicio || '--:--'}</p>
          </div>

          {/*HORA FIN */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5 text-primary" /> 7. Hora Fin
            </span>
            <p className="text-xs font-semibold text-foreground">{session.hora_fin || '--:--'}</p>
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
                  const title = encodeURIComponent(session.titulo || 'Cita B2B');
                  const details = encodeURIComponent(
                    `Propósito: ${session.proposito_reunion || ''}\nPropuesta: ${session.propuesta_valor || ''}`
                  );
                  const location = encodeURIComponent(session.ubicacion || 'Remoto / Mesa B2B');

                  const now = new Date();
                  const startIso = now.toISOString().replace(/-|:|\.\d+/g, '');
                  const endDate = new Date(now.getTime() + 60 * 60 * 1000);
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
                        text: session.propuesta_valor || session.proposito_reunion,
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
}) {


  // 1. Estados para guardar las sesiones reales desde tu API
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);





  // 2. useEffect para consumir tu endpoint de FastAPI al montar el componente
  useEffect(() => {
    const fetchReuniones = async () => {
      try {
        const usuarioActualId = localStorage.getItem('usuario_id') || 1; // Tu ID de usuario
        
        const response = await fetch(`/api/v1/reuniones/proximas?usuario_id=${usuarioActualId}`);
        if (!response.ok) throw new Error('Error al cargar las reuniones');
        
        const data = await response.json();
        setSessions(data); // Inyectas las citas reales de MySQL
      } catch (error) {
        console.error("Error conectando con la API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReuniones();
  }, []);

  const selectedSession = useMemo(
    () => sessions.find((s) => String(s.id) === String(sessionId)),
    [sessions, sessionId]
  );

  function handleOpenSession(id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigateToAgendaSession(id);
  }

  // 3. Conexión real para actualizar el estatus en tu backend (Aceptar / Rechazar)
  async function handleUpdateStatus(id, newStatus, reason = '') {
    try {
      const response = await fetch(`/api/v1/citas_b2b/${id}/estatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatus_cita: newStatus, motivo_rechazo: reason })
      });

      if (!response.ok) throw new Error('No se pudo actualizar la cita');

      // Actualizamos el estado local para que refleje el cambio al instante sin recargar
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === id ? { ...session, estatus_cita: newStatus } : session
        )
      );

      console.log(`Cita ID ${id} actualizada a status ${newStatus}`);
    } catch (error) {
      console.error("Error al actualizar estatus:", error);
      alert("Hubo un error al actualizar la cita en el servidor.");
    }
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
          sessions={sessions}
          onOpenSession={handleOpenSession}
        />
      )}
    </PlatformLayout>
  );
}