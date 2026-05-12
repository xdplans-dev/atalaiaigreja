import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, User, ArrowRight, Cross, AlertCircle, CheckCircle } from 'lucide-react';
import { register } from '../lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente outro e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-church-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="ambient-glow top-[10%] left-[10%] w-[400px] h-[400px] bg-church-gold opacity-[0.05]" />
      <div className="ambient-glow bottom-[10%] right-[10%] w-[500px] h-[500px] bg-church-gold opacity-[0.03]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-church-gold/10 border border-church-gold/20 mb-6 transform rotate-45">
            <Cross className="w-8 h-8 text-church-gold -rotate-45" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Novo Acesso</h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Igreja Atalaias Vale da Benção</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Cadastro Realizado!</h3>
              <p className="text-white/40 text-sm">Sua conta foi criada com sucesso. Você será redirecionado para o login.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6 relative z-10">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-church-gold hover:bg-church-gold-light disabled:opacity-50 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-church-gold/20 flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar Conta
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/login" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">
            Já tem uma conta? <span className="text-church-gold underline underline-offset-4">Faça Login</span>
          </Link>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 left-0 right-0 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 leading-relaxed">
          Desenvolvido por <span className="text-white/40">XD Plans</span><br />
          Arquitetura e Engenharia de Software por <span className="text-white/40">David Amorim Xavier</span>
        </p>
      </footer>
    </div>
  );
}
