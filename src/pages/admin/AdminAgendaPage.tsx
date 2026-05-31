import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, CalendarCheck, Plus, Loader2, AlertCircle, X, CheckCircle } from 'lucide-react';
import { createEvent, deleteEvent, getAdminEvents, updateEvent } from '../../lib/api';
import EventAdminList from '../../components/admin/EventAdminList';

const defaultFormValues = {
  title: '',
  description: '',
  eventType: 'Culto',
  eventDate: '',
  startTime: '',
  endTime: '',
  location: '',
  responsibleName: '',
  status: 'Ativo',
  googleCalendarEventId: '',
  syncWithGoogleCalendar: false,
};

const formatDateInput = (dateValue: string) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toISOString().slice(0, 10);
};

export default function AdminAgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const loadEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAdminEvents();
      const eventsData = response.data?.data || response.data || [];
      const sortedEvents = Array.isArray(eventsData)
        ? eventsData.slice().sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        : [];
      setEvents(sortedEvents);
    } catch (err: any) {
      console.error('Erro ao carregar agenda:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Não foi possível carregar a agenda.');
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
    loadEvents();
  }, [navigate]);

  const openForm = (event?: any) => {
    if (event) {
      setEditingEventId(event._id);
      setFormValues({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        eventDate: formatDateInput(event.eventDate),
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        responsibleName: event.responsibleName,
        status: event.status,
        googleCalendarEventId: event.googleCalendarEventId || '',
        syncWithGoogleCalendar: !!event.syncWithGoogleCalendar,
      });
    } else {
      setEditingEventId(null);
      setFormValues(defaultFormValues);
    }
    setFormError('');
    setSuccessMessage('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError('');
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formValues.title.trim()) return 'O título do evento é obrigatório.';
    if (!formValues.description.trim()) return 'A descrição do evento é obrigatória.';
    if (!formValues.eventType) return 'O tipo do evento é obrigatório.';
    if (!formValues.eventDate) return 'A data do evento é obrigatória.';
    if (!formValues.startTime) return 'O horário de início é obrigatório.';
    if (!formValues.endTime) return 'O horário de término é obrigatório.';
    if (formValues.startTime >= formValues.endTime) return 'O horário de término não pode ser antes ou igual ao horário de início.';
    if (!formValues.location.trim()) return 'O local do evento é obrigatório.';
    if (!formValues.responsibleName.trim()) return 'O responsável pelo evento é obrigatório.';
    if (!formValues.status) return 'O status do evento é obrigatório.';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const formValidationMessage = validateForm();
    if (formValidationMessage) {
      setFormError(formValidationMessage);
      return;
    }

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, formValues);
        setSuccessMessage('Evento atualizado com sucesso.');
      } else {
        await createEvent(formValues);
        setSuccessMessage('Evento criado com sucesso.');
      }
      await loadEvents();
      closeForm();
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      setFormError(err?.response?.data?.message || 'Erro ao salvar o evento.');
    }
  };

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este evento?');
    if (!confirmed) return;

    try {
      await deleteEvent(eventId);
      await loadEvents();
      if (selectedEvent?._id === eventId) {
        setSelectedEvent(null);
      }
    } catch (err: any) {
      console.error('Erro ao excluir evento:', err);
      window.alert(err?.response?.data?.message || 'Falha ao excluir o evento.');
    }
  };

  const handleView = (event: any) => {
    setSelectedEvent(event);
  };

  const overviewStats = useMemo(() => ({
    total: events.length,
    active: events.filter((event) => event.status === 'Ativo').length,
    canceled: events.filter((event) => event.status === 'Cancelado').length,
    draft: events.filter((event) => event.status === 'Rascunho').length,
  }), [events]);

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
                  <CalendarCheck className="w-8 h-8 text-church-gold" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold">Agenda de <span className="text-church-gold">Eventos</span></h1>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Gerencie cultos, ensaios, reuniões e eventos especiais</p>
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
                Novo Evento
              </button>
              <button
                type="button"
                onClick={loadEvents}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-3xl uppercase tracking-[0.3em] text-[10px] text-white hover:bg-white/10 transition-all"
              >
                Recarregar Agenda
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass p-6 rounded-[2rem] border-white/10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Total de Eventos</p>
                <p className="text-3xl font-bold text-white">{overviewStats.total}</p>
              </div>
              <div className="glass p-6 rounded-[2rem] border-white/10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Ativos</p>
                <p className="text-3xl font-bold text-emerald-300">{overviewStats.active}</p>
              </div>
              <div className="glass p-6 rounded-[2rem] border-white/10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Cancelados</p>
                <p className="text-3xl font-bold text-red-300">{overviewStats.canceled}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="glass rounded-[2.5rem] border-white/10 p-12 text-center">
                <Loader2 className="mx-auto mb-6 w-12 h-12 text-church-gold animate-spin" />
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Carregando eventos...</p>
              </div>
            ) : error ? (
              <div className="glass rounded-[2.5rem] border-red-500/10 p-12 text-center">
                <AlertCircle className="mx-auto mb-6 w-12 h-12 text-red-500" />
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-300">{error}</p>
              </div>
            ) : (
              <EventAdminList
                events={events}
                onEdit={openForm}
                onDelete={handleDelete}
                onView={handleView}
                onRefresh={loadEvents}
              />
            )}
          </div>

          <aside className="space-y-6">
            <div className="glass p-6 rounded-[2rem] border-white/10">
              <h2 className="text-sm uppercase tracking-[0.3em] text-white/30 mb-4">Atenção</h2>
              <p className="text-sm text-white/70 leading-relaxed">Os eventos criados aqui já ficam disponíveis para gestão interna do painel. A sincronização com o Google Calendar será ativada em etapas futuras.</p>
            </div>

            {selectedEvent ? (
              <div className="glass p-6 rounded-[2rem] border-white/10 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">Detalhes do Evento</h3>
                  <button onClick={() => setSelectedEvent(null)} className="text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-sm text-white/80">
                  <p><span className="font-semibold">Título:</span> {selectedEvent.title}</p>
                  <p><span className="font-semibold">Tipo:</span> {selectedEvent.eventType}</p>
                  <p><span className="font-semibold">Data:</span> {formatDateInput(selectedEvent.eventDate)}</p>
                  <p><span className="font-semibold">Horário:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  <p><span className="font-semibold">Local:</span> {selectedEvent.location}</p>
                  <p><span className="font-semibold">Responsável:</span> {selectedEvent.responsibleName}</p>
                  <p><span className="font-semibold">Status:</span> {selectedEvent.status}</p>
                  <p><span className="font-semibold">Sincronizar:</span> {selectedEvent.syncWithGoogleCalendar ? 'Sim' : 'Não'}</p>
                  <p><span className="font-semibold">ID Google:</span> {selectedEvent.googleCalendarEventId || 'Não configurado'}</p>
                  <p className="whitespace-pre-line"><span className="font-semibold">Descrição:</span> {selectedEvent.description}</p>
                </div>
              </div>
            ) : (
              <div className="glass p-6 rounded-[2rem] border-white/10">
                <h3 className="text-lg font-semibold mb-3">Selecione um evento</h3>
                <p className="text-sm text-white/70">Clique em "Ver detalhes" na lista para observar a agenda, o local e a responsabilidade do evento.</p>
              </div>
            )}
          </aside>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl overflow-y-auto max-h-[90vh] glass p-8 rounded-[2rem] border-white/10"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold">{editingEventId ? 'Editar Evento' : 'Novo Evento'}</h2>
                  <p className="text-sm text-white/50">Preencha os dados do evento para cadastrar ou atualizar a agenda.</p>
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
                  Título do evento
                  <input
                    value={formValues.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Tipo do evento
                  <select
                    value={formValues.eventType}
                    onChange={(e) => handleFormChange('eventType', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  >
                    <option value="Culto">Culto</option>
                    <option value="Ensaio">Ensaio</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Aula">Aula</option>
                    <option value="Evento Especial">Evento Especial</option>
                    <option value="Outro">Outro</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Data do evento
                  <input
                    type="date"
                    value={formValues.eventDate}
                    onChange={(e) => handleFormChange('eventDate', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Horário de início
                  <input
                    type="time"
                    value={formValues.startTime}
                    onChange={(e) => handleFormChange('startTime', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Horário de término
                  <input
                    type="time"
                    value={formValues.endTime}
                    onChange={(e) => handleFormChange('endTime', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Local
                  <input
                    value={formValues.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Responsável
                  <input
                    value={formValues.responsibleName}
                    onChange={(e) => handleFormChange('responsibleName', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  />
                </label>

                <label className="flex flex-col gap-2 lg:col-span-2 text-sm text-white/80">
                  Descrição
                  <textarea
                    value={formValues.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={4}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white resize-none"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Status
                  <select
                    value={formValues.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Rascunho">Rascunho</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Sincronizar com Google Calendar
                  <select
                    value={formValues.syncWithGoogleCalendar ? 'true' : 'false'}
                    onChange={(e) => handleFormChange('syncWithGoogleCalendar', e.target.value === 'true')}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                  >
                    <option value="false">Não</option>
                    <option value="true">Sim (futuro)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-white/80 lg:col-span-2">
                  Google Calendar Event ID (opcional)
                  <input
                    value={formValues.googleCalendarEventId}
                    onChange={(e) => handleFormChange('googleCalendarEventId', e.target.value)}
                    className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
                    placeholder="ID do evento no Google Calendar"
                  />
                </label>

                <div className="lg:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-church-gold text-black rounded-3xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-amber-400 transition-all"
                  >
                    {editingEventId ? 'Salvar alterações' : 'Criar evento'}
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

        <footer className="mt-20 pt-10 border-t border-white/5 text-center text-white/20 text-[10px] uppercase tracking-[0.3em]">
          Módulo de Agenda • Igreja Atalaias Vale da Benção • Desenvolvido por XD Plans
        </footer>
      </div>
    </div>
  );
}
