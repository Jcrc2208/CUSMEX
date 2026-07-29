import { useState } from 'react';
import {
  Users,
  Vote,
  Network,
  Search,
  Plus,
  MoreVertical,
  Pause,
  Download,
  X,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Check,
  UserX,
  Key,
  Lock,
  Copy,
  RefreshCw,
  Mail,
  Send
} from 'lucide-react';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PlatformLayout from '@/components/layout/platform-layout';

// --- 1. SUBCOMPONENTE: GESTIÓN DE USUARIOS Y ROLES ---
function UsersManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState(null);

  // Estados de Filtros Avanzados (Punto 2)
  const [roleFilter, setRoleFilter] = useState('todos');
  const [countryFilter, setCountryFilter] = useState('todos');
  const [languageFilter, setLanguageFilter] = useState('todos');
  const [voteFilter, setVoteFilter] = useState('todos');

  const [newUser, setNewUser] = useState({
    rol_id: '',
    organizacion_id: '',
    nombre: '',
    apellido: '',
    email: '',
    password_hash: '',
    pais: '',
    idioma_preferido: 'es',
    es_elegible_para_votar: false,
    estatus_membresia: 'activo',
  });

  const [usersList, setUsersList] = useState([
    {
      id: 'u1',
      nombre: 'Elena',
      apellido: 'Martínez',
      email: 'elena.m@empresa.com',
      pais: 'México',
      idioma_preferido: 'es',
      estatus_membresia: 'activo',
      es_elegible_para_votar: true,
      rol_nombre: 'Delegado',
      organizacion_nombre: 'Secretaría de Economía'
    },
    {
      id: 'u2',
      nombre: 'Carlos',
      apellido: 'Ruiz',
      email: 'carlos.ruiz@natp.org',
      pais: 'EE.UU.',
      idioma_preferido: 'en',
      estatus_membresia: 'activo',
      es_elegible_para_votar: false,
      rol_nombre: 'Administrador',
      organizacion_nombre: 'CUSMEX'
    },
    {
      id: 'u3',
      nombre: 'Sofía',
      apellido: 'Gómez',
      email: 'sgomez@tech.io',
      pais: 'Canadá',
      idioma_preferido: 'fr',
      estatus_membresia: 'inactivo',
      es_elegible_para_votar: false,
      rol_nombre: 'Observador',
      organizacion_nombre: 'Tech Trade Global'
    }
  ]);

  // Función para dar de baja o reactivar usuario
  const handleToggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.estatus_membresia === 'activo' ? 'inactivo' : 'activo';
        return { ...u, estatus_membresia: newStatus };
      }
      return u;
    }));
    setActiveUserMenu(null);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.nombre || !newUser.email) return;

    setUsersList([
      ...usersList,
      {
        ...newUser,
        id: `u-${Date.now()}`,
        rol_nombre: newUser.rol_id || 'Delegado',
        organizacion_nombre: newUser.organizacion_id || 'Organización N/A'
      }
    ]);
    setShowAddModal(false);
    setNewUser({
      rol_id: '',
      organizacion_id: '',
      nombre: '',
      apellido: '',
      email: '',
      password_hash: '',
      pais: '',
      idioma_preferido: 'es',
      es_elegible_para_votar: false,
      estatus_membresia: 'activo',
    });
  };

  const resetFilters = () => {
    setRoleFilter('todos');
    setCountryFilter('todos');
    setLanguageFilter('todos');
    setVoteFilter('todos');
  };

  const activeFiltersCount = [
    roleFilter !== 'todos',
    countryFilter !== 'todos',
    languageFilter !== 'todos',
    voteFilter !== 'todos'
  ].filter(Boolean).length;

  const filteredUsers = usersList.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      user.nombre.toLowerCase().includes(query) ||
      user.apellido.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.pais.toLowerCase().includes(query) ||
      user.organizacion_nombre.toLowerCase().includes(query)
    );

    const matchesRole = roleFilter === 'todos' || user.rol_nombre.toLowerCase() === roleFilter.toLowerCase();
    const matchesCountry = countryFilter === 'todos' || user.pais.toLowerCase() === countryFilter.toLowerCase();
    const matchesLanguage = languageFilter === 'todos' || user.idioma_preferido === languageFilter;
    const matchesVote =
      voteFilter === 'todos' ||
      (voteFilter === 'elegibles' && user.es_elegible_para_votar) ||
      (voteFilter === 'no_elegibles' && !user.es_elegible_para_votar);

    return matchesSearch && matchesRole && matchesCountry && matchesLanguage && matchesVote;
  });

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:max-w-xl">
          {/* Campo de búsqueda */}
          <div className="relative flex items-center w-full">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              className="pl-9 pr-3 w-full text-xs"
              placeholder="Buscar por nombre, correo, país u organización..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Botón de Filtrado Avanzado */}
          <div className="relative">
            <Button
              variant={activeFiltersCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="gap-1.5 text-xs shrink-0 relative"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-background text-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Menú Flotante de Filtros */}
            {showFilterMenu && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-popover text-popover-foreground border rounded-md shadow-lg p-3 z-30 text-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold">Filtrar Usuarios</span>
                  {activeFiltersCount > 0 && (
                    <button onClick={resetFilters} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                      Limpiar todo
                    </button>
                  )}
                </div>

                {/* Filtro por Rol */}
                <div>
                  <label className="font-medium block mb-1 text-[11px] text-muted-foreground">Rol</label>
                  <select
                    className="w-full border rounded-md p-1.5 bg-background text-xs"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="Delegado">Delegado</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Observador">Observador</option>
                  </select>
                </div>

                {/* Filtro por País */}
                <div>
                  <label className="font-medium block mb-1 text-[11px] text-muted-foreground">País</label>
                  <select
                    className="w-full border rounded-md p-1.5 bg-background text-xs"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                  >
                    <option value="todos">Todos los países</option>
                    <option value="México">México</option>
                    <option value="EE.UU.">EE.UU.</option>
                    <option value="Canadá">Canadá</option>
                  </select>
                </div>

                {/* Filtro por Idioma Preferido */}
                <div>
                  <label className="font-medium block mb-1 text-[11px] text-muted-foreground">Idioma Preferido</label>
                  <select
                    className="w-full border rounded-md p-1.5 bg-background text-xs"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    <option value="todos">Todos los idiomas</option>
                    <option value="es">Español (es)</option>
                    <option value="en">Inglés (en)</option>
                    <option value="fr">Francés (fr)</option>
                  </select>
                </div>

                {/* Filtro por Elegible para Votar */}
                <div>
                  <label className="font-medium block mb-1 text-[11px] text-muted-foreground">Puede Votar</label>
                  <select
                    className="w-full border rounded-md p-1.5 bg-background text-xs"
                    value={voteFilter}
                    onChange={(e) => setVoteFilter(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="elegibles">Sí (Elegibles)</option>
                    <option value="no_elegibles">No (No elegibles)</option>
                  </select>
                </div>

                <div className="pt-1 flex justify-end">
                  <Button size="sm" className="w-full h-7 text-xs" onClick={() => setShowFilterMenu(false)}>
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5 text-xs w-full sm:w-auto shrink-0">
          <Plus className="h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base">Control de Usuarios Registrados</CardTitle>
          <CardDescription className="text-xs">
            Gestión de elegibilidad, membresías y roles asignados en la base de datos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto border-t sm:border sm:rounded-md">
            <table className="w-full text-xs text-left min-w-[600px]">
              <thead className="bg-muted/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Usuario / Email</th>
                  <th className="p-3">Organización / País</th>
                  <th className="p-3">Rol / Membresía</th>
                  <th className="p-3">Voto Elegible</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{u.nombre} {u.apellido}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{u.organizacion_nombre}</p>
                        <p className="text-[11px] text-muted-foreground">{u.pais} • Idioma: {u.idioma_preferido.toUpperCase()}</p>
                      </td>
                      <td className="p-3 space-y-1">
                        <span className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-medium">
                          {u.rol_nombre}
                        </span>
                        <div>
                          <span className={`text-[10px] uppercase font-bold ${u.estatus_membresia === 'activo' ? 'text-emerald-600' : 'text-[#D80621]'}`}>
                            • {u.estatus_membresia}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        {u.es_elegible_para_votar ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                            <UserCheck className="h-3.5 w-3.5" /> Sí
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">No</span>
                        )}
                      </td>
                      <td className="p-3 text-right relative">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setActiveUserMenu(activeUserMenu === u.id ? null : u.id)}
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>

                        {/* Menú de Acciones */}
                        {activeUserMenu === u.id && (
                          <div className="absolute right-3 top-10 w-44 bg-popover text-popover-foreground border rounded-md shadow-lg p-1 z-30 text-left">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-muted rounded-sm transition-colors"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              <span>{u.estatus_membresia === 'activo' ? 'Dar de baja' : 'Reactivar usuario'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-muted-foreground">
                      No se encontraron usuarios con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL CREAR USUARIO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-base">Agregar Nuevo Usuario</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Nombre *</label>
                    <Input required value={newUser.nombre} onChange={e => setNewUser({ ...newUser, nombre: e.target.value })} placeholder="" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Apellido *</label>
                    <Input required value={newUser.apellido} onChange={e => setNewUser({ ...newUser, apellido: e.target.value })} placeholder="" />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Correo Electrónico *</label>
                  <Input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Contraseña *</label>
                    <Input type="password" required value={newUser.password_hash} onChange={e => setNewUser({ ...newUser, password_hash: e.target.value })} placeholder="" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">País *</label>
                    <Input required value={newUser.pais} onChange={e => setNewUser({ ...newUser, pais: e.target.value })} placeholder="" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Rol</label>
                    <Input value={newUser.rol_id} onChange={e => setNewUser({ ...newUser, rol_id: e.target.value })} placeholder="" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Organización</label>
                    <Input value={newUser.organizacion_id} onChange={e => setNewUser({ ...newUser, organizacion_id: e.target.value })} placeholder="" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Idioma Preferido</label>
                    <select
                      className="w-full border rounded-md p-2 bg-background"
                      value={newUser.idioma_preferido}
                      onChange={e => setNewUser({ ...newUser, idioma_preferido: e.target.value })}
                    >
                      <option value="es">Español (es)</option>
                      <option value="en">Inglés (en)</option>
                      <option value="fr">Francés (fr)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Estatus Membresía</label>
                    <select
                      className="w-full border rounded-md p-2 bg-background"
                      value={newUser.estatus_membresia}
                      onChange={e => setNewUser({ ...newUser, estatus_membresia: e.target.value })}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="elegible"
                    checked={newUser.es_elegible_para_votar}
                    onChange={e => setNewUser({ ...newUser, es_elegible_para_votar: e.target.checked })}
                    className="rounded border-border"
                  />
                  <label htmlFor="elegible" className="font-medium cursor-pointer">
                    Elegible para votar en Asambleas
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Usuario</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export function TokenGeneratorManager() {
  const [generatedTokenData, setGeneratedTokenData] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados del Formulario dentro del Modal
  const [selectedRole, setSelectedRole] = useState('participante');
  const [selectedOrganizacion, setSelectedOrganizacion] = useState('CUSMEX Trade Group');
  const [puedeVotar, setPuedeVotar] = useState('si');

  // Lista inicial de tokens
  const [tokenList, setTokenList] = useState([
    { 
      token: 'CUSMEX-8F92-A109', 
      rol: 'participante', 
      organizacion: 'CUSMEX Trade Group', 
      vota: 'si', 
      fecha: '2026-07-28', 
      estado: 'Disponible' 
    },
    { 
      token: 'CUSMEX-3K44-D806', 
      rol: 'admin', 
      organizacion: 'Tech Global Corp', 
      vota: 'no', 
      fecha: '2026-07-27', 
      estado: 'Usado' 
    }
  ]);

  const handleOpenRoleModal = () => {
    setShowRoleModal(true);
  };

  // Confirmación y generación del token con todas sus propiedades
  const handleConfirmTokenGeneration = (e) => {
    e.preventDefault();
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newToken = `CUSMEX-${randomHex}-${randomHex2}`;

    const newTokenData = {
      token: newToken,
      rol: selectedRole,
      organizacion: selectedOrganizacion,
      vota: puedeVotar,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Disponible'
    };

    setGeneratedTokenData(newTokenData);
    setCopied(false);

    setTokenList([newTokenData, ...tokenList]);
    setShowRoleModal(false);
  };

  const handleCopy = () => {
    if (!generatedTokenData) return;
    navigator.clipboard.writeText(generatedTokenData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Generador de Tokens de Acceso Primer Ingreso</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Genera pases/tokens únicos asignados a un rol, organización y permisos de votación para el registro inicial.
        </p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-base">Emisión de Token</CardTitle>
          <CardDescription className="text-xs">
            Haz clic en el botón para parametrizar el rol, organización y elegibilidad de voto para crear un nuevo token.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button onClick={handleOpenRoleModal} className="gap-2 text-xs w-full sm:w-auto">
              <Key className="h-4 w-4" /> Generar Token
            </Button>

            {generatedTokenData && (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto bg-muted p-2 rounded-md border text-xs">
                <span className="font-mono font-bold text-foreground tracking-wider">
                  {generatedTokenData.token}
                </span>
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-medium capitalize">
                  {generatedTokenData.rol}
                </span>
                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-medium">
                  {generatedTokenData.organizacion}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${generatedTokenData.vota === 'si' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                  Vota: {generatedTokenData.vota.toUpperCase()}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )}
          </div>

          {/* HISTORIAL DE TOKENS */}
          <div className="pt-4 border-t">
            <h4 className="text-xs font-semibold mb-3">Historial Reciente de Tokens Generados</h4>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-2.5">Token</th>
                    <th className="p-2.5">Rol</th>
                    <th className="p-2.5">Organización</th>
                    <th className="p-2.5">¿Vota?</th>
                    <th className="p-2.5">Fecha Generación</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tokenList.map((t, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="p-2.5 font-mono font-semibold">{t.token}</td>
                      <td className="p-2.5">
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-medium capitalize">
                          {t.rol}
                        </span>
                      </td>
                      <td className="p-2.5 font-medium text-foreground">{t.organizacion}</td>
                      <td className="p-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${t.vota === 'si' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {t.vota}
                        </span>
                      </td>
                      <td className="p-2.5 text-muted-foreground">{t.fecha}</td>
                      <td className="p-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${t.estado === 'Disponible' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                          {t.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL PARA CONFIGURAR LAS PROPIEDADES DEL TOKEN */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-sm animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-base">Configuración del Token</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowRoleModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleConfirmTokenGeneration} className="space-y-4 text-xs">
                
                {/* 1. SELECCIÓN DE ROL */}
                <div className="space-y-1.5">
                  <label className="font-semibold block text-muted-foreground">
                    Rol asignado:
                  </label>
                  <select
                    className="w-full border rounded-md p-2 bg-background text-xs focus:ring-1 focus:ring-primary"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="participante">participante</option>
                    <option value="patrocinador">patrocinador</option>
                  </select>
                </div>

                {/* 2. SELECCIÓN DE ORGANIZACIÓN */}
                <div className="space-y-1.5">
                  <label className="font-semibold block text-muted-foreground">
                    Organización:
                  </label>
                  <select
                    className="w-full border rounded-md p-2 bg-background text-xs focus:ring-1 focus:ring-primary"
                    value={selectedOrganizacion}
                    onChange={(e) => setSelectedOrganizacion(e.target.value)}
                  >
                    <option value="CUSMEX Trade Group">CUSMEX Trade Group</option>
                    <option value="Tech Global Corp">Tech Global Corp</option>
                    <option value="AgroAgro S.A.">AgroAgro S.A.</option>
                  </select>
                </div>

                {/* 3. ELEGIBLE PARA VOTAR */}
                <div className="space-y-1.5">
                  <label className="font-semibold block text-muted-foreground">
                    ¿Es elegible para votar?
                  </label>
                  <select
                    className="w-full border rounded-md p-2 bg-background text-xs focus:ring-1 focus:ring-primary"
                    value={puedeVotar}
                    onChange={(e) => setPuedeVotar(e.target.value)}
                  >
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowRoleModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-1.5">
                    <Key className="h-3.5 w-3.5" /> Generar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
// --- 3. SUBCOMPONENTE: GESTIÓN DE RECOMPOSICIÓN / OLVIDÉ CONTRASEÑA ---
function PasswordResetManager() {
  const [requestsList, setRequestsList] = useState([
    {
      id: 'req-1',
      usuario: 'elena.martinez',
      email: 'elena.m@empresa.com',
      fecha: '2026-07-28 10:15',
      estado: 'Pendiente'
    },
    {
      id: 'req-2',
      usuario: 'carlos.ruiz',
      email: 'carlos.ruiz@natp.org',
      fecha: '2026-07-27 16:40',
      estado: 'Atendido'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenResetModal = (request) => {
    setSelectedRequest(request);
    setNewPassword('');
  };

  const handleAssignPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !selectedRequest) return;

    // Actualizamos el estado de la solicitud a Atendido
    setRequestsList((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id ? { ...item, estado: 'Atendido' } : item
      )
    );

    setSuccessMessage(`Contraseña actualizada para el usuario ${selectedRequest.usuario}.`);
    setSelectedRequest(null);
    setNewPassword('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Solicitudes de Restablecimiento de Contraseña</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Bandeja de peticiones enviadas por usuarios desde la pantalla de Login. Asigna una nueva contraseña manualmente.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-md text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-base">Peticiones Recibidas</CardTitle>
          <CardDescription className="text-xs">
            Selecciona una solicitud pendiente para definir y enviar la nueva clave de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto border-t sm:border sm:rounded-md">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead className="bg-muted/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Usuario / Email</th>
                  <th className="p-3">Fecha Petición</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requestsList.length > 0 ? (
                  requestsList.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{req.usuario}</p>
                        <p className="text-[11px] text-muted-foreground">{req.email}</p>
                      </td>
                      <td className="p-3 text-muted-foreground">{req.fecha}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            req.estado === 'Pendiente'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                        >
                          {req.estado}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {req.estado === 'Pendiente' ? (
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                            onClick={() => handleOpenResetModal(req)}
                          >
                            <Key className="h-3.5 w-3.5" /> Asignar Contraseña
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">Resuelto</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-muted-foreground">
                      No hay solicitudes de contraseña pendientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL PARA ASIGNAR CONTRASEÑA */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-sm animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-base">Nueva Contraseña</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => setSelectedRequest(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleAssignPassword} className="space-y-4 text-xs">
                <div className="bg-muted p-2.5 rounded-md border text-[11px] space-y-0.5">
                  <p><span className="font-semibold">Usuario:</span> {selectedRequest.usuario}</p>
                  <p><span className="font-semibold">Correo:</span> {selectedRequest.email}</p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Escribe la contraseña a asignar *</label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      required
                      className="pl-9 text-xs"
                      placeholder="Ej. Pass2026#Cusmex"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setSelectedRequest(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-1.5">
                    <Send className="h-3.5 w-3.5" /> Guardar y Notificar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- 4. SUBCOMPONENTE: VOTACIONES ---
function VotingManager() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [votacionesList, setVotacionesList] = useState([
    {
      id: 'v1',
      titulo: 'Resolución #04: Declaración de Integración Fronteriza',
      tipo_votacion: 'Recomendación Institucional',
      es_secreta: true,
      requiere_quorum: true,
      fecha_inicio: '2026-07-27 09:00',
      fecha_fin: '2026-07-27 18:00',
      estatus: 'programada',
      opciones: ['A favor', 'En contra', 'Abstención']
    }
  ]);

  const initialVotingState = {
    titulo: '',
    descripcion: '',
    tipo_votacion: '',
    es_secreta: false,
    requiere_quorum: true,
    comite_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    estatus: 'programada',
    opcionesStr: 'A favor, En contra, Abstención'
  };

  const [newVoting, setNewVoting] = useState(initialVotingState);

  const handleCreateVoting = (e) => {
    e.preventDefault();
    if (!newVoting.titulo) return;

    const opcionesArray = newVoting.opcionesStr.split(',').map(o => o.trim()).filter(Boolean);

    setVotacionesList([
      ...votacionesList,
      {
        ...newVoting,
        id: `v-${Date.now()}`,
        opciones: opcionesArray
      }
    ]);
    setShowCreateModal(false);
    setNewVoting(initialVotingState);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Orquestador de Votaciones</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Resoluciones, enmiendas y registros de la Asamblea</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto text-xs" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" /> Crear Votación
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base">Votaciones Programadas y en Curso</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          {votacionesList.map((v) => (
            <div key={v.id} className="p-3 sm:p-4 rounded-lg border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-xs sm:text-sm">{v.titulo}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase ${v.estatus === 'activa' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-[#D80621]'}`}>
                    {v.estatus}
                  </span>
                  {v.es_secreta && (
                    <span className="bg-purple-500/10 text-purple-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                      Secreta
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Tipo: {v.tipo_votacion || 'No especificado'} • Fin: {v.fecha_fin || 'No definido'}
                </p>
                <div className="flex gap-1.5 pt-1 flex-wrap">
                  {v.opciones?.map((op, idx) => (
                    <span key={idx} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded border">
                      {op}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial">
                  <Pause className="h-3.5 w-3.5" /> Pausar
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cerrar
                </Button>
                <Button size="sm" className="gap-1 text-xs flex-1 sm:flex-initial">
                  <Download className="h-3.5 w-3.5" /> Acta
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-base">Crear Nueva Votación</CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowCreateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleCreateVoting} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Título de la Votación *</label>
                  <Input required value={newVoting.titulo} onChange={e => setNewVoting({ ...newVoting, titulo: e.target.value })}/>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Descripción</label>
                  <Input value={newVoting.descripcion} onChange={e => setNewVoting({ ...newVoting, descripcion: e.target.value })}/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Tipo de Votación *</label>
                    <Input 
                      required 
                      placeholder="Selecciona o escribe el tipo..." 
                      value={newVoting.tipo_votacion} 
                      onChange={e => setNewVoting({ ...newVoting, tipo_votacion: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">ID Comité</label>
                    <Input value={newVoting.comite_id} onChange={e => setNewVoting({ ...newVoting, comite_id: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Fecha Inicio</label>
                    <Input type="datetime-local" value={newVoting.fecha_inicio} onChange={e => setNewVoting({ ...newVoting, fecha_inicio: e.target.value })} />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Fecha Fin</label>
                    <Input type="datetime-local" value={newVoting.fecha_fin} onChange={e => setNewVoting({ ...newVoting, fecha_fin: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Opciones de Voto</label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newVoting.opcionesStr}
                    onChange={e => setNewVoting({ ...newVoting, opcionesStr: e.target.value })}
                  >
                    <option value="A favor, En contra, Abstención" className="bg-background text-foreground">
                      A favor, En contra, Abstención
                    </option>
                    <option value="A favor, En contra" className="bg-background text-foreground">
                      A favor, En contra
                    </option>
                    <option value="Sí, No" className="bg-background text-foreground">
                      Sí, No
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newVoting.es_secreta}
                      onChange={e => setNewVoting({ ...newVoting, es_secreta: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span>Votación Secreta</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newVoting.requiere_quorum}
                      onChange={e => setNewVoting({ ...newVoting, requiere_quorum: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span>Requiere Quórum</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Publicar Votación</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


// --- 5. SUBCOMPONENTE: MATCHMAKING ---
function MatchmakingManager() {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Motor de Matchmaking B2B</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Algoritmos de emparejamiento inteligente entre delegaciones, empresas y compradores.
        </p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-base">Estado del Sistema de Recomendación</CardTitle>
          <CardDescription className="text-xs">
            Configuración general de los criterios de vinculación comercial.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2">
          <p className="text-xs text-muted-foreground">
            Módulo en desarrollo. Aquí se definirán los pesos de interés, sectores comerciales e compatibilidad horaria para agendar citas automatizadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DE ADMINISTRACIÓN ---
export default function AdminDashboard() {
  return (
    <PlatformLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gestión global de usuarios, seguridad, votaciones y emparejamientos B2B.
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL DE PESTAÑAS (RESPONSIVO) */}
        <Tabs defaultValue="users" className="w-full space-y-6">
          <div className="w-full overflow-x-auto no-scrollbar pb-1">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0 w-auto">
              <TabsTrigger value="users" className="gap-2 text-xs whitespace-nowrap px-3 shrink-0">
                <Users className="h-4 w-4" />
                <span>Usuarios y Roles</span>
              </TabsTrigger>
              <TabsTrigger value="tokens" className="gap-2 text-xs whitespace-nowrap px-3 shrink-0">
                <Key className="h-4 w-4" />
                <span>Generador de Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="passwords" className="gap-2 text-xs whitespace-nowrap px-3 shrink-0">
                <Lock className="h-4 w-4" />
                <span>Olvidé Contraseña</span>
              </TabsTrigger>
              <TabsTrigger value="voting" className="gap-2 text-xs whitespace-nowrap px-3 shrink-0">
                <Vote className="h-4 w-4" />
                <span>Votaciones</span>
              </TabsTrigger>
              <TabsTrigger value="matchmaking" className="gap-2 text-xs whitespace-nowrap px-3 shrink-0">
                <Network className="h-4 w-4" />
                <span>Matchmaking</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="tokens">
            <TokenGeneratorManager />
          </TabsContent>

          <TabsContent value="passwords">
            <PasswordResetManager />
          </TabsContent>

          <TabsContent value="voting">
            <VotingManager />
          </TabsContent>

          <TabsContent value="matchmaking">
            <MatchmakingManager />
          </TabsContent>
        </Tabs>
      </div>
    </PlatformLayout>
  );
}