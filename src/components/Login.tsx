import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Cross, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import { cn } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session') === 'expired') {
      setError('Sessão expirada. Faça login novamente.');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Informe seu e-mail.');
      return;
    }
    if (!password) {
      setError('Informe sua senha.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Handle the various response formats the API might return
      const responseData = response.data;
      const token = responseData?.token || responseData?.data?.token;
      
      if (token) {
        localStorage.setItem('atalaias_token', token);
        const userData = responseData?.user || responseData?.data?.user || { email };
        localStorage.setItem('atalaias_user', JSON.stringify(userData));
        navigate('/admin');
      } else {
        setError('Erro ao processar resposta do servidor.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const serverMessage = err.response?.data?.message;
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(serverMessage || 'E-mail ou senha inválidos.');
      } else if (!err.response) {
        setError('Erro ao conectar com o servidor.');
      } else {
        setError(serverMessage || 'Erro ao realizar login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-church-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
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
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Igreja Atalaias Vale da Benção</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-church-gold/5 rounded-full blur-[60px] -mr-16 -mt-16" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail cadastrado"
                  required
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
                  placeholder="Sua senha de acesso"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-church-gold/50 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-church-gold hover:bg-church-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-church-gold/20 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/register" className="text-[10px] uppercase tracking-widest text-church-gold hover:text-church-gold-light transition-colors underline underline-offset-4 font-bold">
                Não tem acesso? Registrar
              </Link>
            </div>
          </form>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-8 text-[10px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
        >
          Voltar para o site público
        </button>
      </motion.div>

      {/* Required Footer Credits */}
      <footer className="absolute bottom-8 left-0 right-0 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 leading-relaxed">
          Desenvolvido por <span className="text-white/40">XD Plans</span><br />
          Arquitetura e Engenharia de Software por <span className="text-white/40">David Amorim Xavier</span>
        </p>
      </footer>
    </div>
  );
}
