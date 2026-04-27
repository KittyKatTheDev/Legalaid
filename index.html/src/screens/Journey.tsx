import React from 'react';
import { Button, Card, Layout, ProgressBar } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { CheckCircle2, Circle, ArrowRight, Calendar, Clock, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const Roadmap: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const steps = [
    { title: t('roadmap.step1.title', lang), status: 'complete', desc: t('roadmap.step1.desc', lang) },
    { title: t('roadmap.step2.title', lang), status: 'current', desc: t('roadmap.step2.desc', lang) },
    { title: t('roadmap.step3.title', lang), status: 'upcoming', desc: t('roadmap.step3.desc', lang) },
    { title: t('roadmap.step4.title', lang), status: 'upcoming', desc: t('roadmap.step4.desc', lang) },
    { title: t('roadmap.step5.title', lang), status: 'upcoming', desc: t('roadmap.step5.desc', lang) },
    { title: t('roadmap.step6.title', lang), status: 'upcoming', desc: t('roadmap.step6.desc', lang) },
  ];

  return (
    <Layout onBack={onBack} title={t('roadmap.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('roadmap.title', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('roadmap.subtitle', lang)}</p>
        </div>

        <div className="relative space-y-8 pl-8 pt-4">
          <div className="absolute left-3.5 top-8 bottom-8 w-0.5 bg-navy/5" />
          
          {steps.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={step.title} 
              className="relative"
            >
              <div className={`absolute -left-[2.35rem] top-1 w-7 h-7 rounded-full flex items-center justify-center border-4 border-cream z-10 ${
                step.status === 'complete' ? 'bg-green-500' : 
                step.status === 'current' ? 'bg-gold' : 'bg-navy/10'
              }`}>
                {step.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-white" />}
                {step.status === 'current' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              </div>
              
              <div className="space-y-1">
                <h4 className={`font-bold text-sm ${step.status === 'upcoming' ? 'text-navy/30' : 'text-navy'}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-navy/50 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-6">
          <Button fullWidth onClick={() => onNext('TIMELINE')}>
             {t('roadmap.btn.next', lang)} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export const Timeline: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('timeline.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-4 text-center">
          <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-navy">{t('timeline.title', lang)}</h2>
            <p className="text-navy/60">{t('timeline.desc', lang)}</p>
          </div>
        </div>

        <Card className="bg-navy text-white text-center p-8 space-y-2">
           <span className="text-gold font-bold uppercase tracking-widest text-[10px]">{t('timeline.duration.label', lang)}</span>
           <h3 className="text-4xl font-black">{user.estimatedTimeline || t('timeline.duration.value', lang)}</h3>
           <p className="text-white/40 text-xs">{t('timeline.duration.stats', lang)}</p>
        </Card>

        <div className="space-y-4">
           <div className="flex gap-4 p-4 rounded-2xl border border-navy/5 bg-white">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div className="space-y-1">
                 <h5 className="font-bold text-sm text-navy">{t('timeline.trends.title', lang)}</h5>
                 <p className="text-xs text-navy/60">{t('timeline.trends.desc', lang)}</p>
              </div>
           </div>
           
           <div className="flex gap-4 p-4 rounded-2xl border border-navy/5 bg-white">
              <Info className="w-5 h-5 text-gold shrink-0" />
              <div className="space-y-1">
                 <h5 className="font-bold text-sm text-navy">{t('timeline.note.title', lang)}</h5>
                 <p className="text-xs text-navy/60">{t('timeline.note.desc', lang)}</p>
              </div>
           </div>
        </div>

        <Button fullWidth onClick={() => onNext('DASHBOARD')}>{t('btn.continue', lang)}</Button>
      </div>
    </Layout>
  );
};
