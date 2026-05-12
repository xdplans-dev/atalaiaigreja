import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Quote, Calendar, User } from 'lucide-react';

interface PrayerCardProps {
  prayer: {
    title: string;
    message: string;
    pastorResponse?: string;
    createdAt: string;
    name?: string;
    isAnonymous: boolean;
  };
}

export default function PrayerCard({ prayer }: PrayerCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-church-gold/20 transition-all duration-500"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-12 h-12 text-church-gold" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-church-gold/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-church-gold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-church-gold transition-colors">{prayer.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/30">
                  <User className="w-3 h-3" />
                  {prayer.isAnonymous ? 'Anônimo' : (prayer.name || 'Anônimo')}
                </span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/30">
                  <Calendar className="w-3 h-3" />
                  {new Date(prayer.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 italic text-white/60 font-light leading-relaxed">
          "{prayer.message}"
        </div>

        {prayer.pastorResponse && (
          <div className="space-y-3 pl-4 border-l-2 border-church-gold/30">
            <p className="text-[10px] uppercase font-bold tracking-widest text-church-gold">Resposta Pastoral</p>
            <p className="text-sm text-white/80 leading-relaxed font-light">
              {prayer.pastorResponse}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
