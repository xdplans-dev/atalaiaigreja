import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle,
  Edit3,
  LayoutDashboard,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import {
  createAdminUser,
  getAdminUsers,
  toggleAdminUserStatus,
  updateAdminUser,
} from '../../lib/api';

const roles = [
  { value: 'aluno', label: 'Aluno' },
  { value: 'membro', label: 'Membro' },
  { value: 'agente', label: 'Agente' },
  { value: 'administrador', label: 'Administrador' },
];

const legacyRoleLabels: Record<string, string> = {
  admin: 'Administrador',
  pastor: 'Agente',
  lider: 'Agente',
};

const defaultFormValues = {
  name: '',
  email: '',
  password: '',
  role: 'membro',
  isActive: true,
};

const getRoleLabel = (role: string) => roles.find((item) => item.value === role)?.label || legacyRoleLabels[role] || role;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAdminUsers();
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err: any) {
      console.error('Erro ao carregar usuarios:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err?.response?.data?.message || 'Nao foi possivel carregar os usuarios.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('atalaias_token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadUsers();
  }, [navigate]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.isActive !== false).length,
    admins: users.filter((user) => ['administrador', 'admin'].includes(user.role)).length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedRole = legacyRoleLabels[user.role]?.toLowerCase() || user.role;
      const matchesRole = roleFilter === 'todos' || normalizedRole === roleFilter || user.role === roleFilter;
      const matchesStatus = statusFilter === 'todos'
        || (statusFilter === 'ativos' && user.isActive !== false)
        || (statusFilter === 'inativos' && user.isActive === false);
      const text = `${user.name} ${user.email}`.toLowerCase();
      return matchesRole && matchesStatus && text.includes(searchTerm.toLowerCase());
    });
  }, [users, roleFilter, statusFilter, searchTerm]);

  const openForm = (user?: any) => {
    setFormError('');
    setSuccessMessage('');
    if (user) {
      setEditingUserId(user._id);
      setFormValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: ['admin'].includes(user.role) ? 'administrador' : ['pastor', 'lider'].includes(user.role) ? 'agente' : user.role || 'membro',
        isActive: user.isActive !== false,
      });
    } else {
      setEditingUserId(null);
      setFormValues(defaultFormValues);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError('');
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formValues.name.trim()) return 'Informe o nome do usuario.';
    if (!formValues.email.trim()) return 'Informe o e-mail do usuario.';
    if (!editingUserId && formValues.password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    if (editingUserId && formValues.password && formValues.password.length < 6) return 'A nova senha deve ter pelo menos 6 caracteres.';
    if (!roles.some((role) => role.value === formValues.role)) return 'Selecione um perfil valido.';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload: any = {
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      isActive: formValues.isActive,
    };
    if (formValues.password) payload.password = formValues.password;

    try {
      if (editingUserId) {
        await updateAdminUser(editingUserId, payload);
        setSuccessMessage('Usuario atualizado com sucesso.');
      } else {
        await createAdminUser(payload);
        setSuccessMessage('Usuario criado com sucesso.');
      }
      await loadUsers();
      closeForm();
    } catch (err: any) {
      console.error('Erro ao salvar usuario:', err);
      setFormError(err?.response?.data?.message || 'Erro ao salvar o usuario.');
    }
  };

  const handleToggleStatus = async (user: any) => {
    const action = user.isActive === false ? 'ativar' : 'desativar';
    const confirmed = window.confirm(`Tem certeza que deseja ${action} este usuario?`);
    if (!confirmed) return;

    try {
      await toggleAdminUserStatus(user._id);
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao alterar status do usuario:', err);
      window.alert(err?.response?.data?.message || 'Falha ao alterar o status do usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-church-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Painel Admin
              </Link>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-church-gold/10 border border-church-gold/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-church-gold" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold">Gestao de <span className="text-church-gold">Usuarios</span></h1>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Alunos, membros, agentes e administradores</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button
                type="button"
                onClick={() => openForm()}
                className="inline-flex items-center gap-2 px-6 py-4 bg-church-gold text-black rounded-3xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-amber-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                Novo Usuario
              </button>
              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-3xl uppercase tracking-[0.3em] text-[10px] text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Recarregar
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass p-6 rounded-[2rem] border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Usuarios</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="glass p-6 rounded-[2rem] border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Ativos</p>
            <p className="text-3xl font-bold text-emerald-300">{stats.active}</p>
          </div>
          <div className="glass p-6 rounded-[2rem] border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Administradores</p>
            <p className="text-3xl font-bold text-church-gold">{stats.admins}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 md:col-span-2">
              Buscar usuario
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Nome ou e-mail..."
                  className="w-full bg-black/70 border border-white/10 rounded-3xl px-12 py-3 text-sm text-white placeholder:text-white/30"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              Role
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
              >
                <option value="todos">Todos</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
              >
                <option value="todos">Todos</option>
                <option value="ativos">Ativos</option>
                <option value="inativos">Inativos</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="glass rounded-[2.5rem] border-white/10 p-12 text-center">
            <Loader2 className="mx-auto mb-6 w-12 h-12 text-church-gold animate-spin" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Carregando usuarios...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-[2.5rem] border-red-500/10 p-12 text-center">
            <AlertCircle className="mx-auto mb-6 w-12 h-12 text-red-500" />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-300">{error}</p>
          </div>
        ) : (
          <div className="glass overflow-hidden rounded-[2rem] border-white/10">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] uppercase tracking-[0.3em] text-white/50">
                    <th className="px-5 py-4">Usuario</th>
                    <th className="px-5 py-4">E-mail</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-white/40">
                        Nenhum usuario encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="bg-white/5 border-t border-white/5">
                        <td className="px-5 py-4 align-top text-sm font-semibold text-white">{user.name}</td>
                        <td className="px-5 py-4 align-top text-sm text-white/70">{user.email}</td>
                        <td className="px-5 py-4 align-top text-sm text-white/70">{getRoleLabel(user.role)}</td>
                        <td className="px-5 py-4 align-top text-sm">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-[0.2em] ${
                            user.isActive !== false
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-red-500/10 text-red-300'
                          }`}>
                            {user.isActive !== false ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top text-sm text-white/70 space-x-2">
                          <button
                            type="button"
                            onClick={() => openForm(user)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                            title="Editar usuario"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl border ${
                              user.isActive !== false
                                ? 'bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                            }`}
                            title={user.isActive !== false ? 'Desativar usuario' : 'Ativar usuario'}
                          >
                            {user.isActive !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl overflow-y-auto max-h-[90vh] glass p-8 rounded-[2rem] border-white/10"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold">{editingUserId ? 'Editar Usuario' : 'Novo Usuario'}</h2>
                  <p className="text-sm text-white/50">Defina dados de acesso e perfil do usuario.</p>
                </div>
                <button type="button" onClick={closeForm} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
                  {formError}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-100">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-300" />{successMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Nome
                  <input
                    value={formValues.name}
                    onChange={(event) => handleFormChange('name', event.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  E-mail
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(event) => handleFormChange('email', event.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Role
                  <select
                    value={formValues.role}
                    onChange={(event) => handleFormChange('role', event.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Status
                  <select
                    value={formValues.isActive ? 'true' : 'false'}
                    onChange={(event) => handleFormChange('isActive', event.target.value === 'true')}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80 lg:col-span-2">
                  {editingUserId ? 'Nova senha (opcional)' : 'Senha'}
                  <input
                    type="password"
                    value={formValues.password}
                    onChange={(event) => handleFormChange('password', event.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <div className="lg:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-church-gold text-black rounded-3xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-amber-400 transition-all"
                  >
                    {editingUserId ? 'Salvar alteracoes' : 'Criar usuario'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-3xl uppercase tracking-[0.3em] text-[10px] text-white hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
