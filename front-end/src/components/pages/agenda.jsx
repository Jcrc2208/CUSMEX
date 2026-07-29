import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  Share2,
  User,
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
import { COPY } from './login-i18n';
import { navigateToAgenda, navigateToAgendaSession } from '@/config/platform-modules';

const FAVORITES_KEY = 'cusmex-agenda-favorites';

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
  }
];

function readFavoriteIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function persistFavoriteIds(ids) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
    }
  } catch {
    // Manejo de almacenamiento
  }
}

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

function SessionCard({ session, isFavorite, onToggleFavorite, onOpen }) {
  if (!session) return null;

  return (
    <Card
      className="cursor-pointer transition-all hover:ring-2 hover:ring-ring/50 focus-within:ring-2 focus-within:ring-ring min-h-[170px] flex flex-col justify-between w-full"
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
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={`shrink-0 ${
              isFavorite ? 'text-destructive hover:text-destructive' : 'text-muted-foreground'
            }`}
            aria-label={isFavorite ? 'Quitar de mi agenda' : 'Añadir a mi agenda'}
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(session.id);
            }}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
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
            {session.ponente_nombre || 'Ponente por asignar'}
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
  favoriteIds,
  onToggleFavorite,
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
            <p className="text-sm text-muted-foreground mt-1">Programa oficial de sesiones</p>
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
            No hay sesiones programadas en este día.
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
                  isFavorite={favoriteIds.has(session.id)}
                  onToggleFavorite={onToggleFavorite}
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

function AgendaDetail({ session, favoriteIds, onToggleFavorite }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [session?.id]);

  if (!session) {
    return (
      <main className="max-w-3xl mx-auto space-y-6 text-center py-12 animate-in fade-in-0 duration-300">
        <Button variant="ghost" size="sm" onClick={() => navigateToAgenda()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la agenda
        </Button>
        <p className="text-muted-foreground">Sesión no encontrada</p>
      </main>
    );
  }

  const isFavorite = favoriteIds.has(session.id);

  return (
    <main className="max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-400">
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigateToAgenda()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la agenda
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <SessionCategoryBadge
              label={session.categoria || 'General'}
              tone={session.categoria_tone || 'blue'}
            />
            {session.track && (
              <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                {session.track}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {session.titulo}
          </h1>
        </div>

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
              {session.hora_inicio || '--:--'} – {session.hora_fin || '--:--'} ({session.duracion || 'N/A'})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3" /> UBICACIÓN
            </span>
            <p className="text-xs font-semibold text-foreground">{session.ubicacion || 'Por definir'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Globe2 className="h-3 w-3" /> FORMATO / IDIOMA
            </span>
            <p className="text-xs font-semibold text-foreground">
              {session.formato || 'Presencial'} · {session.idioma || 'Español'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Acerca de esta sesión</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {session.descripcion || 'Sin descripción disponible.'}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Speaker</h2>
          <div className="flex items-center gap-4 rounded-xl border border-border p-4 bg-background">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
              {session.ponente_iniciales || <User className="h-6 w-6" />}
            </div>
            <div>
              <strong className="block text-base font-bold text-foreground">
                {session.ponente_nombre || 'Sin asignar'}
              </strong>
              <span className="text-xs text-muted-foreground">
                {session.ponente_cargo || 'Ponente'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant={isFavorite ? 'destructive' : 'default'}
            className="flex-1 sm:flex-none rounded-xl"
            onClick={() => onToggleFavorite?.(session.id)}
          >
            <Heart className="h-4 w-4 mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Quitar de mi agenda' : 'Mi agenda'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none rounded-xl"
            onClick={() => {
              const title = encodeURIComponent(session.titulo || 'Reunión CUSMEX');
              const details = encodeURIComponent(session.descripcion || '');
              const location = encodeURIComponent(session.ubicacion || 'Remoto');

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
                    text: session.descripcion,
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
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);

  const selectedSession = useMemo(
    () => activeSessions.find((s) => String(s.id) === String(sessionId)),
    [activeSessions, sessionId]
  );

  function handleToggleFavorite(id) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistFavoriteIds(next);
      return next;
    });
  }

  function handleOpenSession(id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigateToAgendaSession(id);
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
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <AgendaList
          sessions={activeSessions}
          days={activeDays}
          activeDayId={activeDayId}
          onDayChange={setActiveDayId}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onOpenSession={handleOpenSession}
        />
      )}
    </PlatformLayout>
  );
}