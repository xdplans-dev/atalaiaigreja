import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Eye, Edit3, Trash2, Search } from 'lucide-react';

const eventTypes = ['Todos', 'Culto', 'Ensaio', 'Reunião', 'Aula', 'Evento Especial', 'Outro'];
const statuses = ['Todos', 'Ativo', 'Cancelado', 'Rascunho'];

interface EventAdminListProps {
  events: any[];
  onEdit: (event: any) => void;
  onDelete: (id: string) => void;
  onView: (event: any) => void;
  onRefresh: () => void;
}

export default function EventAdminList({ events, onEdit, onDelete, onView, onRefresh }: EventAdminListProps) {
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return events
      .slice()
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .filter((event) => {
        const matchesType = filterType === 'Todos' || event.eventType === filterType;
        const matchesStatus = filterStatus === 'Todos' || event.status === filterStatus;
        const text = `${event.title} ${event.responsibleName}`.toLowerCase();
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
      });
  }, [events, filterType, filterStatus, searchTerm]);

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-[2rem] border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              Tipo de evento
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
              Status
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black/70 border border-white/10 rounded-3xl px-4 py-3 text-sm text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 col-span-full xl:col-span-2">
              Buscar por título ou responsável
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite um termo..."
                  className="w-full bg-black/70 border border-white/10 rounded-3xl px-12 py-3 text-sm text-white placeholder:text-white/30"
                />
              </div>
            </label>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-3xl text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
            Recarregar
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-[2rem] border-white/10">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.3em] text-white/50">
                <th className="px-5 py-4">Título</th>
                <th className="px-5 py-4">Tipo</th>
                <th className="px-5 py-4">Data</th>
                <th className="px-5 py-4">Início</th>
                <th className="px-5 py-4">Término</th>
                <th className="px-5 py-4">Local</th>
                <th className="px-5 py-4">Responsável</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-white/40">
                    Nenhum evento encontrado para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event._id}
                    className={`${event.status === 'Cancelado' ? 'bg-red-500/10' : 'bg-white/5'} border-t border-white/5`}
                  >
                    <td className="px-5 py-4 align-top text-sm font-semibold text-white">{event.title}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{event.eventType}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{formatDate(event.eventDate)}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{event.startTime}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{event.endTime}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{event.location}</td>
                    <td className="px-5 py-4 align-top text-sm text-white/70">{event.responsibleName}</td>
                    <td className="px-5 py-4 align-top text-sm">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-[0.2em] ${
                        event.status === 'Ativo'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : event.status === 'Cancelado'
                          ? 'bg-red-500/10 text-red-300'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-white/70 space-x-2">
                      <button
                        type="button"
                        onClick={() => onView(event)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                        title="Editar evento"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(event._id)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20"
                        title="Excluir evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
