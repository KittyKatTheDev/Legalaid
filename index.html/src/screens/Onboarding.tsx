import React from 'react';
import { Button, Card, Layout, TTSButton } from '../components/Common';
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
  Scan,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { useVoiceInput } from '../hooks/useVoiceInput';
import { t } from '../lib/translations';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

export const Landing: React.FC<ScreenProps> = ({ onNext, user, updateUser }) => {
  const lang = user.language;
  const [showChat, setShowChat] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: t('onboarding.chat_msg', lang) }
  ]);
  const [isTypingChat, setIsTypingChat] = React.useState(false);

  const { isListening: isListeningVoice, toggle: toggleVoice, transcript: voiceTranscript } = useVoiceInput({
    lang: lang === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => setChatInput(text)
  });

  const handleChatSubmit = async (e?: React.FormEvent, forcedMsg?: string) => {
    if (e) e.preventDefault();
    const message = forcedMsg || chatInput;
    if (!message.trim() || isTypingChat) return;

    const userMsg = message.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTypingChat(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are the "AI Solicitor/Guide" for the "LibrePath" app. Your goal is to build trust with families navigating the US immigration system. Answer questions kindly and accurately. Speak simply. Keep it short. Language: ${lang === 'es' ? 'Spanish' : 'English'}. Question: ${userMsg}` }] }
        ]
      });
      const reply = response.text || (lang === 'es' ? 'Entendido. ¿En qué más puedo ayudarte?' : 'I see. How else can I help?');
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: lang === 'es' ? 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' : 'Sorry, I had a problem. Can you try again?' }]);
    } finally {
      setIsTypingChat(false);
    }
  };

  // Testimonials with unique selection logic
  const allStories = [
    { name: 'Ricardo M.', district: 'Ventura', text: t('story.ricardo', lang), initial: 'RM', id: 'ricardo' },
    { name: 'Elena S.', district: 'Oxnard', text: t('story.elena', lang), initial: 'ES', id: 'elena' },
    { name: 'Rosa G.', district: 'Santa Paula', text: t('story.rosa', lang), initial: 'RG', id: 'rosa' }
  ];

  // Pick one for hero, others for bottom
  const [heroIndex] = React.useState(() => Math.floor(Math.random() * allStories.length));
  const heroStory = allStories[heroIndex];
  const gridStories = allStories.filter((_, i) => i !== heroIndex);

  const handleFeatureClick = (feature: ScreenId) => {
    const publicFeatures: ScreenId[] = ['AI_GUIDE', 'KNOW_YOUR_RIGHTS', 'TUTORIAL'];
    if (user.isLoggedIn || publicFeatures.includes(feature)) {
      onNext(feature);
    } else {
      onNext('SIGNUP');
    }
  };

  return (
    <Layout showHeader={true} user={user} updateUser={updateUser}>
      <div className="space-y-32 lg:space-y-48">
        
        {/* Dynamic Hero Section */}
        <section className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[140%] bg-gold/5 rounded-full blur-[120px] -z-10" />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-12 text-center lg:text-left">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-navy/5 rounded-full border border-navy/5"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/60">{lang === 'es' ? 'Asistencia Legal con IA' : 'AI-Powered Legal Assistance'}</span>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-black text-navy leading-[0.9] tracking-tighter uppercase">
                  {t('brand.name', lang)}
                </h1>
                <p className="text-xl md:text-2xl font-medium text-navy/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed italic">
                  {t('onboarding.slogan', lang)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Button size="lg" onClick={() => handleFeatureClick('DASHBOARD')} className="px-12 py-6 text-xl shadow-2xl shadow-navy/20">
                  {t('btn.start', lang)}
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleFeatureClick('PREMIUM')} className="px-12 py-6 text-xl">
                  {t('onboarding.premium_btn', lang)}
                </Button>
              </div>


            </div>

            {/* Interactive Hero Card */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                 <div className="absolute inset-0 bg-gold/20 rounded-[3rem] blur-xl translate-x-4 translate-y-4 -z-10" />
                 <Card className="bg-navy p-10 lg:p-12 text-white space-y-8 relative overflow-hidden border-none shadow-premium">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mt-32 -mr-32" />
                    <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-gold" />
                       </div>
                       <div>
                          <p className="text-sm font-black uppercase tracking-widest text-gold">{lang === 'es' ? 'Testimonio Real' : 'Real Testimonial'}</p>
                          <h4 className="text-xl font-bold italic opacity-90">"The bridge we needed."</h4>
                       </div>
                    </div>
                    <p className="text-xl leading-relaxed italic text-white/80">
                       "{heroStory.text}"
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                       <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-black">RM</div>
                       <div>
                          <p className="font-bold text-white uppercase text-xs tracking-widest">Ricardo M.</p>
                          <p className="text-[10px] text-white/40 uppercase font-black">{lang === 'es' ? 'Residente en Ventura' : 'Ventura Resident'}</p>
                       </div>
                    </div>
                 </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Three Pillars Section */}
        <section className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gold">{t('onboarding.how_title', lang)}</h2>
            <p className="text-4xl font-black text-navy uppercase tracking-tighter leading-none">{lang === 'es' ? 'Nuestra Tecnología al Servicio de su Familia' : 'Our Technology Serving Your Family'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: BrainCircuit, title: t('onboarding.how1_title', lang), desc: t('onboarding.how1_desc', lang), color: 'bg-gold/10' },
              { icon: ShieldCheck, title: t('onboarding.how2_title', lang), desc: t('onboarding.how2_desc', lang), color: 'bg-navy/5' },
              { icon: Globe, title: t('onboarding.how3_title', lang), desc: t('onboarding.how3_desc', lang), color: 'bg-gold/10' }
            ].map((pillar, i) => (
              <Card key={i} className="flex flex-col items-center text-center gap-8 p-12 hover:border-gold/20 transition-all border-dashed">
                <div className={`p-6 ${pillar.color} rounded-3xl`}><pillar.icon className="w-10 h-10 text-gold" /></div>
                <div className="space-y-4">
                  <h4 className="font-black text-navy text-2xl uppercase tracking-tighter">{pillar.title}</h4>
                  <p className="text-base text-navy/60 leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* The Feature Grid (Website-optimized) */}
        <section className="space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-navy/5 pb-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/20">{t('onboarding.features_title', lang)}</h3>
                <p className="text-4xl font-black text-navy uppercase tracking-tighter">{lang === 'es' ? 'Explora las Herramientas' : 'Explore the Tools'}</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => handleFeatureClick('TUTORIAL')}
                className="text-xs font-black text-gold uppercase tracking-widest px-0"
              >
                {t('common.view_tutorial', lang)}
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature Bento Grid */}
              <Card onClick={() => setShowChat(true)} className="col-span-1 md:col-span-2 lg:col-span-4 bg-navy text-white p-12 relative overflow-hidden group cursor-pointer border-none shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                    <Sparkles className="w-32 h-32 text-gold" />
                 </div>
                 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="p-8 bg-gold/20 rounded-4xl shrink-0">
                       <Sparkles className="w-16 h-16 text-gold" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                       <h3 className="text-4xl font-black uppercase tracking-tighter">{t('onboarding.ai_guide_title', lang)}</h3>
                       <p className="text-xl text-white/50 leading-relaxed italic max-w-xl">{t('onboarding.ai_guide_desc', lang)}</p>
                    </div>
                    <div className="ml-auto w-full md:w-auto">
                       <Button variant="secondary" size="lg" className="px-12 w-full" onClick={(e) => { e.stopPropagation(); setShowChat(true); }}>{lang === 'es' ? 'Pruébalo Ahora' : 'Try it Now'}</Button>
                    </div>
                 </div>
              </Card>

              {/* Smaller Tiles */}
              {[
                { id: 'PROGRESS_SCORE', icon: Trophy, label: t('onboarding.feat_progress', lang), desc: t('onboarding.feat_progress_desc', lang), color: 'text-gold' },
                { id: 'SMART_ALERTS', icon: Bell, label: t('onboarding.feat_alerts', lang), desc: t('onboarding.feat_alerts_desc', lang), color: 'text-gold' },
                { id: 'VOICE_INPUT', icon: Mic, label: t('onboarding.feat_voice', lang), desc: t('onboarding.feat_voice_desc', lang), color: 'text-gold' },
                { id: 'UPLOAD', icon: Scan, label: t('onboarding.feat_scan', lang), desc: t('onboarding.feat_scan_desc', lang), color: 'text-gold' }
              ].map((f) => (
                <Card key={f.id} onClick={() => handleFeatureClick(f.id as ScreenId)} className="p-8 flex flex-col gap-6 hover:bg-gold/5 transition-colors group cursor-pointer h-full">
                   <f.icon className={`w-8 h-8 ${f.color} group-hover:scale-110 transition-transform`} />
                   <div className="space-y-2">
                     <h4 className="text-lg font-black text-navy uppercase tracking-tighter leading-none">{f.label}</h4>
                     <p className="text-[11px] text-navy/50 font-medium leading-tight">{f.desc}</p>
                   </div>
                </Card>
              ))}

              {/* Legal Special Tiles */}
              <Card onClick={() => handleFeatureClick('LAWYER_CHAT')} className="col-span-1 md:col-span-2 p-10 bg-[#FFFAF0] border-gold/20 hover:border-gold/40 transition-all space-y-6">
                 <div className="flex justify-between items-start">
                    <MessageCircle className="w-12 h-12 text-gold font-bold" />
                    <span className="bg-gold text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{t('onboarding.feat_lawyer_free', lang)}</span>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{t('onboarding.feat_lawyer', lang)}</h3>
                    <p className="text-sm text-navy/50 font-medium">Chat directo con expertos para orientación inicial.</p>
                 </div>
              </Card>

              <Card onClick={() => handleFeatureClick('KNOW_YOUR_RIGHTS')} className="col-span-1 md:col-span-2 p-10 border-red-50 hover:bg-red-50/20 transition-all space-y-6">
                 <ShieldAlert className="w-12 h-12 text-red-500" />
                 <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600">{t('onboarding.feat_rights', lang)}</h3>
                    <p className="text-sm text-red-900/40 font-medium">Protocolos de emergencia y guías de protección para familias.</p>
                 </div>
              </Card>
           </div>
        </section>

        {/* Voices Section */}
        <section className="bg-navy rounded-[4rem] p-20 text-center space-y-16 text-white relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -ml-48 -mb-48" />
           <div className="space-y-4 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{t('onboarding.voices_title', lang)}</h3>
              <p className="text-5xl font-black uppercase tracking-tighter">Nuestra Comunidad</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {gridStories.map((story, i) => (
                <div key={i} className="bg-white/5 p-12 rounded-[3rem] text-left space-y-8 backdrop-blur-md relative group">
                   <div className="absolute top-8 right-8">
                      <TTSButton text={story.text} lang={lang} />
                   </div>
                   <p className="text-lg text-white/70 italic leading-relaxed font-medium">"{story.text}"</p>
                   <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                      <div className="w-12 h-12 rounded-full bg-gold text-navy flex items-center justify-center font-black text-sm">{story.initial}</div>
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest">{story.name}</p>
                         <p className="text-[10px] text-white/30 uppercase font-bold">{story.district}, CA</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Modern Floating Assistant */}
      <div className="fixed bottom-12 right-12 z-[200]">
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="absolute bottom-24 right-0 w-[400px] bg-white rounded-[3rem] shadow-premium border border-navy/5 overflow-hidden flex flex-col h-[500px]"
            >
              <div className="bg-navy p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-gold rounded-full animate-pulse shadow-glow" />
                  <div className="flex flex-col">
                    <span className="font-black text-sm uppercase tracking-widest">{t('onboarding.chat_guide', lang)}</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Always Active</span>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 p-8 space-y-6 overflow-y-auto" id="chat-container">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed italic relative group ${
                      msg.role === 'user' 
                        ? 'bg-gold text-navy rounded-tr-none' 
                        : 'bg-navy/5 text-navy rounded-tl-none'
                    }`}>
                      {msg.content}
                      {msg.role === 'assistant' && (
                        <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TTSButton text={msg.content} lang={lang} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTypingChat && (
                  <div className="flex justify-start">
                    <div className="bg-navy/5 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-navy/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                
                {chatMessages.length < 3 && (
                  <div className="space-y-3 pt-4">
                     {[
                       { q: t('onboarding.chat_q1', lang) },
                       { q: t('onboarding.chat_q2', lang) },
                       { q: t('onboarding.chat_q3', lang) }
                     ].map((q, i) => (
                        <button 
                          key={i}
                          className="w-full text-left p-4 bg-white border border-navy/5 hover:border-gold/30 hover:bg-gold/5 rounded-2xl text-xs font-bold text-navy transition-all shadow-sm" 
                          onClick={() => handleChatSubmit(undefined, q.q)}
                        >
                          "{q.q}"
                        </button>
                     ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="p-6 bg-cream/30 border-t border-navy/5">
                <div className="relative flex items-center gap-2">
                   <div className="relative flex-1">
                      <input 
                       type="text" 
                       value={chatInput}
                       onChange={(e) => setChatInput(e.target.value)}
                       placeholder={isListeningVoice ? "Listening..." : t('onboarding.chat_placeholder', lang)} 
                       className="w-full p-4 pr-12 rounded-2xl bg-white border border-navy/10 text-sm outline-none focus:ring-2 focus:ring-gold transition-all" 
                      />
                      <button 
                       type="button"
                       onClick={toggleVoice}
                       className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${isListeningVoice ? 'bg-gold text-white animate-pulse' : 'text-navy/40 hover:text-navy hover:bg-navy/5'}`}
                      >
                         <Mic className="w-4 h-4" />
                      </button>
                   </div>
                   <button 
                    type="submit"
                    className="p-4 bg-navy rounded-2xl cursor-pointer hover:bg-navy/80 transition-colors shadow-lg shadow-navy/20"
                   >
                      <Sparkles className="w-5 h-5 text-gold" />
                   </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setShowChat(!showChat)} 
          className="w-20 h-20 bg-navy text-white rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          {showChat ? <X className="w-8 h-8" /> : (
            <div className="relative">
              <MessageSquare className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-navy scale-0 group-hover:scale-100 transition-transform" />
            </div>
          )}
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
  const [activeField, setActiveField] = React.useState<'firstName' | 'lastName' | 'email' | null>(null);
  const lang = user.language;

  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: lang === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => {
      if (activeField) {
        // Simple sanitization for email
        let value = text;
        if (activeField === 'email') {
          value = text.toLowerCase().replace(/\s/g, '').replace('at', '@').replace('dot', '.');
        }
        setFormData(prev => ({ ...prev, [activeField]: value }));
        setActiveField(null);
      }
    }
  });

  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-xl mx-auto py-10">
        <Card className="p-12 bg-white shadow-premium border-navy/5 rounded-[3rem] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="text-center space-y-4 relative z-10">
            <h1 className="text-4xl font-black text-navy uppercase tracking-tighter leading-none">{t('auth.title', lang)}</h1>
            <p className="text-sm text-navy/40 font-bold uppercase tracking-widest">{t('auth.subtitle', lang)}</p>
          </div>

          {voiceError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[10px] text-red-700 font-black uppercase tracking-widest leading-relaxed">{voiceError}</p>
            </motion.div>
          )}

          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-2">{t('auth.first_name', lang)}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full p-4 pr-12 rounded-2xl border border-navy/10 bg-cream/10 font-bold italic text-sm outline-none focus:ring-4 focus:ring-gold/10 transition-all" 
                    placeholder="Juan" 
                    value={activeField === 'firstName' ? transcript || formData.firstName : formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <button 
                    onClick={() => { setActiveField('firstName'); toggle(); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${activeField === 'firstName' && isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-navy/20 hover:text-navy hover:bg-navy/5'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-2">{t('auth.last_name', lang)}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full p-4 pr-12 rounded-2xl border border-navy/10 bg-cream/10 font-bold italic text-sm outline-none focus:ring-4 focus:ring-gold/10 transition-all" 
                    placeholder="Rodriguez" 
                    value={activeField === 'lastName' ? transcript || formData.lastName : formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  <button 
                    onClick={() => { setActiveField('lastName'); toggle(); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${activeField === 'lastName' && isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-navy/20 hover:text-navy hover:bg-navy/5'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-2">{t('auth.email', lang)}</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full p-4 pr-12 rounded-2xl border border-navy/10 bg-cream/10 font-bold italic text-sm outline-none focus:ring-4 focus:ring-gold/10 transition-all" 
                  placeholder="juan.rod@example.com" 
                  value={activeField === 'email' ? transcript || formData.email : formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <button 
                  onClick={() => { setActiveField('email'); toggle(); }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${activeField === 'email' && isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-navy/20 hover:text-navy hover:bg-navy/5'}`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-2">{t('auth.password', lang)}</label>
              <input type="password" className="w-full p-4 rounded-2xl border border-navy/10 bg-cream/10 font-bold italic text-sm outline-none focus:ring-4 focus:ring-gold/10 transition-all" placeholder="••••••••" />
            </div>
          </div>

          <div className="space-y-4 pt-6 relative z-10">
            <Button fullWidth size="lg" className="h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-premium" onClick={() => { updateUser({ isLoggedIn: true }); onNext('LANGUAGE'); }}>
              {t('btn.create_account', lang)}
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-4 text-navy/20">{lang === 'es' ? 'o continuar con' : 'or continue with'}</span></div>
            </div>

            <Button fullWidth variant="outline" size="lg" className="h-16 rounded-2xl font-black uppercase tracking-widest border-navy/5 hover:border-navy text-xs" onClick={() => { updateUser({ isLoggedIn: true }); onNext('LANGUAGE'); }}>
              <div className="flex items-center justify-center gap-3">
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="Google" />
                 {t('btn.google', lang)}
              </div>
            </Button>

            <button onClick={onBack} className="w-full text-[10px] font-black uppercase tracking-widest text-navy/20 hover:text-navy transition-colors">{t('nav.back', lang)}</button>
          </div>
        </Card>
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
          { id: 'mix', label: 'Mixteco ✨', sub: 'beta - Local Native' },
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
            }} className="py-4 px-5 flex items-center justify-between group">
              <span className="font-medium text-navy">{type.label}</span>
              <div className="flex items-center gap-3">
                <TTSButton text={type.label} lang={lang} />
                <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-gold transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};
