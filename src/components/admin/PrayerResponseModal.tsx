import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, ShieldCheck, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { respondPrayerRequest } from '../../lib/api';

interface PrayerResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: any;
  onSuccess: () => void;
}

export default function PrayerResponseModal({ isOpen, onClose, prayer, onSuccess }: PrayerResponseModalProps) {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response) {
      setError('Por favor, escreva a resposta pastoral.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await respondPrayerRequest(prayer._id, response);
      onSuccess();
    } catch (err: any) {
      console.error('Error responding to prayer:', err);
      setError('Erro ao enviar resposta pastoral.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-church-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-church-black border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-church-gold/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-church-gold" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Responder Pedido de Oração</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">Aconselhamento e Intercessão</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Pedido Original</p>
                <div className="flex items-center gap-2">
                  {prayer.isAnonymous ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                      <ShieldCheck className="w-3 h-3 text-white/40" />
                      <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Anônimo</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-white/60">{prayer.name}</span>
                  )}
                  {prayer.allowPublicDisplay ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-church-gold/10 border border-church-gold/20 rounded-lg">
                      <Globe className="w-3 h-3 text-church-gold" />
                      <span className="text-[9px] uppercase font-bold text-church-gold tracking-widest">Permite Mural</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                      <ShieldCheck className="w-3 h-3 text-white/20" />
                      <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Privado</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-2">{prayer.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed font-light">{prayer.message}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Resposta Pastoral</label>
                <textarea 
                  required
                  rows={5}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Digite aqui as palavras de intercessão e orientação espiritual..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white focus:border-church-gold/50 outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prayer.allowPublicDisplay ? 'bg-church-gold/20 text-church-gold' : 'bg-white/10 text-white/40'}`}>
                  {prayer.allowPublicDisplay ? <Globe className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Visibilidade</p>
                  <p className="text-xs font-bold text-white">
                    {prayer.allowPublicDisplay ? 'Este pedido poderá aparecer no mural público.' : 'Este pedido permanecerá privado.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-church-gold hover:bg-church-gold-light disabled:opacity-50 text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar Resposta
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
