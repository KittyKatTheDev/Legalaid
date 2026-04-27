import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Sparkles, Mic, Square, Volume2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useVoiceInput } from '../hooks/useVoiceInput';
import { t } from '../lib/translations';
import { TTSButton } from './Common';
import { UserData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface AssistantChatProps {
  user: UserData;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({ user }) => {
  const lang = user.language;
  const [showChat, setShowChat] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: t('onboarding.chat_msg', lang) }
  ]);
  const [isTypingChat, setIsTypingChat] = React.useState(false);

  const { isListening: isListeningVoice, toggle: toggleVoice } = useVoiceInput({
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
      const response = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent({
        contents: [
          { role: 'user', parts: [{ text: `You are the "AI Solicitor/Guide" for the "LibrePath" app. Your goal is to build trust with families navigating the US immigration system. Answer questions kindly and accurately. Speak simply. Keep it short. Language: ${lang === 'es' ? 'Spanish' : 'English'}. Question: ${userMsg}` }] }
        ]
      });
      const result = await response.response;
      const text = result.text();
      const reply = text || (lang === 'es' ? 'Entendido. ¿En qué más puedo ayudarte?' : 'I see. How else can I help?');
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: lang === 'es' ? 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' : 'Sorry, I had a problem. Can you try again?' }]);
    } finally {
      setIsTypingChat(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[200]">
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="absolute bottom-24 right-0 w-[350px] sm:w-[400px] bg-white rounded-[3rem] shadow-premium border border-navy/5 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-navy p-6 lg:p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-gold rounded-full animate-pulse shadow-glow" />
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-widest leading-none">{t('onboarding.chat_guide', lang)}</span>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Always Active</span>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#FDFCF8]" id="chat-container">
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
                    <Sparkles className="w-4 h-4 text-gold" />
                 </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setShowChat(!showChat)} 
        className="w-16 h-16 lg:w-20 lg:h-20 bg-navy text-white rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
      >
        {showChat ? <X className="w-8 h-8" /> : (
          <div className="relative">
            <MessageSquare className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-navy scale-0 group-hover:scale-100 transition-transform" />
          </div>
        )}
      </button>
    </div>
  );
};
