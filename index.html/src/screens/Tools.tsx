import React, { useState } from 'react';
import { Button, Card, Layout, ProgressBar } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  MessageSquare, 
  Send, 
  Languages, 
  Sparkles, 
  Phone, 
  Users, 
  Plus, 
  Trash2,
  ChevronRight,
  HelpCircle,
  Brain,
  Mic,
  MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const AIAssistant: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [query, setQuery] = useState("");
  const lang = user.language;
  const isSimple = user.isSimplifiedMode;

  const examples = [
    t('ai.ex1', lang),
    t('ai.ex2', lang),
    t('ai.ex3', lang)
  ];
  
  const welcomeMsg = isSimple 
    ? t('simple.welcome', lang) 
    : t('ai.welcome', lang);

  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: user.language === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => {
      setQuery(text);
    }
  });

  return (
    <Layout onBack={onBack} title={t('ai.title', lang)} user={user} updateUser={updateUser}>
      <div className="flex flex-col h-[75vh] space-y-6 py-4">
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          {voiceError && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 mb-4"
             >
               <HelpCircle className="w-5 h-5 text-red-500 shrink-0" />
               <p className="text-xs text-red-700 font-medium">{voiceError}</p>
             </motion.div>
          )}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shrink-0">
               <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-navy/5">
              <p className="text-sm text-navy leading-relaxed">
                {welcomeMsg}
              </p>
            </div>
          </div>

          <div className="space-y-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-4">{t('ai.suggestions', lang)}</span>
             {examples.map((ex) => (
                <button 
                  key={ex} 
                  onClick={() => setQuery(ex.replace(/“|”/g, ''))}
                  className="w-full text-left p-4 bg-navy/5 rounded-2xl text-xs font-bold text-navy hover:bg-navy/10 transition-colors"
                >
                  {ex}
                </button>
             ))}
          </div>
        </div>

        <div className="space-y-4">
           {isListening && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-navy/5 p-3 rounded-xl flex items-center gap-3 border border-navy/10"
             >
               <div className="flex gap-1">
                 {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-navy/40 rounded-full"
                    />
                 ))}
               </div>
               <p className="text-xs text-navy/60 italic">"{transcript || t('common.listening', lang)}"</p>
             </motion.div>
           )}
           <div className="relative">
              <input 
                type="text" 
                value={query || transcript}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ai.placeholder', lang)} 
                className="w-full p-4 pr-24 rounded-2xl border border-navy/10 bg-white shadow-sm focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button 
                  onClick={toggle}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-navy/5 text-navy hover:bg-navy/10'}`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center shadow-lg shadow-navy/20">
                  <Send className="w-5 h-5" />
                </button>
              </div>
           </div>
           <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1"><Languages className="w-4 h-4 mr-2" /> {t('ai.translate', lang)}</Button>
              <Button variant="ghost" size="sm" className="flex-1"><Brain className="w-4 h-4 mr-2" /> {t('ai.explain', lang)}</Button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export const WhatsAppConnect: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('whatsapp.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="text-center space-y-4">
           <div className="mx-auto w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center">
              <Phone className="w-10 h-10 text-[#25D366]" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold text-navy">{t('whatsapp.subtitle', lang)}</h2>
              <p className="text-navy/60">{t('whatsapp.desc', lang)}</p>
           </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-medium text-navy/70">{t('whatsapp.label', lang)}</label>
           <input type="tel" className="w-full p-4 rounded-xl border border-navy/10 bg-white" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="space-y-4">
           <Button fullWidth onClick={() => onNext('DASHBOARD')} className="bg-[#25D366] hover:bg-[#25D366]/90 border-none">
              {t('whatsapp.btn.connect', lang)}
           </Button>
           <p className="text-[10px] text-center text-navy/40">{t('whatsapp.disclaimer', lang)}</p>
        </div>
      </div>
    </Layout>
  );
};

export const FamilyMode: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const family = [
    { name: 'Maria Rodriguez', relation: t('family.relation_spouse', lang), cases: 1 },
    { name: 'Juan Jr.', relation: t('family.relation_child', lang), cases: 1 },
  ];

  return (
    <Layout onBack={onBack} title={t('family.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('family.subtitle', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('family.desc', lang)}</p>
        </div>

        <div className="space-y-3">
          {family.map((member) => (
            <Card key={member.name} className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold">
                    {member.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-sm">{member.name}</h5>
                    <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">{member.relation} • {member.cases} {t('family.meta', lang)}</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-navy/20" />
            </Card>
          ))}
          
          <button className="w-full p-4 border-2 border-dashed border-navy/10 rounded-2xl flex items-center justify-center gap-2 text-navy/40 hover:text-navy hover:border-navy/20 transition-all">
             <Plus className="w-5 h-5" />
             <span className="font-bold text-sm">{t('family.btn.add', lang)}</span>
          </button>
        </div>

        <div className="pt-4">
           <Button variant="outline" fullWidth onClick={onBack}>{t('nav.back', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};

export const NextSteps: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('nextsteps.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('nextsteps.subtitle', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('nextsteps.desc', lang)}</p>
        </div>

        <div className="space-y-4">
           <Card className="bg-navy text-white space-y-3">
              <h4 className="font-bold">{t('nextsteps.card1.title', lang)}</h4>
              <p className="text-sm text-white/70 leading-relaxed">
                {t('nextsteps.card1.desc', lang)}
              </p>
           </Card>

           <Card className="space-y-3">
              <h4 className="font-bold text-navy">{t('nextsteps.card2.title', lang)}</h4>
              <p className="text-sm text-navy/60 leading-relaxed">
                {t('nextsteps.card2.desc', lang)}
              </p>
           </Card>

           <Card className="space-y-3 border-gold/20 bg-gold/5">
              <h4 className="font-bold text-navy">{t('nextsteps.card3.title', lang)}</h4>
              <p className="text-sm text-navy/60 leading-relaxed">
                {t('nextsteps.card3.desc', lang)}
              </p>
           </Card>
        </div>

        <Button fullWidth onClick={onBack}>{t('nav.back', lang)}</Button>
      </div>
    </Layout>
  );
};
