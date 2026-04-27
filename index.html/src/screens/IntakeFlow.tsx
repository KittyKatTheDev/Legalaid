import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, ProgressBar, Modal, Badge, TTSButton } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { Info, Mic, ChevronRight, AlertCircle, TrendingDown, Clock, MicOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { t } from '../lib/translations';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

export const Intake: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [step, setStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const lang = user.language;
  
  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: lang === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => {
      // Find matching option
      const options = questions[step].options;
      const match = options.find(opt => 
        text.toLowerCase().includes(opt.toLowerCase()) || 
        opt.toLowerCase().includes(text.toLowerCase())
      );
      if (match) {
        setSelectedOption(match);
        setVoiceTranscript(`${t('voice.recognized', lang)}"${match}"`);
        setTimeout(() => {
          handleContinue();
          setVoiceTranscript("");
        }, 1500);
      } else {
        setVoiceTranscript(`${t('voice.searching', lang)}"${text}"...`);
        setTimeout(() => setVoiceTranscript(""), 3000);
      }
    }
  });

  const questions = [
    // ... same as before
    {
      q: t('intake.q1', lang),
      helper: t('intake.q1_helper', lang),
      options: [
        t('intake.q1_opt1', lang),
        t('intake.q1_opt2', lang),
        t('intake.q1_opt3', lang),
        t('intake.q1_opt4', lang),
        t('intake.q1_opt5', lang)
      ]
    },
    {
      q: t('intake.q2', lang),
      helper: t('intake.q2_helper', lang),
      options: [
        t('intake.q2_opt1', lang),
        t('intake.q2_opt2', lang),
        t('intake.q2_opt3', lang),
        t('intake.q2_opt4', lang)
      ]
    },
    {
      q: t('intake.q3', lang),
      helper: t('intake.q3_helper', lang),
      options: [
        t('intake.q3_opt1', lang),
        t('intake.q3_opt2', lang),
        t('intake.q3_opt3', lang),
        t('intake.q3_opt4', lang)
      ]
    },
    {
      q: t('intake.q4', lang),
      helper: t('intake.q4_helper', lang),
      options: [
        t('intake.q4_opt1', lang),
        t('intake.q4_opt2', lang),
        t('intake.q4_opt3', lang),
        t('intake.q4_opt4', lang),
        t('intake.q4_opt5', lang)
      ]
    }
  ];

  const handleContinue = (option?: string) => {
    const finalOption = option || selectedOption;
    if (!finalOption) return;

    if (step === 3) { // Q4 is the last step now
      const isComplex = finalOption !== t('intake.q4_opt1', lang);
      const isRenewal = user.caseType.includes('Renewals') || user.caseType === t('case.renewals', lang);
      
      let timeline = '12-18 months';
      const ct = user.caseType;
      if (ct.includes('Citizenship') || ct === t('case.naturalization', lang)) timeline = '6-12 months';
      else if (ct.includes('Green Card') || ct === t('case.greencard', lang)) timeline = '10-24 months';
      else if (ct.includes('Work Permit') || ct === t('case.workpermit', lang)) timeline = '3-7 months';
      else if (ct.includes('Asylum') || ct === t('case.asylum', lang)) timeline = '24-48 months';
      else if (ct.includes('Family') || ct === t('case.family', lang)) timeline = '12-36 months';
      else if (isRenewal) timeline = '8-14 months';

      updateUser({
        complexity: isComplex ? 'High' : 'Low',
        estimatedTimeline: timeline,
        caseFactors: [finalOption]
      });
    }

    setSelectedOption(null);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onNext('CASE_SUMMARY');
    }
  };

  return (
    <Layout 
      onBack={step === 0 ? onBack : () => { setSelectedOption(null); setStep(step - 1); }} 
      title={t('intake.title', lang)}
      user={user}
      updateUser={updateUser}
    >
      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <ProgressBar progress={((step + 1) / questions.length) * 100} />
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-xs shrink-0">
               {step + 1}
             </div>
             <h2 className="text-xl font-bold text-navy leading-tight flex-1">{questions[step].q}</h2>
             <TTSButton text={questions[step].q} lang={lang} />
          </div>
        </div>

        {voiceError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs text-red-700 font-medium">{voiceError}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          {questions[step].options.map((opt) => (
            <Card 
              key={opt} 
              onClick={() => { setSelectedOption(opt); handleContinue(opt); }} 
              className={`p-4 flex items-center justify-between transition-all ${selectedOption === opt ? 'border-gold bg-gold/5 shadow-md shadow-gold/10 ring-2 ring-gold/20' : 'hover:border-navy/20'}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === opt ? 'border-gold bg-gold' : 'border-navy/10'}`}>
                  {selectedOption === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={`font-bold text-sm ${selectedOption === opt ? 'text-navy' : 'text-navy/70'}`}>{opt}</span>
              </div>
              <div className="flex items-center gap-3">
                <TTSButton text={opt} lang={lang} />
                <ChevronRight className={`w-4 h-4 transition-colors ${selectedOption === opt ? 'text-gold' : 'text-navy/20'}`} />
              </div>
            </Card>
          ))}
        </div>

        <AnimatePresence>
          {(isListening || voiceTranscript) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-navy/5 rounded-2xl p-4 overflow-hidden border border-navy/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`p-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gold'}`}>
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-black tracking-widest text-navy/40">
                    {isListening ? t('common.listening', lang) : t('common.processing', lang)}
                  </p>
                  <p className="text-sm font-bold text-navy">
                    {voiceTranscript || transcript || t('common.say_answer', lang) }
                  </p>
                </div>
                {isListening && (
                  <div className="flex gap-0.5">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1 bg-navy/40 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="ghost" fullWidth onClick={() => setShowExplanation(true)}>
            <Info className="w-4 h-4 mr-2" /> {t('intake.explain', lang)}
          </Button>
          <Button 
            variant={isListening ? 'secondary' : 'ghost'} 
            fullWidth 
            onClick={toggle}
            className={isListening ? 'animate-pulse' : ''}
          >
            {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isListening 
              ? t('common.stop_voice', lang) 
              : t('intake.voice', lang)}
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={showExplanation} 
        onClose={() => setShowExplanation(false)} 
        title={t('intake.why_ask', lang)}
      >
        <p>{questions[step].helper}</p>
        <p className="mt-4">{t('intake.why_desc', lang)}</p>
      </Modal>
    </Layout>
  );
};

