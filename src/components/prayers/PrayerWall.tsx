import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getPrayerWall } from '../../lib/api';
import PrayerCard from './PrayerCard';
import { MessageSquare, Loader2 } from 'lucide-react';

export default function PrayerWall() {
  const [prayers, setPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWall() {
      try {
        const response = await getPrayerWall();
        setPrayers(response.data || []);
      } catch (err) {
        console.error('Error loading prayer wall:', err);
        setError('Não foi possível carregar os pedidos do mural.');
      } finally {
        setIsLoading(false);
      }
    }
    loadWall();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <Loader2 className="w-12 h-12 text-church-gold animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Carregando Mural de Fé...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 px-6 border-2 border-dashed border-white/5 rounded-[3rem]">
        <p className="text-red-500/60 text-sm font-bold uppercase tracking-widest leading-relaxed">
          {error}
        </p>
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <div className="text-center py-24 px-6 border-2 border-dashed border-white/5 rounded-[3rem] space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
          <MessageSquare className="w-8 h-8" />
        </div>
        <p className="text-white/40 text-sm italic">
          Ainda não há pedidos publicados no mural. Seja o primeiro a compartilhar sua fé.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {prayers.map((prayer: any) => (
        <PrayerCard key={prayer._id} prayer={prayer} />
      ))}
    </div>
  );
}
