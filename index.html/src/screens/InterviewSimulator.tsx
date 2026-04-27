import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Volume2,
  Clock,
  Shield,
  Zap,
  AlertTriangle,
  Calendar,
  Frown,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../lib/translations';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { 
  getQuestionBank, 
  COMMON_MISTAKES, 
  InterviewCaseType, 
  InterviewMode, 
  InterviewQuestion,
  InterviewTone
} from '../lib/interviewData';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

type SimulatorState = 'WIZARD_MODE' | 'WIZARD_CASE' | 'MISTAKES' | 'PRACTICE' | 'RESULTS';

export const InterviewSimulator: React.FC<ScreenProps> = ({ onNext, onBack, user }) => {
  const lang = user.language;
  const [viewState, setViewState] = useState<SimulatorState>('WIZARD_MODE');
  const [mode, setMode] = useState<InterviewMode>('confidence');
  const [caseType, setCaseType] = useState<InterviewCaseType>('green_card');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [evaluation, setEvaluation] = useState<{ status: 'correct' | 'warning' | 'needs_work', tips: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [sessionTone, setSessionTone] = useState<InterviewTone>('neutral');
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<InterviewQuestion | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestions = questions;
  const currentQuestion = isFollowUp && followUpQuestion ? followUpQuestion : currentQuestions[currentIdx];

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const handleVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = handleVoices;
    handleVoices();
  }, []);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang === 'en' ? 'en-US' : 'es-MX';
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    
    // Prioritize natural sounding voices
    const preferredVoice = voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').includes(targetLang.toLowerCase()) && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.toLowerCase().replace('_', '-').includes(targetLang.toLowerCase().split('-')[0]));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = targetLang;
    
    // Add tone variation and human-like imperfection
    if (mode === 'real') {
      if (sessionTone === 'skeptical') {
        utterance.pitch = 0.85;
        utterance.rate = 0.9;
        utterance.volume = 0.9;
      } else if (sessionTone === 'rushed') {
        utterance.pitch = 1.1;
        utterance.rate = 1.3;
        utterance.volume = 1.0;
      } else {
        utterance.pitch = 0.95 + Math.random() * 0.1;
        utterance.rate = 1.0 + Math.random() * 0.05;
      }
    } else {
      // Welcoming practice voice
      utterance.pitch = 1.08;
      utterance.rate = 0.92;
      utterance.volume = 1.0;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [lang, mode, sessionTone, availableVoices]);

  const [isTyping, setIsTyping] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    processAnswer(manualInput);
    setIsTyping(false);
    setManualInput("");
  };

  const processAnswer = (text: string) => {
    setTranscriptText(text);
    setIsTimerActive(false);
    
    const keywords = currentQuestion?.expectedKeywords || [];
    const matchedKeywords = keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
    const isCorrect = matchedKeywords.length >= Math.ceil(keywords.length / 2);
    const isTooShort = text.split(' ').length < 3;
    
    let status: 'correct' | 'warning' | 'needs_work' = 'correct';
    let tips = t('interview.feedback_clear', lang);

    if (!isCorrect) {
      status = 'needs_work';
      tips = t('interview.feedback_needs_work', lang).replace('{ans}', keywords[0] || '...');
    } else if (isTooShort) {
      status = 'warning';
      tips = t('interview.feedback_short', lang);
    }

    setEvaluation({ status, tips });
    setShowFeedback(true);
  };

  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: lang === 'es' || lang === 'mix' ? 'es-MX' : 'en-US',
    onResult: (text) => {
      processAnswer(text);
    }
  });

  useEffect(() => {
    if (viewState === 'PRACTICE' && isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      if (!showFeedback) {
        setEvaluation({ status: 'needs_work', tips: t('interview.feedback_needs_work', lang).replace('{ans}', '...') });
        setShowFeedback(true);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState, isTimerActive, timeLeft, showFeedback, lang]);

  const startSimulation = () => {
    const bank = getQuestionBank(caseType, lang);
    setQuestions(bank);
    setViewState('PRACTICE');
    setCurrentIdx(0);
    resetQuestionState(bank[0]);
  };

  const resetQuestionState = (question: InterviewQuestion) => {
    setShowFeedback(false);
    setTranscriptText("");
    setEvaluation(null);
    setTimeLeft(mode === 'real' ? 15 : 45);
    setIsTimerActive(true);
    
    // Randomized tone for real mode
    if (mode === 'real') {
      const tones: InterviewTone[] = ['neutral', 'skeptical', 'rushed'];
      setSessionTone(tones[Math.floor(Math.random() * tones.length)]);
    }

    // Auto-speak question after small delay
    setTimeout(() => speak(question.question), 500);
  };

  const nextQuestion = () => {
    // Check for follow-up
    if (!isFollowUp && currentQuestion.followUps && currentQuestion.followUps.length > 0) {
      const fu = currentQuestion.followUps[0];
      setFollowUpQuestion(fu);
      setIsFollowUp(true);
      resetQuestionState(fu);
      return;
    }

    setIsFollowUp(false);
    setFollowUpQuestion(null);

    if (currentIdx < currentQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      resetQuestionState(currentQuestions[nextIdx]);
    } else {
      setViewState('RESULTS');
    }
  };

  const retryQuestion = () => {
    setShowFeedback(false);
    setTranscriptText("");
    setEvaluation(null);
    setTimeLeft(mode === 'real' ? 15 : 45);
    setIsTimerActive(true);
    speak(currentQuestion.question);
  };

  if (viewState === 'WIZARD_MODE') {
    return (
      <Layout onBack={onBack} title={t('interview.title', lang)}>
        <div className="space-y-8 py-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-navy uppercase">{t('interview.mode_select', lang)}</h2>
            <p className="text-navy/60 text-sm px-4">{t('interview.welcome_desc', lang)}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 px-4">
            <button 
              onClick={() => { setMode('confidence'); setViewState('WIZARD_CASE'); }}
              className="group text-left"
            >
              <Card className="p-6 transition-all group-hover:border-gold group-hover:shadow-lg relative overflow-hidden">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-gold/10 rounded-2xl text-gold group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy">{t('interview.mode_confidence', lang)}</h3>
                    <p className="text-xs text-navy/50">{t('interview.mode_confidence_desc', lang)}</p>
                  </div>
                </div>
              </Card>
            </button>

            <button 
              onClick={() => { setMode('real'); setViewState('WIZARD_CASE'); }}
              className="group text-left"
            >
              <Card className="p-6 transition-all group-hover:border-navy group-hover:shadow-lg bg-navy text-white border-none">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('interview.mode_real', lang)}</h3>
                    <p className="text-xs text-white/50">{t('interview.mode_real_desc', lang)}</p>
                  </div>
                </div>
              </Card>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (viewState === 'WIZARD_CASE') {
    const cases: { id: InterviewCaseType, label: string }[] = [
      { id: 'green_card', label: t('case.greencard', lang) },
      { id: 'citizenship', label: t('case.naturalization', lang) },
      { id: 'asylum', label: lang === 'en' ? 'Asylum' : 'Asilo' },
      { id: 'family', label: lang === 'en' ? 'Family Petition' : 'Petición Familiar' }
    ];

    return (
      <Layout onBack={() => setViewState('WIZARD_MODE')} title={t('interview.case_select', lang)}>
        <div className="space-y-8 py-8 px-4">
          <div className="grid grid-cols-2 gap-4">
            {cases.map((c) => (
              <button 
                key={c.id}
                onClick={() => { setCaseType(c.id); setViewState('MISTAKES'); }}
                className="group h-32"
              >
                <Card className="h-full flex flex-col items-center justify-center gap-3 p-4 text-center transition-all group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                  <Info className="w-6 h-6 text-navy/20 group-hover:text-white/20" />
                  <span className="font-bold text-xs uppercase tracking-tighter">{c.label}</span>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (viewState === 'MISTAKES') {
    return (
      <Layout onBack={() => setViewState('WIZARD_CASE')} title={t('interview.mistakes_title', lang)}>
        <div className="space-y-6 py-6 px-4">
          <div className="space-y-2">
             <h2 className="text-xl font-bold text-navy">{t('interview.mistakes_title', lang)}</h2>
             <p className="text-xs text-navy/50">{t('interview.mistakes_desc', lang)}</p>
          </div>

          <div className="space-y-3">
             {COMMON_MISTAKES(lang).map((m, i) => (
               <Card key={i} className="p-4 flex gap-4 items-start border-none bg-red-50">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    {m.icon === 'AlertTriangle' && <AlertTriangle className="w-4 h-4" />}
                    {m.icon === 'Calendar' && <Calendar className="w-4 h-4" />}
                    {m.icon === 'MessageSquare' && <MessageSquare className="w-4 h-4" />}
                    {m.icon === 'Frown' && <Frown className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                     <h4 className="font-bold text-sm text-red-900">{m.title}</h4>
                     <p className="text-[10px] text-red-800/70">{m.desc}</p>
                  </div>
               </Card>
             ))}
          </div>

          <Button fullWidth size="lg" onClick={startSimulation} className="bg-navy border-none mt-8 h-16 text-lg">
            {t('interview.start_btn', lang)}
          </Button>
        </div>
      </Layout>
    );
  }

  if (viewState === 'RESULTS') {
     return (
       <Layout onBack={onBack} title={t('dash.practice', lang)}>
         <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center relative">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            </div>
            
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-navy uppercase italic">¡Práctica Terminada!</h2>
               <p className="text-navy/60 text-sm">Has completado tu simulación de entrevista para {caseType.replace('_', ' ')}.</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
               <Card className="p-4 text-center">
                  <span className="text-3xl font-black text-navy">80%</span>
                  <p className="text-[10px] text-navy/40 uppercase font-black">Confianza</p>
               </Card>
               <Card className="p-4 text-center">
                  <span className="text-3xl font-black text-navy">{questions.length}</span>
                  <p className="text-[10px] text-navy/40 uppercase font-black">Preguntas</p>
               </Card>
            </div>

            <div className="w-full space-y-3">
              <Button fullWidth variant="primary" size="lg" onClick={() => setViewState('WIZARD_MODE')}>
                {t('interview.redo_btn', lang)}
              </Button>
              <Button fullWidth variant="outline" size="lg" onClick={() => onNext('DASHBOARD')}>
                Regresar al Panel
              </Button>
            </div>
         </div>
       </Layout>
     );
  }

  return (
    <Layout onBack={() => setViewState('WIZARD_MODE')} title={`${t('interview.title', lang)}${mode === 'real' ? ' (Simulacro)' : ''}`}>
      <div className="space-y-6 py-4 flex flex-col min-h-[85vh] px-4">
        
        {/* Header with Stats */}
        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-navy/5 shadow-sm">
           <div className="flex items-center gap-2">
              <Badge className={mode === 'real' ? 'bg-navy text-white border-none' : 'bg-gold/10 text-gold border-none'}>
                {mode === 'real' ? t('interview.mode_real', lang) : t('interview.mode_confidence', lang)}
              </Badge>
              <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">
                {t('interview.current_q', lang)} {currentIdx + 1}/{questions.length}
              </span>
           </div>
           
           {mode === 'real' && (
             <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full text-red-600 font-black text-xs">
                <Clock className="w-3 h-3" />
                {timeLeft}s
             </div>
           )}
        </div>

        {/* Visual Cue for Follow-ups/Curveballs */}
        {(isFollowUp || currentQuestion?.isCurveball) && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 bg-amber-500 text-white p-3 rounded-xl shadow-lg"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold uppercase italic tracking-wider">
              {currentQuestion?.isCurveball ? t('interview.curveball', lang) : 'Pregunta de Seguimiento'}
            </span>
          </motion.div>
        )}

        {/* Interviewer Section */}
        <div className="flex flex-col items-center gap-4 py-4">
           <div className="relative">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 bg-navy shadow-2xl transition-all duration-500 ${
                mode === 'real' && isListening ? 'scale-110 rotate-3 border-red-500' : 'border-white'
              }`}>
                 <img 
                   src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
                   alt="Officer" 
                   className={`w-full h-full object-cover transition-opacity ${sessionTone === 'skeptical' ? 'opacity-50 grayscale' : 'opacity-80'}`}
                 />
              </div>
              <AnimatePresence>
                {isListening && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-2 -right-2 bg-red-500 p-2.5 rounded-full border-4 border-white shadow-lg"
                  >
                    <Mic className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           
           <div className="text-center space-y-3 max-w-xs px-2">
              <Badge variant="outline" className="text-[10px] uppercase font-black py-0">
                {currentQuestion?.category}
              </Badge>
              <h3 className="text-xl font-bold text-navy leading-tight">
                "{currentQuestion?.question}"
              </h3>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => speak(currentQuestion.question)}
                  className="p-2 transition-colors hover:bg-navy/5 text-navy/40 hover:text-navy rounded-full"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="h-1px w-4 bg-navy/10" />
                <span className="text-[10px] text-navy/40 uppercase font-black tracking-widest">
                  {isListening ? t('interview.listening', lang) : sessionTone === 'skeptical' ? t('interview.tone_skeptical', lang) : t('interview.waiting', lang)}
                </span>
              </div>
           </div>
        </div>

        {/* Input/Feedback Section */}
        <div className="flex-1 flex flex-col justify-end gap-6 relative pb-8">
           
           <AnimatePresence>
              {isTyping && !showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  <Card className="p-4 border-2 border-navy/10 focus-within:border-navy transition-colors">
                    <textarea 
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={t('interview.type_btn', lang)}
                      className="w-full h-32 bg-transparent border-none focus:ring-0 text-navy font-medium resize-none shadow-none outline-none"
                      autoFocus
                    />
                  </Card>
                  <div className="flex gap-2">
                    <Button variant="outline" fullWidth onClick={() => setIsTyping(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" fullWidth onClick={handleManualSubmit}>
                      Submit Answer
                    </Button>
                  </div>
                </motion.div>
              )}

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
                  <Card className={`border-none shadow-lg ${
                    evaluation.status === 'correct' ? 'bg-green-500 text-white' : 
                    evaluation.status === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    <div className="flex items-start gap-4">
                       <div className="bg-white/20 p-2 rounded-xl">
                          {evaluation.status === 'correct' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-bold">{t('interview.feedback_title', lang)}</h4>
                          <p className="text-xs text-white/90 leading-relaxed font-medium">"{transcriptText || '...'}"</p>
                       </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-white border-navy/5 shadow-soft p-4 flex gap-4 items-start">
                     <div className="p-2 bg-gold/10 rounded-xl"><Sparkles className="w-6 h-6 text-gold" /></div>
                     <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-navy/30">{t('interview.coach_tip', lang)}</span>
                        <p className="text-xs text-navy/70 leading-relaxed font-medium">{evaluation.tips}</p>
                     </div>
                  </Card>

                  <div className="flex gap-3">
                    <Button fullWidth variant="outline" size="sm" onClick={retryQuestion} className="h-12 border-navy/10 text-navy font-bold">
                       <RefreshCw className="w-4 h-4 mr-2" /> {t('interview.redo_btn', lang)}
                    </Button>
                    <Button fullWidth variant="primary" size="lg" onClick={nextQuestion} className="h-12 bg-navy border-none shadow-xl shadow-navy/20 font-bold">
                       {t('interview.next_btn', lang)} <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>

           {!showFeedback && (
             <div className="flex flex-col items-center gap-6">
               {voiceError && (
                 <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 mb-2">
                   <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none">
                     {voiceError === 'not-allowed' ? 'Access Denied: Please check mic permissions' : voiceError}
                   </p>
                 </div>
               )}
               {isListening && (
                  <div className="flex gap-1.5 h-12 items-center">
                    {[1,2,3,4,5,6,7].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 32, 12, 40, 8] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                        className="w-1.5 bg-navy rounded-full shadow-sm shadow-navy/20"
                      />
                    ))}
                  </div>
                )}
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gold/20 rounded-full blur-2xl transition-all duration-500 ${isListening ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`} />
                  <button 
                    onClick={toggle}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 relative z-10 ${
                      isListening ? 'bg-red-500 scale-110 shadow-red-500/30' : 'bg-gold shadow-gold/30 hover:scale-105'
                    }`}
                  >
                    {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                  </button>
                </div>
                <p className="text-sm font-black text-navy uppercase tracking-tighter animate-pulse">
                  {isListening ? t('interview.stop_mic', lang) : t('interview.start_mic', lang)}
                </p>

                <button 
                  onClick={() => setIsTyping(true)} 
                  className="text-xs font-bold text-navy/30 hover:text-navy transition-colors underline decoration-navy/10 mt-2"
                >
                  {t('interview.type_btn', lang)}
                </button>
              </div>
           )}
        </div>
      </div>
    </Layout>
  );
};

