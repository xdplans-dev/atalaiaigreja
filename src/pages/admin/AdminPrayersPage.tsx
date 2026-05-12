import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Loader2, 
  AlertCircle, 
  LayoutDashboard,
  RefreshCw
} from 'lucide-react';
import { getAdminPrayers } from '../../lib/api';
import PrayerAdminList from '../../components/admin/PrayerAdminList';

export default function AdminPrayersPage() {
  const [prayers, setPrayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadPrayers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAdminPrayers();
      setPrayers(response.data || []);
    } catch (err: any) {
      console.error('Error loading admin prayers:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Não foi possível carregar os pedidos de oração.');
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
    loadPrayers();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-church-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Painel Admin
              </Link>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-church-gold/10 border border-church-gold/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-church-gold" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold">Pedidos de <span className="text-church-gold">Oração</span></h1>
                  <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Centro de Gestão e Intercessão</p>
                </div>
              </div>
            </div>

            <button 
              onClick={loadPrayers}
              disabled={isLoading}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 glass rounded-[3rem] border-white/5">
            <Loader2 className="w-12 h-12 text-church-gold animate-spin" />
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Processando Pedidos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 glass rounded-[3rem] border-red-500/10 space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-red-500/60 text-sm font-bold uppercase tracking-widest leading-relaxed">
              {error}
            </p>
            <button 
              onClick={loadPrayers}
              className="px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <PrayerAdminList prayers={prayers} onRefresh={loadPrayers} />
        )}

        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/10 leading-relaxed">
            Módulo Administrativo • Igreja Atalaias Vale da Benção<br />
            <span className="text-white/5 font-light tracking-widest mt-2 block">Desenvolvido por XD Plans</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
