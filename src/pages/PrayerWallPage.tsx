import React from 'react';
import { motion } from 'motion/react';
import { Cross, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrayerWall from '../components/prayers/PrayerWall';

export default function PrayerWallPage() {
  return (
    <div className="min-h-screen bg-church-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-church-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-church-gold/3 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4" />

      <header className="relative z-10 px-6 py-12 md:py-24 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Início
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-church-gold/10 border border-church-gold/20 mb-8"
            >
              <MessageSquare className="w-6 h-6 text-church-gold" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
            >
              Mural de <span className="text-church-gold">Oração</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60 font-light leading-relaxed max-w-xl"
            >
              Pedidos autorizados para divulgação e respondidos pela liderança. 
              Um testemunho vivo da nossa intercessão comunitária.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <Link 
              to="/oracao"
              className="px-10 py-5 bg-church-gold hover:bg-church-gold-light text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-church-gold/20 flex items-center justify-center gap-3"
            >
              Fazer Pedido de Oração
              <Heart className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <PrayerWall />
      </main>

      <footer className="relative z-10 py-16 px-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 rotate-45">
              <Cross className="w-5 h-5 text-white/20 -rotate-45" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/10 leading-relaxed text-center font-bold">
              Igreja Atalaias Vale da Benção<br />
              <span className="text-white/5 font-light tracking-widest mt-2 block">Uma comunidade de oração e fé</span>
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/5 leading-relaxed text-center">
              Desenvolvido por XD Plans<br />
              Engenharia por David Amorim Xavier
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
