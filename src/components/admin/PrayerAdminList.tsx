import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Globe, 
  ShieldCheck, 
  User, 
  Mail, 
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import PrayerResponseModal from './PrayerResponseModal';

interface PrayerAdminListProps {
  prayers: any[];
  onRefresh: () => void;
}

export default function PrayerAdminList({ prayers, onRefresh }: PrayerAdminListProps) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPrayers = prayers.filter(prayer => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pendente' && !prayer.pastorResponse) ||
      (filter === 'respondido' && prayer.pastorResponse) ||
      (filter === 'mural' && prayer.allowPublicDisplay) ||
      (filter === 'privado' && !prayer.allowPublicDisplay);
    
    const matchesSearch = 
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prayer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prayer.message || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleRespond = (prayer: any) => {
    setSelectedPrayer(prayer);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedPrayer(null);
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-hide">
          {[
            { id: 'all', label: 'Todos', icon: Filter },
            { id: 'pendente', label: 'Pendentes', icon: Clock },
            { id: 'respondido', label: 'Respondidos', icon: CheckCircle },
            { id: 'mural', label: 'Autorizados Mural', icon: Globe },
            { id: 'privado', label: 'Privados', icon: ShieldCheck },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest whitespace-nowrap transition-all border ${
                filter === item.id 
                  ? 'bg-church-gold border-church-gold text-white' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pedidos..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-church-gold/30 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-24 glass rounded-[2.5rem] border-white/5 bg-white/2">
            <p className="text-white/20 uppercase tracking-[0.2em] text-[10px] font-bold">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredPrayers.map((prayer) => (
            <motion.div 
              key={prayer._id || prayer.id || Math.random().toString()}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {prayer.pastorResponse ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[9px] uppercase font-bold tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Respondido
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[9px] uppercase font-bold tracking-widest">
                        <Clock className="w-3 h-3" /> Pendente
                      </span>
                    )}
                    {prayer.allowPublicDisplay && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-church-gold/10 border border-church-gold/20 rounded-full text-church-gold text-[9px] uppercase font-bold tracking-widest">
                        <Globe className="w-3 h-3" /> Mural Público
                      </span>
                    )}
                    {prayer.isAnonymous && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 text-[9px] uppercase font-bold tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Anônimo
                      </span>
                    )}
                    <span className="text-[9px] uppercase font-bold tracking-widest text-white/20 ml-auto">
                      {new Date(prayer.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-church-gold transition-colors">{prayer.title}</h3>
                    <p className="text-white/60 leading-relaxed font-light italic">"{prayer.message}"</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Solicitante</p>
                        <p className="text-[10px] text-white/60 font-bold">{prayer.name || 'Anônimo'}</p>
                      </div>
                    </div>
                    {prayer.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">E-mail</p>
                          <p className="text-[10px] text-white/60 font-bold">{prayer.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-72 space-y-4">
                  {prayer.pastorResponse ? (
                    <div className="h-full bg-white/2 border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-church-gold mb-4">Resposta Pastoral</p>
                        <p className="text-xs text-white/40 leading-relaxed italic line-clamp-4">"{prayer.pastorResponse}"</p>
                      </div>
                      <button 
                        onClick={() => handleRespond(prayer)}
                        className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white/40 text-[9px] uppercase font-bold tracking-widest rounded-xl transition-all"
                      >
                        Editar Resposta
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleRespond(prayer)}
                      className="w-full h-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-church-gold/20 rounded-3xl hover:bg-church-gold/5 group transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-church-gold" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-church-gold">Responder</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {selectedPrayer && (
        <PrayerResponseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          prayer={selectedPrayer}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
