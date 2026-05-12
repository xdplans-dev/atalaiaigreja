import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, User, Mail, MessageSquare, ShieldCheck, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { createPrayerRequest } from '../../lib/api';

export default function PrayerRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
    isAnonymous: false,
    allowPublicDisplay: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setError('Por favor, preencha o título e a mensagem do seu pedido.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createPrayerRequest(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        title: '',
        message: '',
        isAnonymous: false,
        allowPublicDisplay: false
      });
    } catch (err: any) {
      console.error('Error submitting prayer request:', err);
      setError('Erro ao enviar pedido de oração. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3rem] border-white/5 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white">Pedido Enviado!</h3>
        <p className="text-white/60 font-light max-w-sm mx-auto">
          Seu pedido de oração foi enviado com sucesso. Nossa liderança irá acompanhar com carinho.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
        >
          Enviar Outro Pedido
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-500 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Seu Nome (Opcional)</label>
          <div className="relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Como gostaria de ser chamado"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">E-mail (Opcional)</label>
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Título do Pedido</label>
        <div className="relative">
          <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Saúde da minha família"
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Sua Mensagem</label>
        <textarea 
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Escreva aqui seu pedido de oração detalhadamente..."
          className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white focus:border-church-gold/50 outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label 
          className={`flex flex-col p-6 rounded-3xl border transition-all cursor-pointer group ${
            formData.isAnonymous ? 'bg-church-gold/10 border-church-gold/30' : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              formData.isAnonymous ? 'bg-church-gold text-white' : 'bg-white/10 text-white/40 group-hover:text-white/60'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white">Enviar de forma anônima</span>
            <input 
              type="checkbox"
              className="hidden"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-14">
            Seu nome não será exibido publicamente.
          </p>
        </label>

        <label 
          className={`flex flex-col p-6 rounded-3xl border transition-all cursor-pointer group ${
            formData.allowPublicDisplay ? 'bg-church-gold/10 border-church-gold/30' : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              formData.allowPublicDisplay ? 'bg-church-gold text-white' : 'bg-white/10 text-white/40 group-hover:text-white/60'
            }`}>
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white">Autorizo divulgação no mural</span>
            <input 
              type="checkbox"
              className="hidden"
              checked={formData.allowPublicDisplay}
              onChange={(e) => setFormData({ ...formData, allowPublicDisplay: e.target.checked })}
            />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-14">
            {formData.allowPublicDisplay 
              ? 'Seu pedido poderá ser visto no mural público após resposta pastoral.' 
              : 'Seu pedido ficará privado e será visto apenas pela liderança.'}
          </p>
        </label>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full py-5 bg-church-gold hover:bg-church-gold-light disabled:opacity-50 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-church-gold/20 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Enviar Pedido de Oração
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
