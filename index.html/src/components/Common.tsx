import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Info, Mic, Languages, X, Scale, Sparkles, Home, ListChecks, Map, Zap, Users, Headphones, Volume2, Square } from 'lucide-react';
import { ScreenId, UserData } from '../types';
import { t } from '../lib/translations';

import { AssistantChat } from './AssistantChat';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-navy text-white hover:bg-navy/90 shadow-sm',
    secondary: 'bg-gold text-white hover:bg-gold/90 shadow-sm',
    outline: 'border-2 border-navy text-navy hover:bg-navy/5',
    ghost: 'text-navy hover:bg-navy/5',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => {
  const hasBg = /bg-/.test(className);
  return (
    <motion.div 
      whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`${hasBg ? '' : 'bg-white'} rounded-3xl shadow-premium border border-navy/5 p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'success' | 'warning' }> = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-lightblue/20 text-navy',
    success: 'bg-green-100 text-green-700 font-medium',
    warning: 'bg-amber-100 text-amber-700 font-medium',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[variant]}`}>
      {children}
    </span>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
  showHeader?: boolean;
  user?: UserData;
  updateUser?: (data: Partial<UserData>) => void;
  onNavigate?: (id: ScreenId) => void;
  activeScreen?: ScreenId;
}

export const TTSButton: React.FC<{ text: string, lang: string }> = ({ text, lang }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const synth = window.speechSynthesis;

  React.useEffect(() => {
    const handleVoices = () => {
      setAvailableVoices(synth.getVoices());
    };
    synth.onvoiceschanged = handleVoices;
    handleVoices();
  }, [synth]);

  const speak = () => {
    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-MX' : 'es-MX'; // Mixteco fallback
    const voices = availableVoices.length > 0 ? availableVoices : synth.getVoices();
    
    // Prioritize natural/premium voices
    const preferredVoice = voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').includes(targetLang.toLowerCase()) && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.toLowerCase().replace('_', '-').includes(targetLang.toLowerCase().split('-')[0]));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = targetLang;
    
    // Welcoming variation - warmer and more patient
    utterance.pitch = 1.08 + (Math.random() * 0.04 - 0.02);
    utterance.volume = 1.0;
    utterance.rate = 0.92; // Slower for maximum clarity and kindness
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    setIsPlaying(true);
    synth.speak(utterance);
  };

  React.useEffect(() => {
    return () => synth.cancel();
  }, [synth]);

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); speak(); }}
      className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-gold text-white animate-pulse' : 'bg-navy/5 text-navy hover:bg-navy/10'}`}
      title="Listen"
    >
      {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onBack, 
  title, 
  showHeader = true,
  user,
  updateUser,
  onNavigate,
  activeScreen
}) => {
  const lang = user?.language || 'en';
  const [isLangOpen, setIsLangOpen] = React.useState(false);

  const navItems = [
    { id: 'DASHBOARD' as ScreenId, icon: Home, label: t('nav.dashboard', lang) },
    { id: 'CHECKLIST' as ScreenId, icon: ListChecks, label: t('nav.checklist', lang) },
    { id: 'ROADMAP' as ScreenId, icon: Map, label: t('nav.roadmap', lang) },
    { id: 'AI_ASSISTANT' as ScreenId, icon: Zap, label: t('nav.ai_assistant', lang) },
    { id: 'SUPPORT' as ScreenId, icon: Headphones, label: t('nav.support', lang) },
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'mix', label: 'Mixteco' },
  ];

  return (
    <div className={`min-h-screen bg-[#FDFCF8] flex flex-col font-sans mb-24 lg:mb-0 ${user?.isSimplifiedMode ? 'text-lg' : ''}`}>
      {showHeader && (
        <header className="px-6 py-6 border-b border-navy/5 bg-white/40 backdrop-blur-3xl sticky top-0 z-[100]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Website Brand Logo */}
            <div className="flex items-center gap-6">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy hover:bg-navy/10 transition-colors group/back"
                  aria-label={t('nav.back', lang)}
                >
                  <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-0.5 transition-transform" />
                </button>
              )}
              <div 
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => onNavigate?.('DASHBOARD')}
              >
                <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center shadow-xl shadow-navy/20 group-hover:scale-105 transition-transform duration-300">
                  <Scale className="w-7 h-7 text-gold" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-lg font-black text-navy uppercase tracking-tighter leading-none">{t('brand.name', lang)}</span>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mt-1">{t('brand.subtitle', lang)}</span>
                </div>
              </div>
            </div>
            
            {/* Modern Main Nav */}
            <nav className="hidden lg:flex items-center gap-8">
               {user?.isLoggedIn && navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => onNavigate?.(item.id)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeScreen === item.id ? 'text-gold' : 'text-navy/40 hover:text-navy'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
               ))}
               {!user?.isLoggedIn && (
                 <>
                   <button className="text-xs font-black text-navy/40 hover:text-navy uppercase tracking-[0.2em] transition-colors">{lang === 'es' ? 'Inicio' : 'Home'}</button>
                   <button className="text-xs font-black text-navy/40 hover:text-navy uppercase tracking-[0.2em] transition-colors">{lang === 'es' ? 'Recursos' : 'Resources'}</button>
                 </>
               )}
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-4 relative">
               <div className="relative">
                 <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="px-4 py-2 rounded-xl bg-navy/5 text-[10px] font-black text-navy uppercase tracking-[0.2em] hover:bg-navy/10 transition-colors flex items-center gap-2 border border-navy/5"
                 >
                  <Languages className="w-3 h-3 text-gold" />
                  {lang === 'mix' ? 'Mixteco ✨' : lang === 'es' ? 'Spanish' : 'Languages'}
                 </button>

                 <AnimatePresence>
                   {isLangOpen && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-navy/5 overflow-hidden z-[1000]"
                     >
                        {languages.map((l) => (
                          <button
                            key={l.id}
                            className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.id ? 'bg-gold text-white' : 'text-navy hover:bg-navy/5'}`}
                            onClick={() => {
                              updateUser?.({ language: l.id as any });
                              setIsLangOpen(false);
                            }}
                          >
                            {l.label}
                          </button>
                        ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>

               {!user?.isLoggedIn && (
                 <Button size="sm" className="hidden sm:flex shadow-lg shadow-navy/10 rounded-xl px-8" onClick={() => onNavigate?.('SIGNUP')}>
                  {lang === 'es' ? 'Ingresar' : 'Sign In'}
                 </Button>
               )}
            </div>
          </div>
          {lang === 'mix' && (
            <div className="max-w-7xl mx-auto mt-4 px-4 py-2 bg-gold/10 rounded-xl border border-gold/20 flex items-center gap-3">
              <Info className="w-4 h-4 text-gold shrink-0" />
              <p className="text-[10px] font-bold text-navy/70 leading-tight">
                {t('mix.disclaimer', 'mix')}
              </p>
            </div>
          )}
        </header>
      )}

      {/* Hero-centric Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-16 relative">
        <AnimatePresence mode="wait">
          <motion.div
             key={activeScreen || title}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      {user?.isLoggedIn && onNavigate && (
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-navy/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex items-center justify-around px-4 shadow-2xl z-[1000]">
           {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 group"
              >
                 <div className={`p-3 rounded-2xl transition-all ${activeScreen === item.id ? 'bg-gold text-white scale-110 shadow-lg shadow-gold/20' : 'text-white/40 group-hover:text-white group-hover:bg-white/5'}`}>
                    <item.icon className="w-6 h-6" />
                 </div>
                 <span className={`text-[8px] font-black uppercase tracking-widest ${activeScreen === item.id ? 'text-gold' : 'text-white/20'}`}>{item.label}</span>
              </button>
           ))}
        </nav>
      )}

      {/* Robust Website Footer */}
      <footer className="bg-navy py-24 px-6 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -mr-48 -mt-48" />
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <Scale className="w-10 h-10 text-gold" />
                  <span className="text-2xl font-black uppercase tracking-tighter">{t('brand.name', lang)}</span>
               </div>
               <p className="text-white/40 text-sm leading-relaxed max-w-xs italic">
                  {t('footer.mission', lang)}
               </p>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{lang === 'es' ? 'Servicios' : 'Services'}</h4>
               <ul className="space-y-4 text-sm text-white/50 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">AI Assistant</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Know Your Rights</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Case Roadmap</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Translation Help</li>
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{lang === 'es' ? 'Organización' : 'Organization'}</h4>
               <ul className="space-y-4 text-sm text-white/50 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Volunteer</li>
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{lang === 'es' ? 'Asistencia' : 'Support'}</h4>
               <div className="space-y-4">
                  <p className="text-sm text-white/60">¿Necesitas ayuda urgente?</p>
                  <Button variant="secondary" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest">{lang === 'es' ? 'Contactar Soporte' : 'Contact Support'}</Button>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto border-t border-white/5 mt-24 pt-12 flex flex-col lg:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">© 2024 {t('brand.name', lang)} — {t('footer.copyright', lang)}</p>
            <div className="flex gap-12 text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
               <span>California Support</span>
               <span>Indigenous Language Bridge</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number, className?: string }> = ({ progress, className = '' }) => {
  return (
    <div className={`h-2 w-full bg-navy/5 rounded-full overflow-hidden ${className}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-gold"
      />
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-navy">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-navy/5 rounded-full">
              <X className="w-5 h-5 text-navy" />
            </button>
          </div>
          <div className="text-navy/70 leading-relaxed">
            {children}
          </div>
          <div className="mt-8">
             <Button variant="primary" fullWidth onClick={onClose}>Close</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
