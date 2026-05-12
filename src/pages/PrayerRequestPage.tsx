import React from 'react';
import { motion } from 'motion/react';
import { Cross, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrayerRequestForm from '../components/prayers/PrayerRequestForm';

export default function PrayerRequestPage() {
  return (
    <div className="min-h-screen bg-church-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-church-gold/10 to-transparent pointer-events-none opacity-30" />
      <div className="ambient-glow top-[10%] left-[10%] w-[500px] h-[500px] bg-church-gold opacity-[0.05]" />
      <div className="ambient-glow bottom-[10%] right-[10%] w-[600px] h-[600px] bg-church-gold opacity-[0.03]" />

      <header className="relative z-10 px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Início
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-church-gold/10 border border-church-gold/20 mb-8 transform rotate-45"
            >
              <Cross className="w-8 h-8 text-church-gold -rotate-45" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
            >
              Intercessão e <span className="text-church-gold italic">Fé</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 font-light leading-relaxed"
            >
              Envie seu pedido de oração. Nossa liderança irá orar por você com cuidado, respeito e discrição.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/mural-oracao"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white hover:bg-church-gold hover:border-church-gold transition-all shadow-xl shadow-black/20"
            >
              Ver Mural de Oração
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-24 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-8 md:p-16 rounded-[4rem] border-white/5 shadow-2xl relative"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-church-gold/10 rounded-full blur-3xl" />
          <PrayerRequestForm />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-white/10" />
            <Heart className="w-4 h-4 text-church-gold" />
            <div className="w-12 h-px bg-white/10" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 leading-relaxed font-bold">
            “Orai uns pelos outros, para que sejais curados”<br />
            <span className="text-white/40">— Tiago 5:16</span>
          </p>
        </motion.div>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/10 leading-relaxed">
            Desenvolvido por <span className="text-white/20">XD Plans</span><br />
            Arquitetura e Engenharia de Software por <span className="text-white/20">David Amorim Xavier</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
