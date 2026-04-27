import React from 'react';
import { Button, Card, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  ShieldCheck, 
  Globe, 
  BrainCircuit, 
  Users, 
  Hand, 
  MessageSquare, 
  Mic, 
  X, 
  ShieldAlert, 
  Scale,
  FileText,
  MessageCircle,
  Gavel,
  Bell,
  ListChecks,
  UserCheck,
  Trophy,
  Sparkles,
  HelpCircle,
  Scan
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { t } from '../lib/translations';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

export const Landing: React.FC<ScreenProps> = ({ onNext, user, updateUser }) => {
  const [showChat, setShowChat] = React.useState(false);
  const lang = user.language;

  return (
    <Layout showHeader={false} user={user} updateUser={updateUser}>
      <div className="space-y-12 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white rounded-3xl flex flex-col items-center justify-center border-2 border-navy relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 w-full h-1/2 bg-navy flex items-center justify-center">
               <Scale className="text-gold w-10 h-10" />
            </div>
            <div className="absolute bottom-0 w-full h-1/2 bg-white flex items-center justify-center">
               <span className="text-navy font-black text-xs leading-none text-center">LEGAL<br/>AID</span>
            </div>
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-navy tracking-tight leading-tight uppercase">
              {t('nav.legal_aid', lang)}<br/>
              <span className="text-sm font-bold text-gold tracking-[0.2em]">{t('brand.name', lang)} {t('brand.subtitle', lang)}</span>
            </h1>
            <p className="text-navy/60 text-lg font-medium">{t('onboarding.welcome', lang)}</p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button fullWidth size="lg" onClick={() => onNext('SIGNUP')}>{t('btn.start', lang)}</Button>
            <Button fullWidth variant="outline" size="lg" onClick={() => onNext('PREMIUM')}>{t('onboarding.premium_btn', lang)}</Button>
          </div>
        </div>

        {/* Info Section: How it works */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-navy/30">{t('onboarding.how_title', lang)}</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card className="flex items-start gap-4 p-5">
              <div className="p-3 bg-gold/10 rounded-xl shrink-0"><BrainCircuit className="w-6 h-6 text-gold" /></div>
              <div>
                <h4 className="font-bold text-navy">{t('onboarding.how1_title', lang)}</h4>
                <p className="text-xs text-navy/60 leading-relaxed">{t('onboarding.how1_desc', lang)}</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4 p-5">
              <div className="p-3 bg-gold/10 rounded-xl shrink-0"><ShieldCheck className="w-6 h-6 text-gold" /></div>
              <div>
                <h4 className="font-bold text-navy">{t('onboarding.how2_title', lang)}</h4>
                <p className="text-xs text-navy/60 leading-relaxed">{t('onboarding.how2_desc', lang)}</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4 p-5">
              <div className="p-3 bg-gold/10 rounded-xl shrink-0"><Globe className="w-6 h-6 text-gold" /></div>
              <div>
                <h4 className="font-bold text-navy">{t('onboarding.how3_title', lang)}</h4>
                <p className="text-xs text-navy/60 leading-relaxed">{t('onboarding.how3_desc', lang)}</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Real Stories Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-navy/30">{t('onboarding.voices_title', lang)}</h3>
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-navy/5 border-none p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold">RM</div>
                  <div className="leading-none">
                    <p className="text-xs font-bold text-navy">Ricardo M.</p>
                    <p className="text-[10px] text-navy/40 font-medium">Ventura County</p>
                  </div>
                </div>
                <p className="text-xs text-navy/70 leading-relaxed italic">
                  {t('story.ricardo', lang)}
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gold/5 border-none p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold">ES</div>
                  <div className="leading-none">
                    <p className="text-xs font-bold text-navy">Elena S.</p>
                    <p className="text-[10px] text-navy/40 font-medium">Oxnard</p>
                  </div>
                </div>
                <p className="text-xs text-navy/70 leading-relaxed italic">
                  {t('story.elena', lang)}
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-navy/5 border-none p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold">RG</div>
                  <div className="leading-none">
                    <p className="text-xs font-bold text-navy">Rosa G.</p>
                    <p className="text-[10px] text-navy/40 font-medium">Santa Paula</p>
                  </div>
                </div>
                <p className="text-xs text-navy/70 leading-relaxed italic">
                  {t('story.rosa', lang)}
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Feature Teasers */}
        <section className="space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy/30">{t('onboarding.features_title', lang)}</h3>
              <button 
                onClick={() => onNext('TUTORIAL')}
                className="text-[10px] font-bold text-gold underline px-2 py-1 bg-gold/5 rounded-lg active:bg-gold/10 transition-colors"
              >
                {t('common.view_tutorial', lang)}
              </button>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <Card onClick={() => onNext('AI_GUIDE')} className="p-5 flex flex-col gap-3 bg-navy text-white col-span-2 shadow-xl border-none relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <Sparkles className="w-16 h-16 text-gold" />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold/20 rounded-2xl">
                       <Sparkles className="w-7 h-7 text-gold" />
                    </div>
                    <div className="leading-tight">
                       <span className="text-base font-black uppercase tracking-tight">{t('onboarding.ai_guide_title', lang)}</span>
                       <p className="text-xs text-white/60 font-medium italic">{t('onboarding.ai_guide_desc', lang)}</p>
                    </div>
                 </div>
              </Card>
              <Card onClick={() => onNext('PROGRESS_SCORE')} className="p-4 flex flex-col gap-3">
                 <Trophy className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_progress', lang)}</span>
              </Card>
              <Card onClick={() => onNext('SMART_ALERTS')} className="p-4 flex flex-col gap-3">
                 <Bell className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_alerts', lang)}</span>
              </Card>
              <Card onClick={() => onNext('VOICE_INPUT')} className="p-4 flex flex-col gap-3">
                 <Mic className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_voice', lang)}</span>
              </Card>
              <Card onClick={() => onNext('DOCUMENT_FLOW')} className="p-4 flex flex-col gap-3">
                 <Scan className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_scan', lang)}</span>
              </Card>
              <Card onClick={() => onNext('CHECKLIST')} className="p-4 flex flex-col gap-3">
                 <ListChecks className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_checklist', lang)}</span>
              </Card>
              <Card onClick={() => onNext('ROADMAP')} className="p-4 flex flex-col gap-3">
                 <Globe className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_roadmap', lang)}</span>
              </Card>
              <Card onClick={() => onNext('ELIGIBILITY_CHECK')} className="p-4 flex flex-col gap-3">
                 <UserCheck className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_eligibility', lang)}</span>
              </Card>
              <Card onClick={() => onNext('FORM_AUTOFILL')} className="p-4 flex flex-col gap-3">
                 <FileText className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_autofill', lang)}</span>
              </Card>
              <Card onClick={() => onNext('LAWYER_CHAT')} className="p-4 flex flex-col gap-3 border-gold/20 bg-gold/5">
                 <div className="flex justify-between items-start">
                    <MessageCircle className="w-6 h-6 text-gold" />
                    <span className="bg-gold text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">{t('onboarding.feat_lawyer_free', lang)}</span>
                 </div>
                 <span className="text-sm font-bold">{t('onboarding.feat_lawyer', lang)}</span>
              </Card>
              <Card onClick={() => onNext('INTERVIEW_SIMULATOR')} className="p-4 flex flex-col gap-3">
                 <Mic className="w-6 h-6 text-navy" />
                 <span className="text-sm font-bold">{t('onboarding.feat_interview', lang)}</span>
              </Card>
              <Card onClick={() => onNext('KNOW_YOUR_RIGHTS')} className="p-4 flex flex-col gap-3 border-red-100 bg-red-50/30">
                 <ShieldAlert className="w-6 h-6 text-red-500" />
                 <span className="text-sm font-bold text-red-700">{t('onboarding.feat_rights', lang)}</span>
              </Card>
              <Card onClick={() => onNext('LAWYER_AI')} className="p-4 flex flex-col gap-3 col-span-2 border-navy border-dashed bg-navy/5">
                 <div className="flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-navy" />
                    <span className="text-sm font-bold text-navy uppercase tracking-tight">{t('onboarding.feat_diagnostic', lang)}</span>
                 </div>
              </Card>
           </div>
        </section>

        {/* Trust Badges */}
        <div className="flex justify-center gap-8 py-4 border-t border-navy/5">
           <Users className="w-8 h-8 text-navy/10" />
           <ShieldCheck className="w-8 h-8 text-navy/10" />
           <BrainCircuit className="w-8 h-8 text-navy/10" />
        </div>
      </div>

      {/* Floating Chat Assistant Overlay */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-navy/5 overflow-hidden flex flex-col h-[400px]"
            >
              <div className="bg-navy p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-bold text-sm">{t('onboarding.chat_guide', lang)}</span>
                </div>
                <button onClick={() => setShowChat(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="bg-navy/5 p-3 rounded-2xl rounded-tl-none">
                  <p className="text-xs text-navy leading-relaxed">
                    {t('onboarding.chat_msg', lang)}
                  </p>
                </div>
                <div className="space-y-2">
                   <button className="w-full text-left p-2.5 bg-gold/10 rounded-xl text-[10px] font-bold text-navy" onClick={() => onNext('FORM_AUTOFILL')}>"{t('onboarding.chat_q1', lang)}"</button>
                   <button className="w-full text-left p-2.5 bg-gold/10 rounded-xl text-[10px] font-bold text-navy" onClick={() => onNext('LAWYER_CHAT')}>"{t('onboarding.chat_q2', lang)}"</button>
                   <button className="w-full text-left p-2.5 bg-gold/10 rounded-xl text-[10px] font-bold text-navy" onClick={() => onNext('KNOW_YOUR_RIGHTS')}>"{t('onboarding.chat_q3', lang)}"</button>
                </div>
              </div>
              <div className="p-3 border-t border-navy/5">
                <input type="text" placeholder={t('onboarding.chat_placeholder', lang)} className="w-full p-2 text-xs border border-navy/10 rounded-lg outline-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:scale-105 active:scale-95 transition-all"
        >
          {showChat ? <X className="text-white" /> : <MessageSquare className="text-white" />}
        </button>
      </div>
    </Layout>
  );
};

export const Signup: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [activeField, setActiveField] = React.useState<'firstName' | 'lastName' | null>(null);
  const lang = user.language;

  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: lang === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => {
      if (activeField) {
        setFormData(prev => ({ ...prev, [activeField]: text }));
        setActiveField(null);
      }
    }
  });

  return (
    <Layout onBack={onBack} title={t('auth.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('auth.title', lang)}</h2>
          <p className="text-navy/60">{t('auth.subtitle', lang)}</p>
        </div>

        {voiceError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs text-red-700 font-medium">{voiceError}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy/70">{t('auth.first_name', lang)}</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-4 pr-12 rounded-xl border border-navy/10 bg-white" 
                placeholder="Juan" 
                value={activeField === 'firstName' ? transcript || formData.firstName : formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <button 
                onClick={() => { setActiveField('firstName'); toggle(); }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${activeField === 'firstName' && isListening ? 'bg-red-500 text-white animate-pulse' : 'text-navy/20 hover:text-navy'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy/70">{t('auth.last_name', lang)}</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-4 pr-12 rounded-xl border border-navy/10 bg-white" 
                placeholder="Rodriguez" 
                value={activeField === 'lastName' ? transcript || formData.lastName : formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <button 
                onClick={() => { setActiveField('lastName'); toggle(); }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${activeField === 'lastName' && isListening ? 'bg-red-500 text-white animate-pulse' : 'text-navy/20 hover:text-navy'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy/70">{t('auth.email', lang)}</label>
            <input type="email" className="w-full p-4 rounded-xl border border-navy/10 bg-white" placeholder="juan.rod@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-navy/70">{t('auth.password', lang)}</label>
            <input type="password" className="w-full p-4 rounded-xl border border-navy/10 bg-white" placeholder="••••••••" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button fullWidth size="lg" onClick={() => onNext('LANGUAGE')}>{t('btn.create_account', lang)}</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-cream px-2 text-navy/40">Or</span></div>
          </div>
          <Button fullWidth variant="outline" size="lg" onClick={() => onNext('LANGUAGE')}>{t('btn.google', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};

export const LanguageSelection: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => (
  <Layout onBack={onBack} title={t('settings.language', user.language)} user={user} updateUser={updateUser}>
    <div className="space-y-8 py-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-navy">{t('settings.language', user.language)}</h2>
        <p className="text-navy/60">{t('onboarding.lang_select_desc', user.language)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'en', label: 'English', sub: 'Default' },
          { id: 'es', label: 'Español', sub: 'Native Support' },
          { id: 'mix', label: 'Mixteco', sub: 'Support Assistance ✨' },
          { id: 'other', label: 'Other', sub: 'Request Support' }
        ].map((l) => (
          <Card 
            key={l.id}
            onClick={() => updateUser({ language: l.id as any })} 
            className={`relative overflow-hidden group border-2 transition-all ${user.language === l.id ? 'border-gold bg-gold/5 shadow-lg' : 'border-navy/5'}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xl font-black text-navy">{l.label}</span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40">{l.sub}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${user.language === l.id ? 'border-gold bg-gold' : 'border-navy/10'}`}>
                {user.language === l.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4 space-y-4">
        <div className="p-4 bg-navy/5 rounded-2xl flex items-center justify-between border border-navy/10">
          <div className="text-left">
            <span className="text-sm font-bold text-navy">{t('settings.simple_mode', user.language)}</span>
            <p className="text-[10px] text-navy/40">{t('settings.simple_mode_desc', user.language)}</p>
          </div>
          <button 
            onClick={() => updateUser({ isSimplifiedMode: !user.isSimplifiedMode })}
            className={`w-12 h-6 rounded-full transition-colors relative ${user.isSimplifiedMode ? 'bg-gold' : 'bg-navy/10'}`}
          >
            <motion.div 
              animate={{ x: user.isSimplifiedMode ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
        
        <Button fullWidth size="lg" onClick={() => onNext('CASE_TYPE')}>{t('btn.continue', user.language)}</Button>
      </div>
    </div>
  </Layout>
);

export const CaseTypeSelection: React.FC<ScreenProps> = ({ onNext, onBack, updateUser, user }) => {
  const lang = user.language;
  const cases = [
    { id: 'naturalization', label: t('case.naturalization', lang) },
    { id: 'greencard', label: t('case.greencard', lang) },
    { id: 'workpermit', label: t('case.workpermit', lang) },
    { id: 'asylum', label: t('case.asylum', lang) },
    { id: 'family', label: t('case.family', lang) },
    { id: 'renewals', label: t('case.renewals', lang) }
  ];

  return (
    <Layout onBack={onBack} title={t('onboarding.case_title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('onboarding.case_title', lang)}</h2>
          <p className="text-navy/60">{t('onboarding.case_desc', lang)}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {cases.map((type) => (
            <Card key={type.id} onClick={() => {
              updateUser({ caseType: type.label });
              onNext('INTAKE');
            }} className="py-4 px-5">
              <span className="font-medium text-navy">{type.label}</span>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};
