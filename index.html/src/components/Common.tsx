import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, Mic, Languages, X, Scale, Sparkles } from 'lucide-react';

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

import { UserData } from '../types';
import { t } from '../lib/translations';
import { MixtecoSupportModal } from './MultilingualSupport';

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
  showHeader?: boolean;
  user?: UserData;
  updateUser?: (data: Partial<UserData>) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onBack, 
  title, 
  showHeader = true,
  user,
  updateUser
}) => {
  const [isMixModalOpen, setIsMixModalOpen] = React.useState(false);
  const [isAudioGuidancePlaying, setIsAudioGuidancePlaying] = React.useState(false);
  const lang = user?.language || 'en';

  const toggleAudioGuidance = () => {
    setIsAudioGuidancePlaying(!isAudioGuidancePlaying);
  };

  return (
    <div className={`min-h-screen bg-cream/50 flex flex-col font-sans ${user?.isSimplifiedMode ? 'text-lg' : ''}`}>
      {showHeader && (
        <header className="px-6 py-5 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-navy/5 sticky top-0 z-40">
          <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="p-2.5 hover:bg-navy/5 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-navy" />
                </button>
              )}
              <h1 className="text-xl font-black text-navy tracking-tight uppercase">
                {title || t('nav.legal_aid', lang)}
              </h1>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
               {/* Language Selector */}
               {updateUser && (
                 <select 
                   value={lang} 
                   onChange={(e) => updateUser({ language: e.target.value as any })}
                   className="text-[10px] font-bold uppercase tracking-widest bg-navy/5 px-2 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-gold outline-none cursor-pointer"
                 >
                   <option value="en">English</option>
                   <option value="es">Español</option>
                   <option value="mix">Mixteco ✨</option>
                   <option value="other">Other</option>
                 </select>
               )}

               {/* Logo / Brand Name */}
               <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-gradient-to-br from-navy to-deep-navy rounded-2xl shadow-lg shadow-navy/20 border border-white/5">
                  <div className="w-6 h-6 bg-gold rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">{t('brand.name', lang)}</span>
                    <span className="text-[8px] font-bold text-gold/80 uppercase tracking-widest leading-none mt-0.5">{t('brand.subtitle', lang)}</span>
                  </div>
               </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 px-6 py-8 mx-auto w-full max-w-lg relative">
        {(lang === 'mix' || lang === 'other') && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsMixModalOpen(true)}
            className="mb-6 p-4 bg-gold/10 border border-gold/20 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-gold/20 transition-all shadow-sm"
          >
            <div className="p-2 bg-gold rounded-full">
               <Info className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
               <p className="text-sm font-bold text-navy leading-tight">{t('mix.title', lang === 'mix' ? 'en' : lang)}</p>
               <p className="text-xs text-navy/60">{t('mix.desc', lang === 'mix' ? 'en' : lang)}</p>
            </div>
            <ChevronLeft className="w-4 h-4 text-navy/20 rotate-180" />
          </motion.div>
        )}

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>

        {/* Global Floating Actions for Language Support */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 pointer-events-none active:pointer-events-auto">
           {lang !== 'en' && (
              <Button 
                variant={isAudioGuidancePlaying ? 'secondary' : 'primary'} 
                size="sm" 
                className={`shadow-xl pointer-events-auto transition-all ${isAudioGuidancePlaying ? 'animate-pulse' : ''}`}
                onClick={toggleAudioGuidance}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-white ${isAudioGuidancePlaying ? 'animate-ping' : ''}`} />
                  <Mic className="w-4 h-4" /> {isAudioGuidancePlaying ? t('mix.audio_stop', lang) : t('common.btn.hear', lang)}
                </div>
              </Button>
           )}
        </div>
      </main>

      {(user && updateUser) && (
        <MixtecoSupportModal 
          isOpen={isMixModalOpen} 
          onClose={() => setIsMixModalOpen(false)} 
          user={user} 
          updateUser={updateUser} 
        />
      )}

      <footer className="py-12 px-6 text-center text-[11px] text-navy/40 leading-relaxed border-t border-navy/5 bg-white/40 mt-12">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="font-medium text-navy/60 mb-6 italic">
            {t('msg.available', lang)}
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <button className="font-bold border-b border-navy/10 pb-1 hover:text-navy transition-colors">{t('footer.disclaimer', lang)}</button>
            <button className="font-bold border-b border-navy/10 pb-1 hover:text-navy transition-colors">{t('footer.privacy', lang)}</button>
          </div>
          <p>{t('footer.mission', lang)}</p>
          <p className="font-bold text-navy/20">{t('footer.copyright', lang)}</p>
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
