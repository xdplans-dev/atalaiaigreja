import React, { useEffect, useState } from 'react';
import { getPublicEvents } from '../lib/api';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await getPublicEvents();
        const data = res.data?.data || res.data || [];
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar eventos públicos:', err);
        setError('Falha ao carregar a agenda.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-church-black text-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8 flex items-center gap-4">
          <h1 className="text-3xl font-serif font-bold">Agenda Pública</h1>
          <span className="text-sm text-white/40">Próximos cultos e eventos</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">Carregando eventos...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-400">{error}</div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-white/40">Nenhum evento público encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div key={ev._id} className="glass p-6 rounded-2xl border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-church-gold/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-church-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="text-sm text-white/70 mt-1 whitespace-pre-line">{ev.description}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {formatDate(ev.eventDate)} • {ev.startTime} - {ev.endTime}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ev.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/admin/agenda" className="px-6 py-3 bg-white/5 border border-white/10 rounded-3xl">Ver painel administrativo</Link>
        </div>
      </div>
    </div>
  );
}
