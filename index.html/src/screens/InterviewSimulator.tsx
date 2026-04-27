import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, ProgressBar, Badge } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Settings,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../lib/translations';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

export const InterviewSimulator: React.FC<ScreenProps> = ({ onNext, onBack, user }) => {
  const lang = user.language;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [evaluation, setEvaluation] = useState<{ status: 'correct' | 'needs_work', tips: string } | null>(null);

  const INTERVIEW_QUESTIONS = [
    {
      id: 1,
      question: t('interview.q1', lang),
      answer: t('interview.q1_ans', lang),
      category: t('interview.cat1_title', lang)
    },
    {
      id: 2,
      question: t('interview.q2', lang),
      answer: t('interview.q2_ans', lang),
      category: t('interview.cat1_title', lang)
    },
    {
      id: 3,
      question: t('interview.q3', lang),
      answer: t('interview.q3_ans', lang),
      category: t('interview.cat2_title', lang)
    },
    {
      id: 4,
      question: t('interview.q4', lang),
      answer: t('interview.q4_ans', lang),
      category: t('interview.cat2_title', lang)
    }
  ];

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIdx];

  const { isListening, toggle, transcript } = useVoiceInput({
    lang: lang === 'es' || lang === 'mix' ? 'es-ES' : 'en-US',
    onResult: (text) => {
      setTranscriptText(text);
      // Simple evaluation logic
      const isCorrect = text.toLowerCase().includes(currentQuestion.answer.toLowerCase());
      setEvaluation({
        status: isCorrect ? 'correct' : 'needs_work',
        tips: isCorrect 
          ? t('interview.feedback_correct', lang)
          : t('interview.feedback_needs_work', lang).replace('{ans}', currentQuestion.answer)
      });
      setShowFeedback(true);
    }
  });

  const startSession = () => setSessionStarted(true);

  const nextQuestion = () => {
    if (currentQuestionIdx < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setShowFeedback(false);
      setTranscriptText("");
      setEvaluation(null);
    } else {
      onNext('DASHBOARD');
    }
  };

  if (!sessionStarted) {
    return (
      <Layout onBack={onBack} title={t('interview.title', lang)}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
          <div className="w-24 h-24 bg-gold/10 rounded-3xl flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gold/20 rounded-3xl animate-ping" />
            <Mic className="w-10 h-10 text-gold relative z-10" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">{t('interview.welcome_title', lang)}</h2>
            <p className="text-navy/60 max-w-xs mx-auto">
              {t('interview.welcome_desc', lang)}
            </p>
          </div>

          <div className="w-full grid grid-cols-1 gap-4">
            <Card className="flex items-center gap-4 text-left p-4">
              <div className="p-2 bg-navy/5 rounded-xl"><MessageSquare className="w-5 h-5 text-navy" /></div>
              <div>
                <h4 className="font-bold text-sm">{t('interview.cat1_title', lang)}</h4>
                <p className="text-[10px] text-navy/40">{t('interview.cat1_desc', lang)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 ml-auto" />
            </Card>
            <Card className="flex items-center gap-4 text-left p-4">
              <div className="p-2 bg-navy/5 rounded-xl"><Settings className="w-5 h-5 text-navy" /></div>
              <div>
                <h4 className="font-bold text-sm">{t('interview.cat2_title', lang)}</h4>
                <p className="text-[10px] text-navy/40">{t('interview.cat2_desc', lang)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 ml-auto" />
            </Card>
          </div>

          <Button fullWidth size="lg" onClick={startSession} className="shadow-xl shadow-navy/20">
            {t('interview.start_btn', lang)}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onBack={onBack} title={t('interview.title', lang)}>
      <div className="space-y-6 py-4 flex flex-col min-h-[80vh]">
        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-navy/5 shadow-sm">
           <div className="flex items-center gap-2">
              <Badge>{currentQuestion.category}</Badge>
              <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">{t('interview.current_q', lang)} {currentQuestionIdx + 1}/{INTERVIEW_QUESTIONS.length}</span>
           </div>
           <button onClick={() => {}} className="p-2 hover:bg-navy/5 rounded-full">
              <Volume2 className="w-5 h-5 text-navy/40" />
           </button>
        </div>

        <div className="flex flex-col items-center gap-4 py-8">
           <div className="relative">
              <div className="w-24 h-24 bg-navy rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                 <img 
                   src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
                   alt="Officer" 
                   className="w-full h-full object-cover opacity-80"
                 />
              </div>
              <AnimatePresence>
                {isListening && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-2 -right-2 bg-red-500 p-2 rounded-full border-4 border-white shadow-lg"
                  >
                    <Mic className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           <div className="text-center space-y-2 max-w-xs">
              <h3 className="text-xl font-bold text-navy leading-tight">
                "{currentQuestion.question}"
              </h3>
              <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest">
                {isListening ? t('interview.listening', lang) : t('interview.waiting', lang)}
              </p>
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-end gap-6 relative">
           
           <AnimatePresence>
              {(isListening && transcript) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-navy/5 p-4 rounded-2xl text-center italic text-navy/60 font-medium"
                >
                  "{transcript}"
                </motion.div>
              )}

              {showFeedback && evaluation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className={`border-none shadow-lg ${evaluation.status === 'correct' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                    <div className="flex items-start gap-4">
                       <div className="bg-white/20 p-2 rounded-xl">
                          {evaluation.status === 'correct' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-bold">{t('interview.feedback_title', lang)}</h4>
                          <p className="text-xs text-white/90 leading-relaxed font-medium">"{transcriptText}"</p>
                       </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-white border-navy/5 shadow-soft p-4 flex gap-4 items-start">
                     <div className="p-2 bg-gold/10 rounded-xl"><Sparkles className="w-6 h-6 text-gold" /></div>
                     <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-navy/30">{t('interview.coach_tip', lang)}</span>
                        <p className="text-xs text-navy/70 leading-relaxed">{evaluation.tips}</p>
                     </div>
                  </Card>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="flex flex-col gap-4">
              {showFeedback ? (
                <Button fullWidth size="lg" onClick={nextQuestion}>
                   {t('interview.next_btn', lang)} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  {isListening && (
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [8, 24, 8] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 bg-navy rounded-full shadow-sm shadow-navy/20"
                        />
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={toggle}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                      isListening ? 'bg-navy scale-110' : 'bg-gold shadow-gold/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                  </button>
                  <p className="text-xs font-bold text-navy/40">
                    {isListening ? t('interview.stop_mic', lang) : t('interview.start_mic', lang)}
                  </p>
                </div>
              )}
              
              {!isListening && !showFeedback && (
                <button 
                  onClick={() => setShowFeedback(true)} 
                  className="text-xs font-bold text-navy/40 hover:text-navy underline underline-offset-4 decoration-navy/10 py-2"
                >
                  {t('interview.type_btn', lang)}
                </button>
              )}
           </div>
        </div>
      </div>
    </Layout>
  );
};
