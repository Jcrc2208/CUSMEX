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
  Check
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

  // Estados de Filtro Avanzado
  const [statusFilter, setStatusFilter] = useState('todos');
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
      estatus_membresia: 'inactivo',
      es_elegible_para_votar: false,
      rol_nombre: 'Observador',
      organizacion_nombre: 'Tech Trade Global'
    }
  ]);

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

  const filteredUsers = usersList.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      user.nombre.toLowerCase().includes(query) ||
      user.apellido.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.pais.toLowerCase().includes(query) ||
      user.organizacion_nombre.toLowerCase().includes(query)
    );

    const matchesStatus = statusFilter === 'todos' || user.estatus_membresia === statusFilter;
    const matchesVote =
      voteFilter === 'todos' ||
      (voteFilter === 'elegibles' && user.es_elegible_para_votar) ||
      (voteFilter === 'no_elegibles' && !user.es_elegible_para_votar);

    return matchesSearch && matchesStatus && matchesVote;
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
                        <p className="text-[11px] text-muted-foreground">{u.pais}</p>
                      </td>
                      <td className="p-3 space-y-1">
                        <span className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-medium">
                          {u.rol_nombre}
                        </span>
                        <div>
                          <span className={`text-[10px] uppercase font-bold ${u.estatus_membresia === 'activo' ? 'text-emerald-600' : 'text-amber-600'}`}>
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
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
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

// --- 2. SUBCOMPONENTE: VOTACIONES ---
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
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase ${v.estatus === 'activa' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
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

// --- 3. SUBCOMPONENTE: MATCHMAKING Y MÉTRICAS DE PARTICIPACIÓN ---
function MatchmakingManager() {
  const [searchQuery, setSearchQuery] = useState('');

  // Datos simulados del resumen ejecutivo de actividad por usuario
  const [userMetrics] = useState([
    {
      id: 'm1',
      nombre: 'Elena Martínez',
      organizacion: 'Secretaría de Economía',
      votosEmitidos: 14,
      matchesHechos: 28,
      matchesCancelados: 2,
      matchesPospuestos: 5,
      conexionesTotales: 21,
      nivelActividad: 'Alta'
    },
    {
      id: 'm2',
      nombre: 'Carlos Ruiz',
      organizacion: 'CUSMEX',
      votosEmitidos: 9,
      matchesHechos: 45,
      matchesCancelados: 1,
      matchesPospuestos: 3,
      conexionesTotales: 41,
      nivelActividad: 'Alta'
    },
    {
      id: 'm3',
      nombre: 'Sofía Gómez',
      organizacion: 'Tech Trade Global',
      votosEmitidos: 2,
      matchesHechos: 8,
      matchesCancelados: 4,
      matchesPospuestos: 6,
      conexionesTotales: 4,
      nivelActividad: 'Baja'
    }
  ]);

  const filteredMetrics = userMetrics.filter(user =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.organizacion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Resumen Ejecutivo de Participación y Matchmaking</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Métricas consolidadas sobre el nivel de interacción, votaciones y networking de los usuarios.
        </p>
      </div>

      {/* TARJETAS RESUMEN DE MÉTRICAS GLOBALES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Total Matches Realizados</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-emerald-600">81</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Conexiones Exitosas</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-blue-600">66</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Matches Pospuestos</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-amber-600">14</p>
        </Card>
        <Card className="p-3 sm:p-4">
          <p className="text-[11px] font-medium text-muted-foreground">Matches Cancelados</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-rose-600">7</p>
        </Card>
      </div>

      {/* TABLA DE USUARIOS MÁS ACTIVOS Y MÉTRICAS DETALLADAS */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Métricas por Usuario</CardTitle>
            <CardDescription className="text-xs">
              Detalle de votaciones, matches y nivel de interacción en la plataforma CUSMEX.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar usuario u organización..."
              className="pl-8 text-xs h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto border-t sm:border sm:rounded-md">
            <table className="w-full text-xs text-left min-w-[700px]">
              <thead className="bg-muted/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Usuario / Organización</th>
                  <th className="p-3 text-center">Votos Emitidos</th>
                  <th className="p-3 text-center">Matches Realizados</th>
                  <th className="p-3 text-center">Pospuestos</th>
                  <th className="p-3 text-center">Cancelados</th>
                  <th className="p-3 text-center">Conexiones</th>
                  <th className="p-3 text-right">Estatus Actividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMetrics.length > 0 ? (
                  filteredMetrics.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{item.nombre}</p>
                        <p className="text-[11px] text-muted-foreground">{item.organizacion}</p>
                      </td>
                      <td className="p-3 text-center font-medium">
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[11px]">
                          {item.votosEmitidos}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold text-emerald-600">
                        {item.matchesHechos}
                      </td>
                      <td className="p-3 text-center font-medium text-amber-600">
                        {item.matchesPospuestos}
                      </td>
                      <td className="p-3 text-center font-medium text-rose-600">
                        {item.matchesCancelados}
                      </td>
                      <td className="p-3 text-center font-semibold text-foreground">
                        {item.conexionesTotales}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.nivelActividad === 'Alta' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.nivelActividad === 'Alta' ? '★ Muy Activo' : 'Regular'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-6 text-muted-foreground">
                      No se encontraron registros coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 4. COMPONENTE PRINCIPAL (EXPORT DEFAULT) ---
export default function AdminPage({
  language = 'es',
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
}) {
  return (
    <PlatformLayout
      activeModuleId="admin"
      language={language}
      onLanguageChange={onLanguageChange}
      isDarkMode={isDarkMode}
      onToggleTheme={onToggleTheme}
      badgeIcon={ShieldAlert}
      badgeLabel="Admin"
    >
      <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* ENCABEZADO LIMPIO */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Panel de Control General</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Administración centralizada de usuarios, votaciones institucionales y estadísticas del sistema CUSMEX.
          </p>
        </div>

        {/* TABS RESPONSIVAS */}
        <Tabs defaultValue="usuarios" className="w-full">
          <div className="overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="usuarios" className="gap-1.5 text-xs sm:text-sm">
                <Users className="h-4 w-4" /> Usuarios y Roles
              </TabsTrigger>
              <TabsTrigger value="votaciones" className="gap-1.5 text-xs sm:text-sm">
                <Vote className="h-4 w-4" /> Votaciones
              </TabsTrigger>
              <TabsTrigger value="matchmaking" className="gap-1.5 text-xs sm:text-sm">
                <Network className="h-4 w-4" /> Matchmaking
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="usuarios">
            <UsersManager />
          </TabsContent>

          <TabsContent value="votaciones">
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