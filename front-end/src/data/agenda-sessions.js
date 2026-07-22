/** Datos de ejemplo — reemplazar con API / CMS del evento */

// --- Días actualizados a Miércoles 19, Jueves 20 y Viernes 21 ---
export const AGENDA_DAYS = [
  { id: 'day1', shortLabel: 'Mié 19', weekdayKey: 'wednesday' },
  { id: 'day2', shortLabel: 'Jue 20', weekdayKey: 'thursday' },
  { id: 'day3', shortLabel: 'Vie 21', weekdayKey: 'friday' },
];

export const AGENDA_STANDS = [
  { id: 'main-auditorium', labelKey: 'mainAuditorium', tone: 'orange', pending: true },
  { id: 'pacific-room', labelKey: 'pacificRoom', tone: 'blue', pending: true },
  { id: 'networking-hub', labelKey: 'networkingHub', tone: 'green', pending: true },
  { id: 'committee-a', labelKey: 'committeeA', tone: 'purple', pending: true },
  { id: 'committee-b', labelKey: 'committeeB', tone: 'yellow', pending: true },
  { id: 'bilateral-suites', labelKey: 'bilateralSuites', tone: 'cyan', pending: true },
];

export const AGENDA_SESSIONS = [
  {
    id: 'oak-opening-keynote',
    dayId: 'day1',
    standId: 'main-auditorium',
    categoryKey: 'keynote',
    categoryTone: 'orange',
    trackKey: 'institutional',
    titleKey: 'openingKeynoteTitle',
    aboutKey: 'openingKeynoteAbout',
    startTime: '09:00',
    endTime: '10:00',
    durationKey: '1h',
    zoneKey: 'mainAuditorium',
    formatKey: 'inPerson',
    languageKey: 'spanish',
    speaker: {
      name: 'Dra. Elena Morales',
      roleKey: 'moderator',
      avatarText: 'EM',
    },
  },
  {
    id: 'supply-chain-workshop',
    dayId: 'day1',
    standId: 'pacific-room',
    categoryKey: 'workshop',
    categoryTone: 'green',
    trackKey: 'trade',
    titleKey: 'supplyChainTitle',
    aboutKey: 'supplyChainAbout',
    startTime: '10:30',
    endTime: '11:30',
    durationKey: '1h',
    zoneKey: 'pacificRoom',
    formatKey: 'inPerson',
    languageKey: 'bilingual',
    speaker: {
      name: 'CUSMEX Trade Desk',
      roleKey: 'speaker',
      avatarText: 'CT',
    },
  },
  {
    id: 'matchmaking-briefing',
    dayId: 'day2',
    standId: 'networking-hub',
    categoryKey: 'conference',
    categoryTone: 'blue',
    trackKey: 'networking',
    titleKey: 'matchmakingTitle',
    aboutKey: 'matchmakingAbout',
    startTime: '11:00',
    endTime: '12:00',
    durationKey: '1h',
    zoneKey: 'networkingHub',
    formatKey: 'hybrid',
    languageKey: 'english',
    speaker: {
      name: 'NATP Business Connect',
      roleKey: 'speaker',
      avatarText: 'NB',
    },
  },
  {
    id: 'committee-trade-panel',
    dayId: 'day2',
    standId: 'committee-a',
    categoryKey: 'panel',
    categoryTone: 'purple',
    trackKey: 'committees',
    titleKey: 'tradePanelTitle',
    aboutKey: 'tradePanelAbout',
    startTime: '14:00',
    endTime: '15:30',
    durationKey: '1h30',
    zoneKey: 'committeeA',
    formatKey: 'inPerson',
    languageKey: 'spanish',
    speaker: {
      name: 'Comité de Comercio',
      roleKey: 'panel',
      avatarText: 'CC',
    },
  },
  {
    id: 'regional-integration-lab',
    dayId: 'day3',
    standId: 'bilateral-suites',
    categoryKey: 'workshop',
    categoryTone: 'green',
    trackKey: 'integration',
    titleKey: 'integrationLabTitle',
    aboutKey: 'integrationLabAbout',
    startTime: '10:00',
    endTime: '11:30',
    durationKey: '1h30',
    zoneKey: 'bilateralSuites',
    formatKey: 'inPerson',
    languageKey: 'french',
    speaker: {
      name: 'Mesa México–Canadá',
      roleKey: 'speaker',
      avatarText: 'MC',
    },
  },
];

export function getSessionById(sessionId) {
  return AGENDA_SESSIONS.find((session) => session.id === sessionId) ?? null;
}

export function groupSessionsByTime(sessions) {
  const map = new Map();
  for (const session of sessions) {
    const list = map.get(session.startTime) ?? [];
    list.push(session);
    map.set(session.startTime, list);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}