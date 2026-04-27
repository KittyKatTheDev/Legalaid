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
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-4">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">{lang === 'es' ? 'Membresía Premium' : 'Premium Membership'}</h2>
           <h1 className="text-6xl font-black text-navy uppercase tracking-tighter">{lang === 'es' ? 'Acelere su Proceso' : 'Accelerate Your Process'}</h1>
           <p className="text-xl text-navy/40 font-medium italic max-w-2xl mx-auto">{t('premium.desc', lang)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="space-y-8 order-2 md:order-1">
              <div className="space-y-6">
                 {benefits.map((b, i) => (
                    <div key={i} className="flex gap-4 items-center">
                       <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-gold" />
                       </div>
                       <span className="text-lg text-navy/80 font-bold italic tracking-tight">{b}</span>
                    </div>
                 ))}
              </div>

              <div className="p-8 bg-navy/[0.02] border border-navy/5 rounded-[2rem] flex gap-4 items-start">
                 <Clock className="w-6 h-6 text-navy/20 shrink-0" />
                 <p className="text-xs text-navy/40 leading-relaxed italic font-medium">
                    {t('premium.notice', lang)}
                 </p>
              </div>
           </div>

           <div className="order-1 md:order-2">
              <Card className="bg-navy p-12 text-white border-none shadow-premium relative overflow-hidden flex flex-col items-center text-center space-y-8">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mt-32 -mr-32" />
                 <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{lang === 'es' ? 'Inversión Única' : 'Single Investment'}</span>
                    <h3 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">$300</h3>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{t('premium.fee_type', lang)}</p>
                 </div>
                 
                 <div className="w-full space-y-4 relative z-10 pt-8 border-t border-white/10">
                    <Button fullWidth size="lg" onClick={handleUpgrade} className="shadow-2xl shadow-navy/40 h-16 rounded-2xl text-xl">
                       {t('premium.btn.upgrade', lang)}
                    </Button>
                    <button onClick={onBack} className="text-xs font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">{t('premium.btn.cancel', lang)}</button>
                 </div>

                 <div className="flex gap-4 items-center opacity-30 relative z-10">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{lang === 'es' ? 'Pago Seguro SSL' : 'SSL Secure Payment'}</span>
                 </div>
              </Card>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export const Support: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('support.title', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('support.subtitle', lang)}</p>
           </div>
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 rounded-full">
              <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">{t('msg.available', lang)}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2">
              <Card className="p-10 bg-white border-navy/5 shadow-premium space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-navy/30">{t('support.language.label', lang)}</label>
                       <select 
                        value={lang} 
                        onChange={(e) => updateUser({ language: e.target.value as any })}
                        className="w-full p-4 rounded-xl border border-navy/10 bg-cream/30 text-sm font-bold outline-none appearance-none cursor-pointer"
                       >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="mix">Mixteco ✨</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-navy/30">{lang === 'es' ? 'Tipo de Consulta' : 'Inquiry Type'}</label>
                       <select className="w-full p-4 rounded-xl border border-navy/10 bg-cream/30 text-sm font-bold outline-none appearance-none cursor-pointer">
                          <option>{lang === 'es' ? 'Soporte Técnico' : 'Technical Support'}</option>
                          <option>{lang === 'es' ? 'Duda Legal' : 'Legal Question'}</option>
                          <option>{lang === 'es' ? 'Premium' : 'Premium Inquiry'}</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/30">{t('support.message.label', lang)}</label>
                    <textarea 
                      rows={6} 
                      className="w-full p-6 rounded-2xl border border-navy/10 bg-cream/30 text-sm font-medium outline-none focus:ring-4 focus:ring-gold/10 transition-all resize-none italic" 
                      placeholder={t('support.message.placeholder', lang)} 
                    />
                 </div>

                 <Button fullWidth size="lg" className="rounded-2xl h-16 shadow-premium" onClick={() => onNext('DASHBOARD')}>
                    {t('support.btn.send', lang)}
                 </Button>
              </Card>
           </div>

           <div className="space-y-6">
              <Card className="p-8 space-y-6 bg-[#FFFAF0] border-gold/20">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{lang === 'es' ? 'Contacto Directo' : 'Direct Contact'}</h4>
                 <div className="space-y-4">
                    <button className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-navy/5 hover:border-gold transition-all group">
                       <Mail className="w-5 h-5 text-navy/20 group-hover:text-gold transition-colors" />
                       <span className="text-xs font-bold text-navy uppercase">{t('support.btn.email', lang)}</span>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-navy/5 hover:border-gold transition-all group">
                       <Phone className="w-5 h-5 text-navy/20 group-hover:text-gold transition-colors" />
                       <span className="text-xs font-bold text-navy uppercase">{t('support.btn.call', lang)}</span>
                    </button>
                 </div>
              </Card>

              <div className="p-8 space-y-6 text-navy/30">
                 <div className="flex gap-3 items-start">
                    <MapPin className="w-5 h-5 shrink-0" />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest mb-1">{lang === 'es' ? 'Ubicación' : 'Location'}</p>
                       <p className="text-[10px] font-bold uppercase">{t('support.location', lang)}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 items-start">
                    <Clock className="w-5 h-5 shrink-0" />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest mb-1">{lang === 'es' ? 'Horario' : 'Hours'}</p>
                       <p className="text-[10px] font-bold uppercase">Lun-Vie: 9am - 6pm PST</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};
