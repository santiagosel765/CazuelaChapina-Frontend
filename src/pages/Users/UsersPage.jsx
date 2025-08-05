import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  KeyIcon,
  PlusIcon,
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import {
  listUsers,
  createUser,
  updateUser,
  changeUserStatus,
  assignUserRole,
} from '../../services/userService';
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
} from '../../services/roleService';
import {
  listModules,
  createModule,
  updateModule,
  deleteModule,
} from '../../services/moduleService';
import CatalogManager from '../../components/CatalogManager';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table, { TableHeader, TableRow } from '../../components/ui/Table';

const Toggle = ({ checked, onChange, sr }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
    {sr && <span className="sr-only">{sr}</span>}
  </label>
);

const UsersPage = () => {
  const [tab, setTab] = useState('users');

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios, Roles y Permisos</h1>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Button
            onClick={() => setTab('users')}
            icon={UserGroupIcon}
            className={`${
              tab === 'users'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Usuarios
          </Button>
          <Button
            onClick={() => setTab('roles')}
            icon={ShieldCheckIcon}
            className={`${
              tab === 'roles'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Roles
          </Button>
          <Button
            onClick={() => setTab('modules')}
            icon={Squares2X2Icon}
            className={`${
              tab === 'modules'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Módulos
          </Button>
          <Button
            onClick={() => setTab('permissions')}
            icon={KeyIcon}
            className={`${
              tab === 'permissions'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Permisos por Rol
          </Button>
        </div>
        {tab === 'users' && <UsersSection />}
        {tab === 'roles' && <RolesSection />}
        {tab === 'modules' && <ModulesSection />}
        {tab === 'permissions' && <PermissionsSection />}
      </div>
  );
};

const UsersSection = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState({ name: '', role: '', status: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    status: 'Active',
    roleId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [roleModal, setRoleModal] = useState(null);
  const [roleId, setRoleId] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [status, setStatus] = useState('Active');
  const { hasPermission } = useAuth();

  const fetchUsers = async () => {
    const data = await listUsers();
    setUsers(Array.isArray(data) ? data : data?.data || []);
  };

  const fetchRoles = async () => {
    const data = await listRoles();
    setRoles(Array.isArray(data) ? data : data?.data || []);
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const openForm = (user = null) => {
    setEditing(user);
    if (user) {
      setForm({
        fullName: user.fullName || '',
        username: user.username || '',
        password: '',
        email: user.email || '',
        phone: user.phone || '',
        status: user.status || 'Active',
        roleId: user.roleId || '',
      });
    } else {
      setForm({
        fullName: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        status: 'Active',
        roleId: '',
      });
    }
    setShowPassword(false);
    setFormOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = { ...form };
    if (editing) {
      if (!data.password) delete data.password;
      await updateUser(editing.id, data);
    } else {
      await createUser(data);
    }
    setFormOpen(false);
    fetchUsers();
  };

  const openRole = (user) => {
    setRoleModal(user);
    setRoleId(user.roleId || '');
  };

  const submitRole = async (e) => {
    e.preventDefault();
    await assignUserRole(roleModal.id, roleId);
    setRoleModal(null);
    fetchUsers();
  };

  const openStatus = (user) => {
    setStatusModal(user);
    setStatus(user.status || 'Active');
  };

  const submitStatus = async (e) => {
    e.preventDefault();
    await changeUserStatus(statusModal.id, status);
    setStatusModal(null);
    fetchUsers();
  };

  const filtered = users.filter((u) =>
    (!filters.role || u.roleId === filters.role) &&
    (!filters.status || String(u.status) === filters.status) &&
    (!filters.name || (u.fullName || '').toLowerCase().includes(filters.name.toLowerCase()))
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4 items-start w-full">
        <Input
          placeholder="Nombre"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-full"
        />
        <Select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="w-full"
        >
          <option value="">Rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full"
        >
          <option value="">Estado</option>
          <option value="Active">Activo</option>
          <option value="Inactive">Inactivo</option>
        </Select>
        {hasPermission('Users.create') && (
          <Button
            onClick={() => openForm()}
            icon={PlusIcon}
            className="w-full sm:w-auto sm:ml-auto bg-blue-600 text-white hover:bg-blue-700"
          >
            Nuevo
          </Button>
        )}
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <Table>
          <TableHeader>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </TableHeader>
          <tbody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">{u.status}</td>
                <td className="px-4 py-2">
                  {roles.find((r) => r.id === u.roleId)?.name || ''}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {hasPermission('Users.update') && (
                    <IconButton
                      icon={PencilSquareIcon}
                      label="Editar"
                      className="text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
                      onClick={() => openForm(u)}
                    />
                  )}
                  {hasPermission('Users.update') && (
                    <IconButton
                      icon={KeyIcon}
                      label="Rol"
                      className="text-green-600 hover:bg-green-50 focus:ring-green-500"
                      onClick={() => openRole(u)}
                    />
                  )}
                  {hasPermission('Users.update') && (
                    <IconButton
                      icon={ShieldCheckIcon}
                      label="Estado"
                      className="text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500"
                      onClick={() => openStatus(u)}
                    />
                  )}
                </td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editing ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <form onSubmit={submitForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Nombre"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <Input
                placeholder="Usuario"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <div className="relative w-full">
                <Input
                  placeholder="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </Select>
              <Select
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
              >
                <option value="">Rol</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
              <div className="col-span-full flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={XMarkIcon}
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" icon={CheckIcon}>
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {roleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Asignar Rol</h2>
            <form onSubmit={submitRole} className="grid grid-cols-1 gap-4">
              <Select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
              >
                <option value="">Seleccione</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={XMarkIcon}
                  onClick={() => setRoleModal(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" icon={CheckIcon}>
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {statusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Cambiar Estado</h2>
            <form onSubmit={submitStatus} className="grid grid-cols-1 gap-4">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Active">Activo</option>
                <option value="Inactive">Inactivo</option>
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={XMarkIcon}
                  onClick={() => setStatusModal(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" icon={CheckIcon}>
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RolesSection = () => {
  const service = {
    list: listRoles,
    create: createRole,
    update: updateRole,
    remove: deleteRole,
  };
  return (
    <CatalogManager
      title="Roles"
      columns={[
        { field: 'name', headerName: 'Nombre' },
        { field: 'description', headerName: 'Descripción' },
        { field: 'isActive', headerName: 'Activo' },
      ]}
      fields={[
        { name: 'name', label: 'Nombre', required: true },
        { name: 'description', label: 'Descripción' },
      ]}
      service={service}
    />
  );
};

const ModulesSection = () => {
  const service = {
    list: listModules,
    create: createModule,
    update: updateModule,
    remove: deleteModule,
  };
  return (
    <CatalogManager
      title="Módulos"
      columns={[{ field: 'name', headerName: 'Nombre' }]}
      fields={[{ name: 'name', label: 'Nombre', required: true }]}
      service={service}
    />
  );
};

const PermissionsSection = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const r = await listRoles();
      setRoles(Array.isArray(r) ? r : r?.data || []);
      const m = await listModules();
      setModules(Array.isArray(m) ? m : m?.data || []);
    };
    load();
  }, []);

  useEffect(() => {
    const loadPerms = async () => {
      if (!selectedRole) {
        setPermissions([]);
        return;
      }
      const data = await getRolePermissions(selectedRole);
      const existing = Array.isArray(data) ? data : [];
      const mapped = modules.map((mod) => {
        const found = existing.find((p) => p.moduleId === mod.id) || {};
        return {
          moduleId: mod.id,
          canView: !!found.canView,
          canCreate: !!found.canCreate,
          canUpdate: !!found.canUpdate,
          canDelete: !!found.canDelete,
        };
      });
      setPermissions(mapped);
    };
    loadPerms();
  }, [selectedRole, modules]);

  const toggle = (moduleId, field) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.moduleId === moduleId ? { ...p, [field]: !p[field] } : p
      )
    );
  };

  const save = async () => {
    await updateRolePermissions(selectedRole, {
      roleId: selectedRole,
      permissions,
    });
    Swal.fire({
      icon: 'success',
      title: 'Permisos actualizados',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <select
          className="border px-2 py-1"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Seleccione rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
          {selectedRole && (
            <Button
              onClick={save}
              icon={CheckIcon}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </Button>
          )}
      </div>
        {selectedRole && (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Módulo</th>
                  <th className="px-4 py-2">Ver</th>
                  <th className="px-4 py-2">Crear</th>
                  <th className="px-4 py-2">Actualizar</th>
                  <th className="px-4 py-2">Eliminar</th>
                </tr>
              </TableHeader>
              <tbody>
                {permissions.map((p) => {
                  const mod = modules.find((m) => m.id === p.moduleId);
                  return (
                    <TableRow key={p.moduleId}>
                      <td className="px-4 py-2">{p.moduleId}</td>
                      <td className="px-4 py-2">{mod?.name}</td>
                      <td className="px-4 py-2 text-center">
                        <Toggle
                          checked={p.canView}
                          onChange={() => toggle(p.moduleId, 'canView')}
                          sr="Ver"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Toggle
                          checked={p.canCreate}
                          onChange={() => toggle(p.moduleId, 'canCreate')}
                          sr="Crear"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Toggle
                          checked={p.canUpdate}
                          onChange={() => toggle(p.moduleId, 'canUpdate')}
                          sr="Actualizar"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Toggle
                          checked={p.canDelete}
                          onChange={() => toggle(p.moduleId, 'canDelete')}
                          sr="Eliminar"
                        />
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
    </div>
  );
};

export default UsersPage;
