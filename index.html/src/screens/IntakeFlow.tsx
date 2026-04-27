import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, ProgressBar, Modal, Badge } from '../components/Common';
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
    }
  ];

  const handleContinue = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onNext('CASE_SUMMARY');
    }
  };

  return (
    <Layout 
      onBack={step === 0 ? onBack : () => setStep(step - 1)} 
      title={t('intake.title', lang)}
      user={user}
      updateUser={updateUser}
    >
      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <ProgressBar progress={((step + 1) / questions.length) * 100} />
          <h2 className="text-2xl font-bold text-navy leading-tight">{questions[step].q}</h2>
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
            <Card key={opt} onClick={handleContinue} className="p-4 flex items-center justify-between group">
              <span className="font-medium text-navy">{opt}</span>
              <ChevronRight className="w-5 h-5 text-navy/20 group-hover:text-navy" />
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
  return (
    <Layout onBack={onBack} title={t('summary.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('summary.header', lang)}</h2>
          <p className="text-navy/60">{t('summary.subheader', lang)} ({user.caseType})</p>
        </div>

        <Card className="space-y-4 bg-navy text-white border-transparent">
          <div className="flex items-center justify-between">
            <span className="text-navy-100 text-sm">{t('summary.case_type', lang)}</span>
            <Badge>{user.caseType}</Badge>
          </div>
          <div className="flex items-center justify-between">
             <span className="text-navy-100 text-sm">{t('summary.complexity', lang)}</span>
             <div className="flex items-center gap-1.5 text-gold">
                <TrendingDown className="w-4 h-4" />
                <span className="font-bold">{t('summary.complexity_low', lang)}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 pt-2 text-xs text-white/60">
             <Clock className="w-3 h-3" /> {t('summary.est_process', lang)}
          </div>
        </Card>

        <div className="space-y-6 py-4 border-t border-navy/5">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-xl">
                 <AlertCircle className="w-6 h-6 text-gold" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-navy">{t('summary.recommendation', lang)}</h4>
                 <p className="text-sm text-navy/60">{t('summary.recommendation_desc', lang)}</p>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <Button fullWidth onClick={() => onNext('DASHBOARD')}>{t('btn.continue', lang)}</Button>
           <Button variant="secondary" fullWidth onClick={() => onNext('PREMIUM')}>{t('dash.upgrade_btn', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};
