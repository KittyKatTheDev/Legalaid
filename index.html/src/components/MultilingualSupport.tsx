import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Users, FileText, Phone, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Card, Button, Modal } from './Common';
import { UserData } from '../types';
import { t } from '../lib/translations';

interface MixtecoSupportProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
}

export const MixtecoSupportModal: React.FC<MixtecoSupportProps> = ({ isOpen, onClose, user, updateUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [requestedInterpreter, setRequestedInterpreter] = useState(false);
  const lang = user.language;

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would play/pause an actual audio file
  };

  const requestInterpreter = () => {
    setRequestedInterpreter(true);
    setTimeout(() => {
      setRequestedInterpreter(false);
      onClose();
    }, 3000);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={lang === 'mix' ? t('mix.title', 'en') : t('mix.title', lang)}
    >
      <div className="space-y-6">
        <p className="text-sm text-navy/60">{lang === 'mix' ? t('mix.desc', 'en') : t('mix.desc', lang)}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Audio Guidance */}
          <Card 
            onClick={toggleAudio}
            className={`p-4 border-2 transition-all ${isPlaying ? 'border-gold bg-gold/5' : 'border-navy/5'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isPlaying ? 'bg-gold animate-pulse' : 'bg-navy/5'}`}>
                {isPlaying ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-navy" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-navy">{isPlaying ? t('mix.audio_stop', lang) : t('mix.audio', lang)}</h4>
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest italic">
                  {isPlaying ? 'Playing guidance...' : 'Available in Mixteco & Zapoteco'}
                </p>
              </div>
            </div>
          </Card>

          {/* Request Interpreter */}
          <Card 
            onClick={requestInterpreter}
            className={`p-4 border-2 transition-all ${requestedInterpreter ? 'border-green-500 bg-green-50' : 'border-navy/5'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${requestedInterpreter ? 'bg-green-500' : 'bg-navy/5'}`}>
                <Users className={`w-5 h-5 ${requestedInterpreter ? 'text-white' : 'text-navy'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-navy">{t('mix.interpreter', lang)}</h4>
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest italic">
                  {requestedInterpreter ? t('mix.interpreter_request', lang) : 'On-call support'}
                </p>
              </div>
            </div>
          </Card>

          {/* Simplified Summaries */}
          <Card 
            onClick={() => {
              updateUser({ isSimplifiedMode: true });
              onClose();
            }}
            className="p-4 border-navy/5 hover:border-gold/30 hover:bg-gold/5"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-navy/5 rounded-xl">
                <FileText className="w-5 h-5 text-navy" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-navy">{t('mix.summaries', lang)}</h4>
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest italic">{t('mix.simplified_desc', lang)}</p>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-4 border-navy/5 hover:border-navy/10 hover:bg-navy/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-navy/5 rounded-xl">
                <Phone className="w-5 h-5 text-navy" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-navy">{t('mix.contact', lang)}</h4>
                <p className="text-[10px] text-navy/40 uppercase font-black tracking-widest italic">Direct line to Puente</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="p-4 bg-navy rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="p-2 bg-gold/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-gold" />
           </div>
           <div>
              <p className="text-white text-xs font-bold leading-tight">Bilingual Legal Shield</p>
              <p className="text-white/60 text-[10px]">Indigenous language advocacy provided by our partner network.</p>
           </div>
        </div>
      </div>
    </Modal>
  );
};
