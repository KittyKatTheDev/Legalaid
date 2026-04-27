import React from 'react';
import { Button, Card, Layout, Badge } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Clock, 
  MapPin,
  Headphones,
  Phone
} from 'lucide-react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const PremiumCheckout: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const benefits = [
    t('premium.benefit1', lang),
    t('premium.benefit2', lang),
    t('premium.benefit3', lang),
    t('premium.benefit4', lang),
    t('premium.benefit5', lang)
  ];

  const handleUpgrade = () => {
    updateUser({ isPremium: true });
    onNext('DASHBOARD');
  };

  return (
    <Layout onBack={onBack} title={t('premium.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="text-center space-y-3">
           <div className="mx-auto w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
              <Sparkles className="w-8 h-8 text-white" />
           </div>
           <h2 className="text-3xl font-black text-navy">$300 <span className="text-sm font-medium text-navy/40">{t('premium.fee_type', lang)}</span></h2>
           <p className="text-navy/60 text-sm px-4">{t('premium.desc', lang)}</p>
        </div>

        <div className="space-y-3">
           {benefits.map((b) => (
             <div key={b} className="flex gap-3 items-center">
                <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                   <Check className="w-3 h-3 text-gold" />
                </div>
                <span className="text-sm text-navy/80 font-medium">{b}</span>
             </div>
           ))}
        </div>

        <Card className="bg-navy/5 border-navy/10 flex gap-4 p-4 items-start">
           <div className="p-2 bg-navy rounded-lg shrink-0">
              <Clock className="w-4 h-4 text-white" />
           </div>
           <p className="text-[10px] text-navy/60 leading-relaxed italic">
             {t('premium.notice', lang)}
           </p>
        </Card>

        <div className="pt-4 space-y-4">
           <Button fullWidth size="lg" onClick={handleUpgrade} className="shadow-xl shadow-navy/20">
              {t('premium.btn.upgrade', lang)}
           </Button>
           <Button variant="ghost" fullWidth onClick={onBack}>{t('premium.btn.cancel', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};

export const Support: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('support.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4 text-center">
        <div className="space-y-3">
           <div className="mx-auto w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8 text-navy" />
           </div>
           <h2 className="text-2xl font-bold text-navy">{t('support.subtitle', lang)}</h2>
           <p className="text-navy/60 text-sm">{t('support.desc', lang)}</p>
           <p className="text-gold font-bold text-xs uppercase tracking-widest">{t('msg.available', lang)}</p>
        </div>

        <div className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy/70">{t('support.language.label', lang)}</label>
              <select 
                value={lang} 
                onChange={(e) => updateUser({ language: e.target.value as any })}
                className="w-full p-4 rounded-xl border border-navy/10 bg-white outline-none"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="mix">Mixteco ✨</option>
                <option value="other">Other Language</option>
              </select>
           </div>
           <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-navy/70">{t('support.message.label', lang)}</label>
              <textarea rows={4} className="w-full p-4 rounded-xl border border-navy/10 bg-white outline-none" placeholder={t('support.message.placeholder', lang)} />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" fullWidth onClick={() => {}}>
              <Mail className="w-4 h-4 mr-2" /> {t('support.btn.email', lang)}
           </Button>
           <Button variant="outline" fullWidth onClick={() => {}}>
              <Phone className="w-4 h-4 mr-2" /> {t('support.btn.call', lang)}
           </Button>
        </div>

        <Button fullWidth onClick={() => onNext('DASHBOARD')}>{t('support.btn.send', lang)}</Button>

        <div className="flex justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-navy/30">
           <MapPin className="w-3 h-3" /> {t('support.location', lang)}
        </div>
      </div>
    </Layout>
  );
};
