import {
  CalendarDays,
  Handshake,
  Languages,
  LayoutDashboard,
  ShieldCheck,
  Users,
  UserCog,
  Sparkles
} from 'lucide-react';

// Map of icons for getFeatures()
export const FEATURE_ICONS = {
  'agenda': CalendarDays,
  'matchmaking': Handshake,
  'ia-b2b': Sparkles,
  'usuarios-roles': Users,
  'traduccion': Languages,
};

const PLATFORM_MODULES = [
  { id: 'confi_user', icon: UserCog },
  { id: 'inicio', icon: LayoutDashboard },
  { id: 'networking', icon: Handshake },
  { id: 'agenda', icon: CalendarDays },
  { id: 'auth', icon: ShieldCheck }
];

function buildModules(labels) {
  return PLATFORM_MODULES.map((module) => ({
    ...module,
    label: labels[module.id] || module.id,
    href: `#${module.id}`,
  }));
}

export const LANGUAGE_STORAGE_KEY = 'natp-language';

export const LANGUAGES = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
];

export function getInitialLanguage() {
  if (typeof window === 'undefined') return 'es';
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === 'es' || saved === 'en' || saved === 'fr') return saved;
  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if (browser === 'en' || browser === 'fr') return browser;
  return 'es';
}

export function applyLanguage(code) {
  document.documentElement.lang = code;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

export const COPY = {
  es: {
    modulesButton: 'Módulos',
    modulesLabel: 'Navegación de la plataforma',
    modulesMobileTitle: 'Módulos NexusMatch',
    authBadge: 'Autenticación y Control de Acceso',
    heroKicker: 'Autenticación y Control de Acceso',
    heroTitle: 'NexusMatch',
    heroDescription:
      'Bienvenido al espacio donde empresas, gobiernos y organizaciones conectan para agendar reuniones de negocios estratégicas, encontrar aliados comerciales y potenciar sus oportunidades durante el North American Trade Parliament.',
    featuresTitle: 'Al iniciar sesión tendrás acceso a:',
    accessType: 'Tipo de acceso',
    email: 'Correo',
    password: 'Contraseña',
    enter: 'Entrar a NexusMatch',
    forgotPassword: '¿Olvidaste tu contraseña?',
    requestAccess: 'Solicitar acceso',
    logout: 'Cerrar sesión',
    themeToLight: 'Cambiar a modo claro',
    themeToDark: 'Cambiar a modo oscuro',
    languageLabel: 'Idioma',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    adminBadge: 'Admin',
    comingSoonTitle: 'Módulo en desarrollo',
    comingSoonDescription:
      'Esta sección estará disponible próximamente. Por ahora puedes explorar Inicio y Autenticación.',
    comingSoonScopeLabel: 'Incluirá:',
    backToInicio: 'Ir a Inicio',
    moduleScopes: {
      networking: [
        'Business Matchmaking',
        'Catálogo de empresas',
        'Buscador avanzado',
        'Solicitudes de reunión',
      ],
      agenda: [
        'Agenda personal y del evento',
        'Reuniones, salas y ponentes',
        'Calendario integrado',
      ],
    },
    moduleLabels: {
      confi_user: 'Configuración Inicial',
      inicio: 'Inicio',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Autenticación y Control de Acceso',
    },
    modules: buildModules({
      confi_user: 'Configuración Inicial',
      inicio: 'Inicio',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Autenticación y Control de Acceso',
    }),
    inicio: {
      badge: 'Inicio',
      kicker: 'Centro de control del evento',
      title: 'Dashboard NATP Oakland Edition',
      description:
        'Resumen operativo del North American Trade Parliament: métricas clave, accesos rápidos, próximas reuniones y noticias oficiales del evento.',
      stats: [
        { id: 'participants', label: 'Participantes registrados', value: '1,240' },
        { id: 'meetings', label: 'Reuniones programadas', value: '86' },
        { id: 'companies', label: 'Empresas conectadas', value: '312' },
        { id: 'countries', label: 'Países representados', value: '18' },
      ],
      eventSummary: {
        title: 'Resumen del evento',
        text: 'Oakland Edition reúne a gobiernos, empresas y organizaciones para impulsar acuerdos comerciales, networking estratégico y sesiones de alto nivel durante tres días de actividades.',
        highlights: [
          'Apertura institucional y sesión plenaria',
          'Mesas de trabajo por comité',
          'Business Matchmaking y reuniones bilaterales',
        ],
      },
      quickAccess: {
        title: 'Accesos rápidos',
        items: [
          { id: 'agenda', label: 'Ver agenda del evento', hint: 'Sesiones, salas y ponentes' },
          { id: 'networking', label: 'Explorar matchmaking', hint: 'Empresas y solicitudes' },         
        ],
      },
      upcomingMeetings: {
        title: 'Próximas reuniones',
        items: [
          {
            id: 'm1',
            time: '09:30',
            title: 'Mesa México–Canadá: cadena de suministro',
            location: 'Sala Pacífico · Comité Comercio',
          },
          {
            id: 'm2',
            time: '11:00',
            title: 'Matchmaking: energía limpia y movilidad',
            location: 'Networking Hub · Nivel 2',
          },
          {
            id: 'm3',
            time: '14:15',
            title: 'Sesión plenaria: integración regional',
            location: 'Auditorio Principal',
          },
        ],
      },
      news: {
        title: 'Noticias y anuncios',
        items: [
          {
            id: 'n1',
            tag: 'Oficial',
            title: 'Publicada la agenda preliminar del día 2',
            excerpt: 'Consulta horarios, salas y ponentes confirmados para las sesiones de comité.',
          },
          {
            id: 'n2',
            tag: 'Recordatorio',
            title: 'Ventana de matchmaking abierta hasta las 18:00',
            excerpt: 'Envía solicitudes de reunión antes del cierre de la jornada.',
          },
          {
            id: 'n3',
            tag: 'Comunicado',
            title: 'Nuevo módulo de traducción en tiempo real',
            excerpt: 'Disponible en inglés, español y francés para sesiones seleccionadas.',
          },
        ],
      },
    },
    agenda: {
      badge: 'Agenda',
      title: 'Agenda',
      subtitle: '5 sesiones · 3 días · Oakland Edition',
      liveLabel: 'En directo',
      daysLabel: 'Días del evento',
      searchPlaceholder: 'Buscar…',
      resultsLabel: 'resultados',
      standsLabel: 'Stands / salas',
      standsPendingHint: 'Filtro por stand — próximamente',
      themesFilter: 'Filtro temáticas',
      emptyDay: 'No hay sesiones para este día con los filtros actuales.',
      backToAgenda: 'Volver a la agenda',
      sessionNotFound: 'No encontramos esta sesión.',
      aboutTitle: 'Acerca de esta sesión',
      speakerTitle: 'Speaker',
      myAgenda: 'Mi agenda',
      addToAgenda: 'Agregar a mi agenda',
      removeFromAgenda: 'Quitar de mi agenda',
      addGoogleCalendar: 'Agregar a Google Calendar',
      share: 'Compartir',
      categories: {
        keynote: 'Keynote',
        workshop: 'Taller',
        conference: 'Conferencia',
        panel: 'Panel',
      },
      tracks: {
        institutional: 'Institucional',
        trade: 'Comercio',
        networking: 'Networking',
        committees: 'Comités',
        integration: 'Integración regional',
      },
      formats: {
        inPerson: 'Presencial',
        hybrid: 'Híbrido',
        virtual: 'Virtual',
      },
      languages: {
        spanish: 'Español',
        english: 'Inglés',
        french: 'Francés',
        bilingual: 'Español · Inglés',
      },
      durations: {
        '1h': '1h',
        '1h30': '1h 30m',
      },
      speakerRoles: {
        speaker: 'speaker',
        moderator: 'moderadora',
        panel: 'panel',
      },
      labels: {
        weekdays: {
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
        },
        dates: {
          day1: 'martes 18 de marzo, 2026',
          day2: 'miércoles 19 de marzo, 2026',
          day3: 'jueves 20 de marzo, 2026',
        },
        stands: {
          mainAuditorium: 'Auditorio principal',
          pacificRoom: 'Sala Pacífico',
          networkingHub: 'Networking Hub',
          committeeA: 'Mesa Comité A',
          committeeB: 'Mesa Comité B',
          bilateralSuites: 'Suites bilaterales',
        },
        zones: {
          mainAuditorium: 'Auditorio principal',
          pacificRoom: 'Sala Pacífico',
          networkingHub: 'Networking Hub · Nivel 2',
          committeeA: 'Mesa Comité de Comercio',
          bilateralSuites: 'Suites bilaterales · Ala Este',
        },
      },
      sessions: {
        openingKeynoteTitle: 'Apertura institucional del NATP Oakland Edition',
        openingKeynoteAbout:
          'Sesión plenaria de bienvenida con autoridades, visión del parlamento y prioridades de la agenda comercial trilateral para la edición Oakland.',
        supplyChainTitle: 'Cadena de suministro México–Canadá: mesa técnica',
        supplyChainAbout:
          'Taller práctico sobre nearshoring, logística transfronteriza y oportunidades de proveeduría con casos del sector manufactura y energía.',
        matchmakingTitle: 'Business Matchmaking: cómo maximizar tus reuniones',
        matchmakingAbout:
          'Orientación para participantes empresariales: perfiles, solicitudes, salas de reunión y buenas prácticas para el hub de networking del evento.',
        tradePanelTitle: 'Panel del Comité de Comercio: acuerdos en curso',
        tradePanelAbout:
          'Diálogo entre delegaciones sobre mesas de trabajo, documentos en revisión y próximos hitos de votación institucional.',
        integrationLabTitle: 'Laboratorio de integración regional',
        integrationLabAbout:
          'Sesión participativa para alinear proyectos conjuntos, mapas de stakeholders y follow-up post-parlamento entre mesas México y Canadá.',
      },
    },
    roles: {
      gobierno: {
        title: 'Acceso Gobierno',
        description:
          'Para representantes de dependencias gubernamentales y organismos públicos.',
        placeholder: 'gobierno@natp.org',
      },
      empresas: {
        title: 'Acceso Empresas',
        description:
          'Entra para coordinar networking, reuniones y tu presencia en la Asamblea de Oakland.',
        placeholder: 'empresa@dominio.com',
      },      
      patrocinador: {
        title: 'Acceso Patrocinador',
        description: 'Para aliados estratégicos, sponsors y partners oficiales del evento.',
        placeholder: 'patrocinador@dominio.com',
      },      
      admin: {
        title: 'Administrador',
        description: 'Gestiona cuentas, roles institucionales, auditoría y la configuración general de NexusMatch.',
        placeholder: 'admin@natp.org',
      }
    },
    features: [
      {
        id: 'agenda',
        title: 'Agenda y Solicitudes B2B',
        description:
          'Coordina tu agenda de negocios, solicita reuniones bilaterales con otros asistentes y gestiona tus horarios y salas confirmadas en tiempo real.',
      },     
      {
        id: 'matchmaking',
        title: 'Business Matchmaking',
        description:
          'Descubre conexiones estratégicas entre empresas, gobiernos y cámaras con recomendaciones según el perfil comercial y sector de interés.',
      },
      {
        id: 'ia-b2b',
        title: 'Asistente IA para Reuniones B2B',
        description:
          'Obtén sugerencias inteligentes para preparar tus citas comerciales, identificar oportunidades de match clave y dar seguimiento a tus acuerdos.',
      },
    ],
  },
  en: {
    modulesButton: 'Modules',
    modulesLabel: 'Platform navigation',
    modulesMobileTitle: 'NexusMatch Modules',
    authBadge: 'Authentication and Access Control',
    heroKicker: 'Authentication and Access Control',
    heroTitle: 'NexusMatch',
    heroDescription:
      'Welcome to the space where companies, governments, and organizations connect to schedule strategic business meetings, find commercial partners, and boost opportunities during the North American Trade Parliament.',
    featuresTitle: 'Once signed in, you will have access to:',
    accessType: 'Access type',
    email: 'Email',
    password: 'Password',
    enter: 'Enter NexusMatch',
    forgotPassword: 'Forgot your password?',
    requestAccess: 'Request access',
    logout: 'Log out',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    languageLabel: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    adminBadge: 'Admin',
    comingSoonTitle: 'Module in development',
    comingSoonDescription:
      'This section will be available soon. For now you can explore Home and Authentication.',
    comingSoonScopeLabel: 'Will include:',
    backToInicio: 'Go to Home',
    moduleScopes: {
      networking: [
        'Business Matchmaking',
        'Company catalog',
        'Advanced search',
        'Meeting requests',
      ],
      agenda: [
        'Personal and event agenda',
        'Meetings, rooms, and speakers',
        'Integrated calendar',
      ],
    },
    moduleLabels: {
      confi_user: 'Initial Setup',
      inicio: 'Home',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Authentication and Access Control',
    },
    modules: buildModules({
      confi_user: 'Initial Setup',
      inicio: 'Home',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Authentication and Access Control',
    }),
    inicio: {
      badge: 'Home',
      kicker: 'Event control center',
      title: 'NATP Oakland Edition Dashboard',
      description:
        'Operational overview of the North American Trade Parliament: key metrics, quick access, upcoming meetings, and official event news.',
      stats: [
        { id: 'meetings', label: 'Scheduled meetings', value: '86' },
        { id: 'companies', label: 'Connected companies', value: '312' },
        { id: 'countries', label: 'Countries represented', value: '18' },
      ],
      eventSummary: {
        title: 'Event summary',
        text: 'Oakland Edition brings together governments, companies, and organizations to drive trade agreements, strategic networking, and high-level sessions over three days of activities.',
        highlights: [
          'Institutional opening and plenary session',
          'Committee working tables',
          'Business Matchmaking and bilateral meetings',
        ],
      },
      quickAccess: {
        title: 'Quick access',
        items: [
          { id: 'agenda', label: 'View event agenda', hint: 'Sessions, rooms, and speakers' },
          { id: 'networking', label: 'Explore matchmaking', hint: 'Companies and requests' },         
        ],
      },
      upcomingMeetings: {
        title: 'Upcoming meetings',
        items: [
          {
            id: 'm1',
            time: '09:30',
            title: 'Mexico–Canada table: supply chain',
            location: 'Pacific Room · Trade Committee',
          },
          {
            id: 'm2',
            time: '11:00',
            title: 'Matchmaking: clean energy and mobility',
            location: 'Networking Hub · Level 2',
          },
          {
            id: 'm3',
            time: '14:15',
            title: 'Plenary session: regional integration',
            location: 'Main Auditorium',
          },
        ],
      },
      news: {
        title: 'News and announcements',
        items: [
          {
            id: 'n1',
            tag: 'Official',
            title: 'Day 2 preliminary agenda published',
            excerpt: 'Review schedules, rooms, and confirmed speakers for committee sessions.',
          },
          {
            id: 'n2',
            tag: 'Reminder',
            title: 'Matchmaking window open until 6:00 PM',
            excerpt: 'Send meeting requests before the end of the day.',
          },
          {
            id: 'n3',
            tag: 'Release',
            title: 'New real-time translation module',
            excerpt: 'Available in English, Spanish, and French for selected sessions.',
          },
        ],
      },
    },
    agenda: {
      badge: 'Agenda',
      title: 'Agenda',
      subtitle: '5 sessions · 3 days · Oakland Edition',
      liveLabel: 'Live',
      daysLabel: 'Event days',
      searchPlaceholder: 'Search…',
      resultsLabel: 'results',
      standsLabel: 'Halls / Rooms',
      standsPendingHint: 'Hall filter — coming soon',
      themesFilter: 'Theme filter',
      emptyDay: 'No sessions found for this day with current filters.',
      backToAgenda: 'Back to agenda',
      sessionNotFound: 'Session not found.',
      aboutTitle: 'About this session',
      speakerTitle: 'Speaker',
      myAgenda: 'My agenda',
      addToAgenda: 'Add to my agenda',
      removeFromAgenda: 'Remove from my agenda',
      addGoogleCalendar: 'Add to Google Calendar',
      share: 'Share',
      categories: {
        keynote: 'Keynote',
        workshop: 'Workshop',
        conference: 'Conference',
        panel: 'Panel',
      },
      tracks: {
        institutional: 'Institutional',
        trade: 'Trade',
        networking: 'Networking',
        committees: 'Committees',
        integration: 'Regional integration',
      },
      formats: {
        inPerson: 'In-person',
        hybrid: 'Hybrid',
        virtual: 'Virtual',
      },
      languages: {
        spanish: 'Spanish',
        english: 'English',
        french: 'French',
        bilingual: 'Spanish · English',
      },
      durations: {
        '1h': '1h',
        '1h30': '1h 30m',
      },
      speakerRoles: {
        speaker: 'speaker',
        moderator: 'moderator',
        panel: 'panelist',
      },
      labels: {
        weekdays: {
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
        },
        dates: {
          day1: 'Tuesday, March 18, 2026',
          day2: 'Wednesday, March 19, 2026',
          day3: 'Thursday, March 20, 2026',
        },
        stands: {
          mainAuditorium: 'Main Auditorium',
          pacificRoom: 'Pacific Room',
          networkingHub: 'Networking Hub',
          committeeA: 'Committee Table A',
          committeeB: 'Committee Table B',
          bilateralSuites: 'Bilateral Suites',
        },
        zones: {
          mainAuditorium: 'Main Auditorium',
          pacificRoom: 'Pacific Room',
          networkingHub: 'Networking Hub · Level 2',
          committeeA: 'Trade Committee Table',
          bilateralSuites: 'Bilateral Suites · East Wing',
        },
      },
      sessions: {
        openingKeynoteTitle: 'NATP Oakland Edition Institutional Opening',
        openingKeynoteAbout:
          'Welcome plenary session featuring authorities, parliament vision, and trilateral trade agenda priorities for the Oakland edition.',
        supplyChainTitle: 'Mexico–Canada Supply Chain: Technical Panel',
        supplyChainAbout:
          'Practical workshop on nearshoring, cross-border logistics, and sourcing opportunities with manufacturing and energy industry cases.',
        matchmakingTitle: 'Business Matchmaking: Maximizing Your Meetings',
        matchmakingAbout:
          'Guidance for business participants: profiles, requests, meeting rooms, and best practices for the event networking hub.',
        tradePanelTitle: 'Trade Committee Panel: Ongoing Agreements',
        tradePanelAbout:
          'Dialogue between delegations on working tables, documents under review, and upcoming institutional voting milestones.',
        integrationLabTitle: 'Regional Integration Laboratory',
        integrationLabAbout:
          'Participatory session to align joint projects, stakeholder mapping, and post-parliament follow-up between Mexico and Canada tables.',
      },
    },
    roles: {
      gobierno: {
        title: 'Government Access',
        description:
          'For representatives of government agencies and public organizations.',
        placeholder: 'government@natp.org',
      },
      empresas: {
        title: 'Business Access',
        description:
          'Sign in to coordinate networking, meetings, and your presence at the Oakland Assembly.',
        placeholder: 'company@domain.com',
      },      
      patrocinador: {
        title: 'Sponsor Access',
        description: 'For strategic allies, sponsors, and official event partners.',
        placeholder: 'sponsor@domain.com',
      },
      admin: {
        title: 'Administrator',
        description: 'Manage accounts, institutional roles, auditing, and general NexusMatch configuration.',
        placeholder: 'admin@natp.org',
      }            
    },
    features: [
      {
        id: 'agenda',
        title: 'B2B Agenda and Requests',
        description:
          'Coordinate your business schedule, request bilateral meetings with other attendees, and manage your confirmed times and rooms in real time.',
      },      
      {
        id: 'matchmaking',
        title: 'Business Matchmaking',
        description:
          'Discover strategic connections between companies, governments, and chambers based on business profiles and sectors of interest.',
      },
      {
        id: 'ia-b2b',
        title: 'AI Assistant for B2B Meetings',
        description:
          'Get smart suggestions to prepare for commercial meetings, identify key match opportunities, and follow up on agreements.',
      },
    ],
  },
  fr: {
    modulesButton: 'Modules',
    modulesLabel: 'Navigation de la plateforme',
    modulesMobileTitle: 'Modules NexusMatch',
    authBadge: 'Authentification et contrôle d’accès',
    heroKicker: 'Authentification et contrôle d’accès',
    heroTitle: 'NexusMatch',
    heroDescription:
      'Bienvenue dans l’espace où entreprises, gouvernements et organisations se connectent pour planifier des réunions d’affaires stratégiques, trouver des partenaires commerciaux et développer des opportunités lors du North American Trade Parliament.',
    featuresTitle: 'Une fois connecté, vous aurez accès à :',
    accessType: 'Type d’accès',
    email: 'E-mail',
    password: 'Mot de passe',
    enter: 'Entrer dans NexusMatch',
    forgotPassword: 'Mot de passe oublié ?',
    requestAccess: 'Demander un accès',
    logout: 'Déconnexion',
    themeToLight: 'Passer en mode clair',
    themeToDark: 'Passer en mode sombre',
    languageLabel: 'Langue',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    adminBadge: 'Admin',
    comingSoonTitle: 'Module en développement',
    comingSoonDescription:
      'Cette section sera bientôt disponible. Pour l’instant, explorez Accueil et Authentification.',
    comingSoonScopeLabel: 'Comprendra :',
    backToInicio: 'Aller à Accueil',
    moduleScopes: {
      networking: [
        'Business Matchmaking',
        'Catalogue d’entreprises',
        'Recherche avancée',
        'Demandes de réunion',
      ],
      agenda: [
        'Agenda personnel et de l’événement',
        'Réunions, salles et intervenants',
        'Calendrier intégré',
      ],
    },
    moduleLabels: {
      confi_user: 'Configuration Initial',
      inicio: 'Accueil',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Authentification et contrôle d’accès',
    },
    modules: buildModules({
      confi_user: 'Configuration Initial',
      inicio: 'Accueil',
      networking: 'Networking',
      agenda: 'Agenda',
      auth: 'Authentification et contrôle d’accès',
    }),
    inicio: {
      badge: 'Accueil',
      kicker: 'Centre de contrôle de l’événement',
      title: 'Tableau de bord NATP Oakland Edition',
      description:
        'Vue opérationnelle du North American Trade Parliament : indicateurs clés, accès rapides, prochaines réunions et actualités officielles.',
      stats: [
        { id: 'meetings', label: 'Réunions programmées', value: '86' },
        { id: 'companies', label: 'Entreprises connectées', value: '312' },
        { id: 'countries', label: 'Pays représentés', value: '18' },
      ],
      eventSummary: {
        title: 'Résumé de l’événement',
        text: 'Oakland Edition réunit gouvernements, entreprises et organisations pour favoriser accords commerciaux, networking stratégique et sessions de haut niveau sur trois jours.',
        highlights: [
          'Ouverture institutionnelle et session plénière',
          'Tables de travail par comité',
          'Business Matchmaking et réunions bilatérales',
        ],
      },
      quickAccess: {
        title: 'Accès rapides',
        items: [
          { id: 'agenda', label: 'Voir l’agenda', hint: 'Sessions, salles et intervenants' },
          { id: 'networking', label: 'Explorer le matchmaking', hint: 'Entreprises et demandes' },         
        ],
      },
      upcomingMeetings: {
        title: 'Prochaines réunions',
        items: [
          {
            id: 'm1',
            time: '09:30',
            title: 'Table Mexique–Canada : chaîne d’approvisionnement',
            location: 'Salle Pacifique · Comité Commerce',
          },
          {
            id: 'm2',
            time: '11:00',
            title: 'Matchmaking : énergie propre et mobilité',
            location: 'Networking Hub · Niveau 2',
          },
          {
            id: 'm3',
            time: '14:15',
            title: 'Session plénière : intégration régionale',
            location: 'Auditorium principal',
          },
        ],
      },
      news: {
        title: 'Actualités et annonces',
        items: [
          {
            id: 'n1',
            tag: 'Officiel',
            title: 'Agenda préliminaire du jour 2 publié',
            excerpt: 'Consultez horaires, salles et intervenants confirmés pour les comités.',
          },
          {
            id: 'n2',
            tag: 'Rappel',
            title: 'Fenêtre matchmaking ouverte jusqu’à 18h00',
            excerpt: 'Envoyez vos demandes de réunion avant la fin de la journée.',
          },
        ],
      },
    },
    features: [
      {
        id: 'agenda',
        title: 'Agenda B2B et demandes',
        description:
          'Coordonnez votre agenda d’affaires, demandez des réunions bilatérales et gérez vos créneaux et salles confirmés en temps réel.',
      },
      {
        id: 'matchmaking',
        title: 'Business Matchmaking',
        description:
          'Découvrez des connexions stratégiques entre entreprises, gouvernements et chambres selon vos profils et secteurs d’intérêt.',
      },
      {
        id: 'ia-b2b',
        title: 'Assistant IA pour réunions B2B',
        description:
          'Obtenez des suggestions intelligentes pour préparer vos rendez-vous commerciaux, identifier des opportunités clés et assurer le suivi.',
      },
    ],
  },
};

export function getFeatures(lang) {
  const safeFeatures = COPY[lang]?.features || COPY['es'].features;
  
  return safeFeatures.map((feature) => ({
    ...feature,
    icon: FEATURE_ICONS[feature.id],
  }));
}