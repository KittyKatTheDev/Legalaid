import React, { useState } from 'react';
import { Button, Card, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { MessageCircle, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
}

export const LawyerChat: React.FC<ScreenProps> = ({ onBack, user, updateUser }) => {
  const [messages, setMessages] = useState([
    { role: 'lawyer', text: 'Hello! I am a pro-bono legal assistant. You have 1 free question available today. How can I help you with your immigration case?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'lawyer', text: "Thank you for your question. A licensed attorney will review your inquiry. Since this is your free question, please wait up to 24 hours for a detailed response." }]);
    }, 1000);
  };

  return (
    <Layout onBack={onBack} title="Pro-bono Chat" user={user} updateUser={updateUser}>
      <div className="flex flex-col h-[75vh]">
        <div className="bg-gold/10 p-3 rounded-2xl flex items-center gap-3 mb-4">
           <ShieldCheck className="w-5 h-5 text-gold" />
           <p className="text-[10px] font-bold text-navy uppercase tracking-widest">Verified Pro-bono Legal Network</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-navy text-white rounded-tr-none' : 'bg-white border border-navy/10 text-navy rounded-tl-none'}`}>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your legal question..."
            className="flex-1 p-3 rounded-xl border border-navy/10 outline-none focus:border-gold"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
};
