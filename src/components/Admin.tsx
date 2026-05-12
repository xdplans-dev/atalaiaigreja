import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, MessageSquare, LogOut, LayoutDashboard, Settings, 
  ChevronRight, Cross, Search, Trash2, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import axios from 'axios';
import { cn } from '../lib/utils';

interface PrayerRequest {
  _id: string;
  name: string;
  request: string;
  createdAt: string;
  status?: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('atalaia_token');
    const storedUser = localStorage.getItem('atalaia_user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    fetchPrayerRequests();
  }, [navigate]);

  const testApiConnection = async () => {
    setIsTestingApi(true);
    setApiStatus('idle');
    try {
      // Testing the external Render API specifically
      await axios.get('https://igrejaatalaiaapi.onrender.com/');
      setApiStatus('success');
    } catch (err) {
      console.error('API connection failed:', err);
      // Even if it returns 404, if it reaches the server it's technically a connection
      // But usually we want a 200
      setApiStatus('error');
    } finally {
      setIsTestingApi(false);
      setTimeout(() => setApiStatus('idle'), 3000);
    }
  };

  const fetchPrayerRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/prayer-requests');
      setPrayerRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching prayer requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atalaia_token');
    localStorage.removeItem('atalaia_user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prayers', label: 'Pedidos de Oração', icon: MessageSquare },
    { id: 'events', label: 'Eventos & Cultos', icon: Calendar },
    { id: 'members', label: 'Membros', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-church-black flex text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start transition-all duration-300">
        <div className="p-6 lg:px-10 lg:py-8 w-full">
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

        <div className="p-6 w-full">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-2xl group"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block font-medium text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-church-black relative">
        <div className="ambient-glow top-[5%] right-[5%] w-[600px] h-[600px] bg-church-gold opacity-[0.03]" />
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-church-black/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">
              Gerencie as informações da igreja
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 uppercase">Sistema Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-church-gold/20 border border-church-gold/30 flex items-center justify-center">
              <span className="text-xs font-bold text-church-gold">AD</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  { label: 'Pedidos de Oração', value: prayerRequests.length, icon: MessageSquare, color: 'from-church-gold/20' },
                  { label: 'Membros Ativos', value: '124', icon: Users, color: 'from-blue-500/10' },
                  { label: 'Eventos este Mês', value: '8', icon: Calendar, color: 'from-purple-500/10' },
                  { label: 'Crescimento', value: '+12%', icon: LayoutDashboard, color: 'from-green-500/10' },
                ].map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
                    <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.color)} />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-church-gold">
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="md:col-span-2 lg:col-span-4 mt-8">
                  <div className="glass p-8 rounded-[2.5rem] border-white/5">
                    <h3 className="text-xl font-serif font-bold text-white mb-6">Integração Externa</h3>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center text-church-gold">
                          <Settings className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Status da API Render</p>
                          <p className="text-xs text-white/40">https://igrejaatalaiaapi.onrender.com</p>
                        </div>
                      </div>
                      <button 
                        onClick={testApiConnection}
                        disabled={isTestingApi}
                        className={cn(
                          "px-6 py-3 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all min-w-[140px] flex items-center justify-center gap-2",
                          apiStatus === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          apiStatus === 'error' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-church-gold/10 text-church-gold border-church-gold/20 hover:bg-church-gold hover:text-white"
                        )}
                      >
                        {isTestingApi ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : apiStatus === 'success' ? (
                          <>Conectado <CheckCircle className="w-3 h-3" /></>
                        ) : apiStatus === 'error' ? (
                          <>Falha <AlertCircle className="w-3 h-3" /></>
                        ) : (
                          "Testar Conexão"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'prayers' && (
              <motion.div
                key="prayers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text"
                      placeholder="Buscar por nome ou pedido..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-church-gold/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-10 h-10 border-2 border-church-gold/30 border-t-church-gold rounded-full animate-spin" />
                      <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Carregando pedidos...</p>
                    </div>
                  ) : prayerRequests.length > 0 ? (
                    prayerRequests.map((prayer) => (
                      <div key={prayer._id} className="glass p-6 md:p-8 rounded-[2rem] border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-sm font-bold text-white">{prayer.name}</span>
                              <div className="w-1 h-1 bg-white/20 rounded-full" />
                              <span className="text-[10px] text-white/30 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(prayer.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-white/60 font-light leading-relaxed">
                              {prayer.request}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 px-6 border-2 border-dashed border-white/5 rounded-[3rem]">
                      <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-white/40 text-sm">Nenhum pedido de oração encontrado.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'prayers' && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 gap-6 opacity-30"
              >
                <item.icon className="w-16 h-16 text-church-gold" />
                <p className="text-sm font-bold uppercase tracking-[0.3em]">Em Desenvolvimento</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