export const CaseSummary: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const isHigh = user.complexity === 'High';
  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full">
                 <Sparkles className="w-3 h-3 text-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold">{lang === 'es' ? 'Análisis de Caso' : 'Case Analysis'}</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('summary.header', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('summary.subheader', lang)} ({user.caseType})</p>
           </div>
           <div className="bg-navy p-6 rounded-2xl text-white flex items-center gap-4 shadow-xl">
              <Clock className="w-6 h-6 text-gold" />
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{lang === 'es' ? 'Tiempo Estimado' : 'Estimated Time'}</p>
                 <p className="text-lg font-black tracking-tighter uppercase">{user.estimatedTimeline || '8-14 months'}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2 space-y-8">
              <Card className="p-8 space-y-8 bg-white border-navy/5 shadow-premium">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-navy/20">{t('summary.case_type', lang)}</label>
                       <p className="text-xl font-bold text-navy uppercase tracking-tight">{user.caseType}</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-navy/20">{t('summary.complexity', lang)}</label>
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isHigh ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                          <p className={`text-xl font-black uppercase tracking-widest ${isHigh ? 'text-red-500' : 'text-green-600'}`}>
                             {isHigh ? t('summary.complexity_high', lang) : t('summary.complexity_low', lang)}
                          </p>
                       </div>
                    </div>
                 </div>

                 {user.caseFactors && user.caseFactors.length > 0 && (
                    <div className="pt-8 border-t border-navy/5 space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30">{t('summary.factors_title', lang)}</h4>
                       <div className="flex flex-wrap gap-2">
                          {user.caseFactors.map(f => (
                             <Badge key={f} variant="outline" className="text-navy/60 border-navy/10 py-1.5 px-4 rounded-xl italic font-bold">
                                {f}
                             </Badge>
                          ))}
                       </div>
                    </div>
                 )}
              </Card>

              <div className="p-10 rounded-[3rem] bg-navy text-white space-y-6 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-white/10 rounded-2xl">
                       {isHigh ? <TrendingDown className="w-6 h-6 text-red-400 rotate-180" /> : <TrendingDown className="w-6 h-6 text-green-400" />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter">{t('summary.recommendation', lang)}</h3>
                       <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{lang === 'es' ? 'Plan de Acción Sugerido' : 'Suggested Action Plan'}</p>
                    </div>
                 </div>
                 
                 <p className="text-lg font-medium italic leading-relaxed text-white/80 relative z-10">
                    {isHigh ? t('summary.complex_advisor_msg', lang) : t('summary.low_tip', lang)}
                 </p>

                 <div className="pt-6 relative z-10">
                    <Button 
                       fullWidth 
                       size="lg" 
                       onClick={() => onNext(isHigh ? 'PREMIUM' : 'DASHBOARD')}
                       className={`${isHigh ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-gold hover:bg-gold-light'} h-16 rounded-2xl shadow-xl text-lg font-black uppercase tracking-widest transform hover:scale-[1.02] transition-all`}
                    >
                       {isHigh ? t('summary.btn_lawyer', lang) : t('summary.btn_advisor', lang)}
                    </Button>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <Card className="p-8 space-y-6 bg-[#F8F9FA] border-navy/5">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30">{lang === 'es' ? 'Próximos Pasos' : 'Next Steps'}</h4>
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="flex gap-4 items-center">
                          <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center text-[10px] font-black text-navy/20">
                             {i}
                          </div>
                          <span className="text-xs font-bold text-navy/60 uppercase tracking-tight">
                             {t(`roadmap.step${i}.title` as any, lang)}
                          </span>
                       </div>
                    ))}
                 </div>
              </Card>

              <div className="p-8 space-y-4 border-2 border-dashed border-navy/5 rounded-3xl">
                 <p className="text-[10px] text-navy/30 italic leading-relaxed">
                    * {lang === 'es' ? 'La línea de tiempo es una estimación basada en promedios del gobierno.' : 'The timeline is an estimate based on government averages.'}
                 </p>
                 <Button variant="ghost" fullWidth className="text-[10px] font-black uppercase tracking-widest text-navy/40" onClick={() => onNext('DASHBOARD')}>
                    {t('btn.continue', lang)}
                 </Button>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};
