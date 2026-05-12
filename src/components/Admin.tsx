import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, MessageSquare, LogOut, LayoutDashboard, Settings, 
  ChevronRight, Cross, Search, CheckCircle, Clock, AlertCircle,
  Radio, HandCoins, BookOpen, HardHat
} from 'lucide-react';
import api from '../lib/api';
import { cn } from '../lib/utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('atalaias_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        // The API returns { success: true, data: { user: ... } } or similar
        const userData = response.data?.data?.user || response.data?.user || response.data?.data;
        setUser(userData);
        setIsLoading(false);
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('atalaias_token');
        localStorage.removeItem('atalaias_user');
        navigate('/login?session=expired');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('atalaias_token');
    localStorage.removeItem('atalaias_user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prayers', label: 'Pedidos de Oração', icon: MessageSquare },
    { id: 'events', label: 'Eventos & Cultos', icon: Calendar },
    { id: 'members', label: 'Membros', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const placeholderCards = [
    { label: 'Pedidos de Oração', icon: MessageSquare },
    { label: 'Agenda de Cultos', icon: Calendar },
    { label: 'Ministérios', icon: Users },
    { label: 'Membros', icon: Users },
    { label: 'Trilhas de Discipulado', icon: BookOpen },
    { label: 'Transmissões ao vivo', icon: Radio },
    { label: 'Contribuições', icon: HandCoins },
    { label: 'Configurações', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-church-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-church-gold/20 border-t-church-gold rounded-full animate-spin" />
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">Verificando Credenciais...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-church-black flex text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start transition-all duration-300">
        <div className="p-6 lg:px-10 lg:py-8 w-full border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-church-gold flex items-center justify-center transform rotate-45 shrink-0">
              <Cross className="w-5 h-5 text-church-gold -rotate-45" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-bold uppercase tracking-widest">Painel</span>
              <span className="text-church-gold text-[10px] font-bold uppercase">Atalaias</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 w-full px-4 space-y-2 mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all duration-300 group",
                activeTab === item.id 
                  ? "bg-church-gold text-white shadow-lg shadow-church-gold/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-church-gold/60 group-hover:text-church-gold")} />
              <span className="hidden lg:block font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 w-full space-y-4">
          <div className="hidden lg:block p-4 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[9px] uppercase font-bold tracking-widest text-white/30 mb-2">Usuário Ativo</p>
            <p className="text-xs font-bold text-white truncate">{user?.name || user?.email || 'Administrador'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-2xl group"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block font-medium text-sm">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-church-black relative flex flex-col">
        <div className="ambient-glow top-[5%] right-[5%] w-[600px] h-[600px] bg-church-gold opacity-[0.03]" />
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-church-black/80 backdrop-blur-xl border-b border-white/5 px-8 lg:px-10 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              Painel Administrativo
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">
              Gerencie as informações da igreja
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500/60 uppercase">Sessão Ativa</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-church-gold/20 border border-church-gold/30 flex items-center justify-center">
              <span className="text-xs font-bold text-church-gold">{user?.name ? user.name.substring(0,2).toUpperCase() : 'AD'}</span>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Construction Alert */}
              <div className="glass p-8 lg:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-church-gold/10 transition-colors duration-700" />
                
                <div className="w-20 h-20 shrink-0 bg-church-gold/10 border border-church-gold/20 rounded-3xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <HardHat className="w-10 h-10 text-church-gold" />
                </div>
                
                <div className="relative z-10 text-center md:text-left flex-1">
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4">Sistema em construção</h3>
                  <p className="text-white/60 font-light leading-relaxed max-w-2xl">
                    A plataforma administrativa da Igreja Atalaias Vale da Benção está sendo preparada para receber módulos de gestão, 
                    pedidos de oração, cultos, ministérios, trilhas de discipulado, transmissões ao vivo, contribuições e comunicação com os membros.
                  </p>
                </div>
              </div>

              {/* Status Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Status dos Módulos</h4>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <Clock className="w-3 h-3 text-church-gold" />
                    <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Atualizado em tempo real</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {placeholderCards.map((card, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group cursor-not-allowed"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                          <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest group-hover:text-white/40 transition-colors">Em breve</span>
                        </div>
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-church-gold/40 group-hover:text-church-gold transition-colors duration-500">
                          <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-church-gold transition-colors">{card.label}</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-1">Módulo Offline</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Credits */}
        <footer className="relative z-20 border-t border-white/5 py-8 md:py-10 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left bg-black/20">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/20 leading-relaxed max-w-md">
            Desenvolvido por <span className="text-white/40 hover:text-church-gold transition-colors cursor-default">XD Plans</span><br className="md:hidden" />
            <span className="hidden md:inline mx-2">•</span>
            Arquitetura e Engenharia de Software por <span className="text-white/40">David Amorim Xavier</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/10">v1.0.0 Stable</span>
            <div className="w-px h-4 bg-white/5" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-church-gold font-bold">Admin Panel</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
