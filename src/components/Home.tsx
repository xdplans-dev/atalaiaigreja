import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Cross, Church, Calendar, PlayCircle, Heart, Users, CreditCard, Phone, 
  Instagram, MapPin, MessageSquare, ChevronRight, Play, Quote, Send, ArrowRight
} from 'lucide-react';
import { CHURCH_DATA } from '../constants';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prayerName, setPrayerName] = useState('');
  const [prayerMessage, setPrayerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerName || !prayerMessage) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: prayerName, request: prayerMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: data.message });
        setPrayerName('');
        setPrayerMessage('');
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Erro ao enviar pedido.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erro de conexão com o servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', href: '#home' },
    { label: 'A Igreja', href: '#about' },
    { label: 'Cultos', href: '#services' },
    { label: 'Trilha', href: '/trail', isRoute: true },
    { label: 'Ao Vivo', href: '#live' },
    { label: 'Ministérios', href: '#ministries' },
    { label: 'Contribuições', href: '#offerings' },
    { label: 'Contato', href: '#contact' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-church-black selection:bg-church-gold selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="ambient-glow top-[-10%] right-[-10%] w-[500px] h-[500px] bg-church-gold opacity-[0.07]" />
      <div className="ambient-glow bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-church-gold opacity-[0.05]" />

      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "bg-church-black/80 backdrop-blur-xl py-4 border-b border-white/10" : "bg-transparent py-6 md:py-8"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden transform group-hover:scale-110 transition-transform duration-500">
              <img 
                src="https://i.ibb.co/xt0yctN2/Chat-GPT-Image-11-de-mai-de-2026-11-57-15.png" 
                alt="Logo Atalaias" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold tracking-[0.2em] uppercase leading-none">Atalaias</span>
              <span className="text-church-gold text-[10px] font-semibold tracking-widest uppercase">Vale da Benção</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link 
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-white/70 hover:text-church-gold transition-colors duration-300 uppercase tracking-widest"
                >
                  {item.label}
                </Link>
              ) : (
                <a 
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white/70 hover:text-church-gold transition-colors duration-300 uppercase tracking-widest"
                >
                  {item.label}
                </a>
              )
            ))}
            <a 
              href="#live"
              className="bg-church-gold hover:bg-church-gold-light text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-church-gold/20 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 fill-white" />
              Ao Vivo
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-church-black pt-32 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link 
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif text-white hover:text-church-gold transition-colors uppercase"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-serif text-white hover:text-church-gold transition-colors uppercase"
                  >
                    {item.label}
                  </a>
                )
              ))}
              <a 
                href="#live"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 bg-church-gold text-white w-full py-4 rounded-xl text-lg font-bold uppercase"
              >
                Assistir Ao Vivo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center px-6 md:px-10 pt-24 md:pt-20 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1544427928-c49cdfebf494?q=80&w=2000&auto=format&fit=crop"
              alt="Ambiente de Louvor"
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-church-black via-church-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-church-black z-10" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">
              {/* Hero Left Text Area */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-church-gold rounded-full animate-pulse"></span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/70">Estamos Online • Próximo Culto: Hoje 19:30</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-[1.1]">
                  Levando <span className="text-church-gold italic">Luz</span>,<br />
                  Esperança e <span className="relative inline-block lg:inline">
                    Transformação
                    <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-church-gold"></span>
                  </span>
                </h1>
                <p className="text-white/60 max-w-lg text-base md:text-lg mb-10 font-light leading-relaxed mx-auto lg:mx-0">
                  {CHURCH_DATA.purpose}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <a 
                    href="#live"
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-church-gold hover:text-white transition-all duration-300 w-full sm:w-auto justify-center"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Assistir Ao Vivo
                  </a>
                  <a 
                    href="#about"
                    className="px-8 py-4 border border-white/20 bg-white/5 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all duration-300 w-full sm:w-auto justify-center"
                  >
                    Conheça Nossa Igreja
                  </a>
                </div>
              </motion.div>

              {/* Interactive Features Column */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 flex flex-col gap-4 w-full max-w-md mx-auto lg:max-w-none"
              >
                {/* Ministries Spotlight */}
                <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg flex flex-col group hover:border-church-gold/50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-church-gold font-bold">Nossos Ministérios</span>
                    <a href="#ministries" className="text-xs opacity-40 hover:opacity-100 transition-opacity">Ver Todos</a>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 overflow-hidden">
                    {CHURCH_DATA.ministries.slice(0, 3).map((m, i) => (
                      <div key={i} className="flex-1 h-24 bg-white/5 rounded overflow-hidden relative border border-white/5 hover:border-church-gold/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold text-white/90">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prayer Request Card */}
                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-lg flex items-center justify-between group hover:border-church-gold/30 transition-all">
                  <div>
                    <h4 className="text-sm font-bold tracking-tight mb-1 uppercase text-white/90 font-serif">Pedido de Oração</h4>
                    <p className="text-xs text-white/40">Queremos orar por você agora.</p>
                  </div>
                  <a href="#prayer" className="w-10 h-10 rounded-full border border-church-gold flex items-center justify-center text-church-gold group-hover:bg-church-gold group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>

                {/* Locations / Agenda Mini */}
                <div className="p-6 bg-church-gold text-black rounded-lg shadow-xl shadow-church-gold/20">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4">Fique por dentro</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-black/10 pb-1">
                      <span className="text-[10px] font-bold">Terça - {CHURCH_DATA.schedule[1].events[0].title}</span>
                      <span className="text-[10px] opacity-80">{CHURCH_DATA.schedule[1].events[0].time}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/10 pb-1">
                      <span className="text-[10px] font-bold">Domingo - {CHURCH_DATA.schedule[0].events[1].title}</span>
                      <span className="text-[10px] opacity-80">{CHURCH_DATA.schedule[0].events[1].time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Biblical Verse */}
        <section className="py-20 md:py-24 bg-church-black relative border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Quote className="w-10 h-10 md:w-12 md:h-12 text-church-gold/20 mx-auto mb-8" />
            <p 
              className="text-xl md:text-4xl font-serif italic text-white/90 leading-relaxed mb-6"
            >
              &ldquo;Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.&rdquo;
            </p>
            <p className="text-church-gold font-bold tracking-widest uppercase text-[10px] md:text-xs">Salmos 119:105</p>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 md:py-32 bg-church-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-church-gold/10 rounded-full blur-3xl" />
                <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1543165365-072ca203793e?q=80&w=1000&auto=format&fit=crop" 
                    alt="Liderança da Igreja"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-church-black via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-church-gold font-bold uppercase tracking-widest text-[10px] mb-2">Mensagem Pastoral</p>
                    <h3 className="text-white text-2xl font-serif">&ldquo;Lugar de novos começos&rdquo;</h3>
                  </div>
                </div>
              </motion.div>

              <div>
                <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Nossa Essência</span>
                <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-8">Vivendo o <span className="italic text-church-gold">Propósito</span></h2>
                <div className="space-y-8 text-white/70 font-light leading-relaxed">
                  <p className="text-sm md:text-base">
                    A Igreja Atalaias Vale da Benção é mais do que um templo, é uma família. Nossa base é pavimentada na oração e na busca incessante pela presença de Deus.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-church-gold/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-church-gold" />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">Missão</h4>
                      <p className="text-sm font-light leading-tight">{CHURCH_DATA.mission}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-church-gold/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-church-gold" />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">Visão</h4>
                      <p className="text-sm font-light leading-tight">{CHURCH_DATA.vision}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-church-gold/10 flex items-center justify-center">
                        <Send className="w-5 h-5 text-church-gold" />
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">Propósito</h4>
                      <p className="text-sm font-light leading-tight">{CHURCH_DATA.purpose}</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-church-gold font-bold uppercase text-xs tracking-[0.2em] group pt-4">
                    Saiba mais sobre nossa história
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section id="services" className="py-24 md:py-32 bg-neutral-900/40 relative border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-20">
              <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Agenda Semanal</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-white">Momentos de <span className="italic text-church-gold">Adoração</span></h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CHURCH_DATA.schedule.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-8 rounded-3xl hover:border-church-gold/30 transition-all duration-500 group"
                >
                  <Calendar className="w-8 h-8 text-church-gold/40 mb-6 group-hover:text-church-gold transition-colors" />
                  <h3 className="text-church-gold font-bold uppercase tracking-widest text-lg mb-6">{item.day}</h3>
                  <div className="space-y-4">
                    {item.events.map((event, eIdx) => (
                      <div key={eIdx} className="flex flex-col border-l border-white/10 pl-4 py-1">
                        <span className="text-white font-medium text-lg leading-tight">{event.title}</span>
                        <span className="text-white/40 text-sm font-light">{event.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Broadcast */}
        <section id="live" className="py-32 bg-church-black relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
              src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2000&auto=format&fit=crop"
              alt="Live"
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-church-black/80 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center border-church-gold/20 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center mb-8 animate-pulse text-red-600">
                <PlayCircle className="w-10 h-10 fill-red-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Acompanhe Ao Vivo</h2>
              <p className="text-white/60 text-lg mb-12 max-w-2xl font-light">
                Não importa onde você esteja, conecte-se com o Reino de Deus agora mesmo através de nossas transmissões.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a href="#" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 transition-all">
                  <Play className="w-5 h-5 fill-white" />
                  YouTube Live
                </a>
                <a href="#" className="flex items-center gap-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-white px-8 py-4 rounded-2xl border border-[#1877F2]/20 transition-all">
                  <Play className="w-5 h-5 fill-[#1877F2]" />
                  Facebook Live
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Prayer Section */}
        <section id="prayer" className="py-32 bg-church-black relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Clame por Nós</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">Pedidos de <span className="italic text-church-gold">Oração</span></h2>
                <p className="text-white/60 text-lg mb-12 font-light leading-relaxed">
                  Acreditamos no poder da oração intercessória. Conte-nos como podemos orar por você. Sua mensagem será tratada com total sigilo e dedicação espiritual.
                </p>
                <div className="p-8 glass rounded-3xl border-church-gold/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-church-gold/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 text-church-gold" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">&ldquo;O Senhor está perto de todos os que o invocam.&rdquo;</p>
                      <p className="text-church-gold text-xs font-bold uppercase tracking-widest">Salmos 145:18</p>
                    </div>
                  </div>
                </div>
              </div>

              <form 
                className="glass p-10 rounded-[2.5rem] border-white/5 space-y-6"
                onSubmit={handlePrayerSubmit}
              >
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Seu Nome</label>
                  <input 
                    type="text" 
                    value={prayerName}
                    onChange={(e) => setPrayerName(e.target.value)}
                    placeholder="Como gostaria de ser chamado?" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Sua Mensagem / Pedido</label>
                  <textarea 
                    rows={4}
                    value={prayerMessage}
                    onChange={(e) => setPrayerMessage(e.target.value)}
                    placeholder="Descreva seu pedido de oração..." 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {submitStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl text-sm font-medium",
                      submitStatus.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-church-gold hover:bg-church-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-church-gold/20 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Enviar Pedido
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Ministries Section */}
        <section id="ministries" className="py-24 md:py-32 bg-neutral-900/40 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-12 md:mb-20">
              <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Nossos Ministérios</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-white">Comunidade em <span className="italic text-church-gold">Ação</span></h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {CHURCH_DATA.ministries.map((min, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
                    <img 
                      src={`https://images.unsplash.com/photo-${idx % 2 === 0 ? "1523240795612-9a054b0db644" : "1529156069898-49953e39b3ac"}?q=80&w=800&auto=format&fit=crop`}
                      alt={min.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-church-black/40 group-hover:bg-church-gold/20 transition-all duration-700" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white text-2xl font-serif font-bold tracking-tight">{min.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/40 font-light text-sm line-clamp-2 px-2 group-hover:text-white/60 transition-colors">
                    {min.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Offerings Section */}
        <section id="offerings" className="py-32 bg-church-black">
          <div className="max-w-4xl mx-auto px-6">
            <div className="glass p-8 md:p-12 lg:p-20 rounded-[2rem] md:rounded-[4rem] text-center relative overflow-hidden border-church-gold/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-6 block">Generosidade</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">Dízimos e <span className="italic text-church-gold">Ofertas</span></h2>
                <p className="text-white/60 text-lg mb-12 font-light leading-relaxed">
                  Honre ao Senhor com os seus bens e com as primícias de toda a sua renda. Sua contribuição nos ajuda a manter a obra do Reino e alcançar mais vidas.
                </p>

                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 text-center">Transferência PIX (E-mail)</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-lg text-white font-mono select-all">financeiro@atalaias.com.br</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 text-center">QR Code para Doação</p>
                    <div className="w-32 h-32 bg-white/10 mx-auto rounded-2xl flex items-center justify-center">
                      {/* Simulating QR code with icon for aesthetic */}
                      <CreditCard className="w-16 h-16 text-church-gold/20" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                  <Users className="w-3 h-3" />
                  <span>Ambiente Seguro • Administrado com Transparência</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-32 bg-church-black relative border-t border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Onde Estamos</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-12">Visite Nossa <span className="italic text-church-gold">Casa</span></h2>
                
                <div className="space-y-12">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-church-gold/10 flex items-center justify-center shrink-0 group-hover:bg-church-gold transition-all duration-500">
                      <MapPin className="w-6 h-6 text-church-gold group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-church-gold font-bold uppercase text-xs tracking-widest mb-2">{CHURCH_DATA.addresses.sede.label}</h4>
                      <p className="text-white text-xl font-medium mb-1">{CHURCH_DATA.addresses.sede.street}</p>
                      <p className="text-white/40 mb-4">{CHURCH_DATA.addresses.sede.city}</p>
                      <a href={CHURCH_DATA.addresses.sede.mapsUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white underline text-sm transition-colors">Como chegar</a>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-full bg-church-gold/10 flex items-center justify-center shrink-0 group-hover:bg-church-gold transition-all duration-500">
                      <MapPin className="w-6 h-6 text-church-gold group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-church-gold font-bold uppercase text-xs tracking-widest mb-2">{CHURCH_DATA.addresses.unidade.label}</h4>
                      <p className="text-white text-xl font-medium mb-1">{CHURCH_DATA.addresses.unidade.street}</p>
                      <p className="text-white/40 mb-4">{CHURCH_DATA.addresses.unidade.city}</p>
                      <a href={CHURCH_DATA.addresses.unidade.mapsUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white underline text-sm transition-colors">Como chegar</a>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex gap-6">
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-church-gold transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-church-gold transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-church-gold transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="h-[300px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 glass grayscale hover:grayscale-0 transition-all duration-700">
                {/* Simulated Google Map Integration */}
                <div className="w-full h-full bg-neutral-900 border border-white/5 relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:40px_40px]" />
                  </div>
                  <div className="text-center p-8">
                    <MapPin className="w-12 h-12 text-church-gold mx-auto mb-4" />
                    <p className="text-white/60 max-w-xs mx-auto">Mapa interativo integrado de Guarulhos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 h-auto lg:h-20 bg-church-black flex flex-col lg:flex-row items-center justify-between px-6 md:px-10 py-8 lg:py-0 border-t border-white/5 gap-8 lg:gap-6 mt-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
            <span className="text-church-gold font-bold">Sede:</span> 
            <span className="max-w-[200px] sm:max-w-none">{CHURCH_DATA.addresses.sede.street}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
            <span className="text-church-gold font-bold">Unidade:</span> 
            <span className="max-w-[200px] sm:max-w-none">{CHURCH_DATA.addresses.unidade.street}</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 text-[8px] md:text-[9px] uppercase text-center">
          <span className="text-white/20 tracking-wider">© 2026 Igreja Atalaias Vale da Benção</span>
          <div className="hidden lg:block w-px h-4 bg-white/10"></div>
          <span className="text-white/40 tracking-wider">
            Desenvolvido por <span className="text-white font-bold tracking-normal">XD Plans • David Xavier</span>
          </span>
          <div className="hidden lg:block w-px h-4 bg-white/10"></div>
          <Link to="/login" className="text-white/20 hover:text-white/40 transition-colors tracking-widest text-[8px] md:text-[9px] uppercase">
            Acesso Restrito
          </Link>
        </div>
      </footer>
      
      {/* Floating Action Button (WhatsApp) */}
      <a 
        href="#"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20 hover:scale-110 transition-transform duration-300 group"
      >
        <MessageSquare className="w-6 h-6 md:w-8 md:h-8 fill-white group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
