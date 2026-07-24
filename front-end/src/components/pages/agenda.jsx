import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  Search,
  Share2,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import PlatformLayout from '@/components/layout/platform-layout';
import {
  AGENDA_DAYS,
  AGENDA_SESSIONS,
  getSessionById,
  groupSessionsByTime,
} from '@/data/agenda-sessions';
import { COPY } from './login-i18n';
import { navigateToAgenda, navigateToAgendaSession } from '@/config/platform-modules';

const FAVORITES_KEY = 'natp-agenda-favorites';

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
    // Manejo para restricciones de almacenamiento
  }
}

function SessionCategoryBadge({ label, tone }) {
  const toneClasses = {
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
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

function SessionCard({ session, copy, labels, isFavorite, onToggleFavorite, onOpen }) {
  const title = copy?.sessions?.[session.titleKey] ?? session.titleKey;
  const category = copy?.categories?.[session.categoryKey] ?? session.categoryKey;
  const zone = labels?.zones?.[session.zoneKey] ?? session.zoneKey;
  const duration = copy?.durations?.[session.durationKey] ?? session.durationKey;
  const speaker = session.speaker;

  return (
    <Card
      className="cursor-pointer transition-all hover:ring-2 hover:ring-ring/50 focus-within:ring-2 focus-within:ring-ring min-h-[170px] flex flex-col justify-between w-full"
      onClick={() => onOpen(session.id)}
    >
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <SessionCategoryBadge label={category} tone={session.categoryTone} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={`shrink-0 ${isFavorite ? 'text-destructive hover:text-destructive' : 'text-muted-foreground'}`}
            aria-label={isFavorite ? copy?.removeFromAgenda : copy?.addToAgenda}
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(session.id);
            }}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        </div>

        <CardTitle className="text-base leading-snug line-clamp-2 break-words">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0">
            <Clock3 className="h-3.5 w-3.5" />
            {session.startTime} · {duration}
          </span>
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{zone}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {speaker?.avatarText}
          </div>
          <span className="text-xs font-medium text-foreground truncate">{speaker?.name}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// --- LISTA DE AGENDA ---
function AgendaList({
  copy,
  labels,
  activeDayId,
  onDayChange,
  searchQuery,
  onSearchChange,
  favoriteIds,
  onToggleFavorite,
  onOpenSession,
}) {
  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return AGENDA_SESSIONS.filter((session) => {
      if (session.dayId !== activeDayId) return false;
      if (!query) return true;
      const title = copy?.sessions?.[session.titleKey]?.toLowerCase() ?? '';
      const speaker = session.speaker?.name?.toLowerCase() ?? '';
      return title.includes(query) || speaker.includes(query);
    });
  }, [activeDayId, copy, searchQuery]);

  const grouped = useMemo(() => groupSessionsByTime(filteredSessions), [filteredSessions]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <header className="space-y-3">
        <div>
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            {copy?.badge || 'Agenda'}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {copy?.title || 'Agenda'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {copy?.subtitle || '5 sesiones · 3 días · Oakland Edition'}
            </p>
          </div>
        </div>
      </header>

      {/* Toolbar / Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-lg bg-muted p-1 text-muted-foreground" role="tablist">
          {AGENDA_DAYS.map((day) => {
            const isActive = activeDayId === day.id;
            return (
              <button
                key={day.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:text-foreground'
                }`}
                onClick={() => onDayChange(day.id)}
              >
                {day.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative flex items-center w-full md:w-80">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            className="pl-9 pr-3"
            placeholder={copy?.searchPlaceholder || 'Buscar...'}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      {/* Grid del Timeline */}
      <div className="space-y-6 pt-2">
        {grouped.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {copy?.emptyDay || 'No hay sesiones programadas.'}
          </div>
        )}
        {grouped.map(([time, sessions]) => (
          <section key={time} className="grid grid-cols-1 gap-4 md:grid-cols-[80px_1fr]">
            <div className="text-sm font-semibold text-muted-foreground md:pt-2">
              {time}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  copy={copy}
                  labels={labels}
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

// --- DETALLE DE SESIÓN ---
function AgendaDetail({ sessionId, copy, labels, favoriteIds, onToggleFavorite }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sessionId]);

  const session = getSessionById(sessionId);

  if (!session) {
    return (
      <main className="max-w-3xl mx-auto space-y-6 text-center py-12 animate-in fade-in-0 duration-300">
        <Button variant="ghost" size="sm" onClick={() => navigateToAgenda()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {copy?.backToAgenda || 'Volver a la agenda'}
        </Button>
        <p className="text-muted-foreground">{copy?.sessionNotFound || 'Sesión no encontrada'}</p>
      </main>
    );
  }

  const title = copy?.sessions?.[session.titleKey] ?? session.titleKey;
  const about = copy?.sessions?.[session.aboutKey] ?? session.aboutKey;
  const category = copy?.categories?.[session.categoryKey] ?? session.categoryKey;
  const track = copy?.tracks?.[session.trackKey] ?? session.trackKey;
  const zone = labels?.zones?.[session.zoneKey] ?? session.zoneKey;
  const format = copy?.formats?.[session.formatKey] ?? session.formatKey;
  const language = copy?.languages?.[session.languageKey] ?? session.languageKey;
  const duration = copy?.durations?.[session.durationKey] ?? session.durationKey;
  const day = AGENDA_DAYS.find((item) => item.id === session.dayId);
  const dateLabel = day ? day.shortLabel : '';
  const isFavorite = favoriteIds.has(session.id);
  const speakerRole = copy?.speakerRoles?.[session.speaker?.roleKey] ?? session.speaker?.roleKey;

  return (
    <main className="max-w-4xl mx-auto space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-400">
      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigateToAgenda()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {copy?.backToAgenda || 'Volver a la agenda'}
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <SessionCategoryBadge label={category} tone={session.categoryTone} />
            <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
              {track}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> {copy?.labels?.date || 'Fecha'}
            </span>
            <p className="text-xs font-semibold text-foreground">{dateLabel}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Clock3 className="h-3 w-3" /> {copy?.labels?.schedule || 'Horario'}
            </span>
            <p className="text-xs font-semibold text-foreground">
              {session.startTime} – {session.endTime} ({duration})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {copy?.labels?.location || 'Ubicación'}
            </span>
            <p className="text-xs font-semibold text-foreground">{zone}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              <Globe2 className="h-3 w-3" /> {copy?.labels?.formatLanguage || 'Formato / Idioma'}
            </span>
            <p className="text-xs font-semibold text-foreground">
              {format} · {language}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">{copy?.aboutTitle || 'Acerca de'}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{about}</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">{copy?.speakerTitle || 'Ponente'}</h2>
          <div className="flex items-center gap-4 rounded-xl border border-border p-4 bg-background">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
              {session.speaker?.avatarText || <User className="h-6 w-6" />}
            </div>
            <div>
              <strong className="block text-base font-bold text-foreground">
                {session.speaker?.name}
              </strong>
              <span className="text-xs text-muted-foreground">{speakerRole}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant={isFavorite ? 'destructive' : 'default'}
            className="flex-1 sm:flex-none rounded-xl"
            onClick={() => onToggleFavorite(session.id)}
          >
            <Heart className="h-4 w-4 mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? (copy?.removeFromAgenda || 'Quitar de mi agenda') : (copy?.myAgenda || 'Añadir a mi agenda')}
          </Button>

          <Button type="button" variant="outline" className="flex-1 sm:flex-none rounded-xl" disabled>
            <CalendarPlus className="h-4 w-4 mr-2" />
            {copy?.addGoogleCalendar || 'Añadir a Google Calendar'}
          </Button>

          <Button type="button" variant="outline" className="rounded-xl" disabled>
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
}) {
  const t = COPY[language] ?? COPY.es;
  const copy = t.agenda;
  const labels = copy?.labels;

  const [activeDayId, setActiveDayId] = useState('day1');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);

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
      badgeLabel={copy?.badge || 'Agenda'}
    >
      {sessionId ? (
        <AgendaDetail
          sessionId={sessionId}
          copy={copy}
          labels={labels}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <AgendaList
          copy={copy}
          labels={labels}
          activeDayId={activeDayId}
          onDayChange={setActiveDayId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onOpenSession={handleOpenSession}
        />
      )}
    </PlatformLayout>
  );
}