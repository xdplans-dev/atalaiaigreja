import React from 'react';
import { motion } from 'motion/react';
import { 
  Cross, ChevronRight, ArrowRight, BookOpen, UserPlus, Users, 
  GraduationCap, Share2, Flame, Heart, Zap, Globe, MessageCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHURCH_DATA } from '../constants';
import { cn } from '../lib/utils';

const E4_DATA = [
  { 
    title: "Exaltar", 
    description: "Adoramos a Deus em espírito e em verdade.",
    icon: Flame,
    color: "from-church-gold/20 to-transparent"
  },
  { 
    title: "Estabelecer", 
    description: "Firmamos vidas na Palavra e na presença de Deus.",
    icon: Zap,
    color: "from-blue-500/10 to-transparent"
  },
  { 
    title: "Equipar", 
    description: "Capacitamos discípulos para o ministério.",
    icon: GraduationCap,
    color: "from-church-gold/20 to-transparent"
  },
  { 
    title: "Estender", 
    description: "Levamos o amor de Cristo a todos os lugares.",
    icon: Globe,
    color: "from-blue-500/10 to-transparent"
  }
];

const STAGES = [
  {
    number: "01",
    title: "Conexão",
    profile: "Visitante",
    objective: "Acolher, receber e conectar o visitante à igreja.",
    actions: ["Recepção calorosa", "Cadastro de visitantes", "Convite para retornar"],
    sideMessage: "Todo grande propósito começa com um primeiro passo.",
    icon: UserPlus
  },
  {
    number: "02",
    title: "Decisão",
    profile: "Aceitou Jesus",
    objective: "Levar o visitante a ter um encontro pessoal com Cristo.",
    actions: ["Apelo claro e objetivo", "Oração de decisão", "Registro da decisão"],
    sideMessage: "Até 24 horas para fazer contato, acolher e orientar os próximos passos.",
    icon: Heart
  },
  {
    number: "03",
    title: "Consolidação",
    profile: "Primeiros passos",
    objective: "Acompanhar o novo convertido e ajudá-lo a se firmar em Cristo.",
    actions: ["Contato pessoal", "Inserção em grupo pequeno", "Atribuir um discipulador", "Acompanhamento semanal"],
    sideMessage: "Duração sugerida: 4 semanas. Não deixe esfriar, acompanhe de perto.",
    icon: MessageCircle
  },
  {
    number: "04",
    title: "Fundamentos",
    profile: "Base espiritual",
    objective: "Ensinar os fundamentos da fé e da vida cristã.",
    actions: ["Salvação", "Batismo e Espírito Santo", "Santificação e Redenção", "Oração e Palavra"],
    sideMessage: "Curso de 6 a 8 semanas, discipulado ou classe de novos convertidos.",
    icon: BookOpen
  },
  {
    number: "05",
    title: "Integração",
    profile: "Vida na igreja",
    objective: "Integrar o novo convertido à vida da igreja.",
    actions: ["Conhecer visão, missão e valores", "Tornar-se membro", "Participar dos cultos e célula", "Batismo nas águas"],
    sideMessage: "Novo ciclo: batismo público que declara sua fé em Jesus.",
    icon: Users
  },
  {
    number: "06",
    title: "Capacitação",
    profile: "Servir e crescer",
    objective: "Descobrir e desenvolver dons, servindo nos ministérios.",
    actions: ["Descobrir dons e talentos", "Ingresso nos ministérios", "Cursos e treinamentos", "Escola de Líderes nível 1"],
    sideMessage: "Crescimento contínuo: equipado para servir com excelência.",
    icon: GraduationCap
  },
  {
    number: "07",
    title: "Multiplicação",
    profile: "Discipulador",
    objective: "Formar discípulos e ganhar outras almas.",
    actions: ["Treinamento de discipulador", "Liderar e acompanhar outros", "Escola de Líderes nível 2", "Enviar para a obra"],
    sideMessage: "Missão sem fim: ele ganha almas e recomeça o ciclo.",
    icon: Share2
  }
];

