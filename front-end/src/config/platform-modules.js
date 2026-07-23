export function parseRouteFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw || raw === 'auth') return { moduleId: 'auth', sessionId: null };
  const slash = raw.indexOf('/');
  if (slash === -1) return { moduleId: raw, sessionId: null };
  return {
    moduleId: raw.slice(0, slash),
    sessionId: decodeURIComponent(raw.slice(slash + 1)),
  };
}

export function getRouteFromHash() {
  return parseRouteFromHash().moduleId;
}

export function navigateToModule(moduleId) {
  if (moduleId === 'auth') {
    window.location.hash = '#auth';
    return;
  }
  window.location.hash = `#${moduleId}`;
}

export function navigateToAgenda() {
  window.location.hash = '#agenda';
}

export function navigateToAgendaSession(sessionId) {
  window.location.hash = `#agenda/${encodeURIComponent(sessionId)}`;
}

export const AVAILABLE_MODULES = new Set(['auth', 'inicio', 'agenda']);

export function isModuleAvailable(moduleId) {
  return AVAILABLE_MODULES.has(moduleId);
}