export default function MinisterialTrail() {
  return (
    <div className="bg-church-black min-h-screen flex flex-col text-white relative overflow-hidden selection:bg-church-gold selection:text-white">
      {/* Background Glows */}
      <div className="ambient-glow top-0 right-0 w-[600px] h-[600px] bg-church-gold opacity-[0.05]" />
      <div className="ambient-glow bottom-0 left-0 w-[500px] h-[500px] bg-church-gold opacity-[0.03]" />

      {/* Header Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/10 backdrop-blur-md bg-black/20 flex items-center justify-between px-6 md:px-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden transform group-hover:scale-110 transition-transform">
              <img 
                src="https://i.ibb.co/xt0yctN2/Chat-GPT-Image-11-de-mai-de-2026-11-57-15.png" 
                alt="Logo Atalaias" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold tracking-[0.2em] uppercase leading-none">Atalaias</span>
              <span className="text-church-gold text-[10px] font-semibold tracking-widest uppercase text-right">Trail</span>
            </div>
          </Link>
          <Link 
            to="/"
            className="text-[10px] md:text-[11px] uppercase tracking-widest font-medium opacity-80 hover:text-church-gold transition-colors"
          >
            Voltar ao Site
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-20 px-6 md:px-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-church-gold rounded-full animate-pulse" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/70">Uma igreja de propósito vivendo os 4E</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-4 tracking-tight"
          >
            Trilha <span className="text-church-gold italic">Ministerial</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] mb-12 text-[10px] md:text-base"
          >
            De visitante a discipulador
          </motion.p>

          {/* Core Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-8">
            {[
              { label: "Nosso Propósito", content: CHURCH_DATA.purpose, color: "from-church-gold/20" },
              { label: "Nossa Missão", content: CHURCH_DATA.mission, color: "from-white/10" },
              { label: "Nossa Visão", content: CHURCH_DATA.vision, color: "from-church-gold/20" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={cn(
                  "p-8 glass rounded-3xl border-white/5 relative overflow-hidden group hover:border-church-gold/30 transition-all",
                  "flex flex-col text-left"
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-10 transition-opacity", item.color)} />
                <span className="text-church-gold font-bold uppercase text-[10px] tracking-widest mb-4">{item.label}</span>
                <p className="text-white/80 font-light leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 px-6 md:px-10 relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <h2 className="sr-only">Passos da Jornada Ministerial</h2>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-church-gold/50 via-white/10 to-church-gold/50 md:block" />

              <div className="space-y-24 md:space-y-32">
                {STAGES.map((stage, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center",
                      idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                    )}
                  >
                    {/* Stage Number / Pin */}
                    <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 top-0 md:top-12 z-20">
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-church-black border-2 border-church-gold flex items-center justify-center text-church-gold shadow-[0_0_20px_rgba(198,146,20,0.3)]">
                        <span className="text-sm md:text-xl font-bold">{stage.number}</span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-[calc(50%-40px)] pl-12 md:pl-0">
                      <div className="glass p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-white/5 hover:border-church-gold/20 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all">
                          <stage.icon className="w-20 h-20 md:w-32 md:h-32 text-church-gold" />
                        </div>
                        
                        <div className="relative z-10">
                          <span className="inline-block px-3 py-1 bg-church-gold/10 text-church-gold rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-4">
                            Perfil: {stage.profile}
                          </span>
                          <h3 className="text-xl md:text-4xl font-serif font-bold text-white mb-4">Etapa {idx+1} - <span className="text-church-gold uppercase">{stage.title}</span></h3>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Objetivo</h4>
                              <p className="text-white/70 font-light leading-relaxed text-xs md:text-base">{stage.objective}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">Ações</h4>
                              <ul className="grid grid-cols-1 gap-2">
                                {stage.actions.map((action, aIdx) => (
                                  <li key={aIdx} className="flex items-center gap-2 text-[10px] md:text-sm text-white/60">
                                    <div className="w-1 h-1 bg-church-gold rounded-full" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Side Message */}
                    <div className={cn(
                      "w-full md:w-[calc(50%-40px)] text-left pl-12 md:pl-0",
                      idx % 2 !== 0 ? "md:text-right" : ""
                    )}>
                      <p className="text-sm md:text-lg font-serif italic text-white/30 leading-relaxed max-w-xs md:mx-0">
                        &quot;{stage.sideMessage}&quot;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4E's Section */}
        <section className="py-24 md:py-32 px-6 md:px-10 bg-neutral-900/40 relative border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-church-gold font-bold tracking-widest uppercase text-xs mb-4 block">Fundamentos</span>
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-8">Os <span className="text-church-gold italic">4E</span> do Nosso Propósito</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {E4_DATA.map((e, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="glass p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-church-gold/30 transition-all"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-10 transition-opacity", e.color)} />
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-church-gold/10 flex items-center justify-center mb-6 md:mb-8 text-church-gold">
                    <e.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4 uppercase tracking-tight">{e.title}</h3>
                  <p className="text-white/60 font-light text-xs md:text-sm leading-relaxed">{e.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verse Section */}
        <section className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden">
          <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-church-gold opacity-[0.03]" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-12"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-church-gold/20 flex items-center justify-center mx-auto mb-8 md:mb-12">
                <Cross className="w-6 h-6 md:w-8 md:h-8 text-church-gold/40" />
              </div>
              <h2 className="text-xl md:text-3xl font-serif italic text-white/90 leading-relaxed font-light">
                &ldquo;Portanto, ide e fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho e do Espírito Santo; ensinando-os a guardar todas as coisas que vos tenho ordenado; e eis que estou convosco todos os dias, até a consumação dos séculos. Amém.&rdquo;
              </h2>
              <div className="space-y-1">
                <p className="text-church-gold font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">Mateus 28:19-20</p>
                <div className="w-12 h-px bg-church-gold mx-auto mt-4" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-24 md:pb-40 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="glass p-8 md:p-12 lg:p-24 rounded-[2.5rem] md:rounded-[4rem] border-church-gold/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-church-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-6">Deus transforma <br/> <span className="text-church-gold">uma vida</span> de cada vez</h2>
                <p className="text-white/40 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto font-light">
                  Comece sua jornada hoje mesmo. Estamos prontos para caminhar ao seu lado em cada etapa desta trilha.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                  <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-church-gold hover:text-white transition-all shadow-2xl">
                    Quero conhecer a igreja
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 bg-church-gold text-white font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-church-gold-dark transition-all shadow-2xl shadow-church-gold/20">
                    Quero fazer parte da trilha
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 border border-white/20 bg-white/5 text-white font-bold uppercase text-[10px] md:text-xs tracking-widest hover:border-church-gold transition-all">
                    Falar com a liderança
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-20 h-auto md:h-20 bg-church-black flex flex-col md:flex-row items-center justify-between px-6 md:px-10 border-t border-white/5 py-8 md:py-0 gap-4 text-center md:text-left mt-auto">
          <span className="text-[8px] md:text-[9px] uppercase text-white/20 tracking-wider">© 2026 Igreja Atalaias Vale da Benção</span>
          <span className="text-[8px] md:text-[9px] uppercase text-white/40 tracking-wider">
            Desenvolvido por <span className="text-white font-bold">XD Plans • David Xavier</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
