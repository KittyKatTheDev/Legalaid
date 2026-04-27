import React from 'react';
import { Button, Card, Layout, ProgressBar, Badge } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Map, 
  Users, 
  Plus, 
  Sparkles,
  Phone,
  Mic,
  HelpCircle
} from 'lucide-react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const DashboardHub: React.FC<ScreenProps> = ({ onNext, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout title={t('nav.dashboard', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 pb-20">
        {/* Progress Card */}
        <Card className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-navy">{t('dash.case_progress', lang)}</h3>
              <p className="text-xs text-navy/60">{t('dash.readiness', lang)}</p>
            </div>
            <span className="text-xl font-black text-navy">{user.progress}%</span>
          </div>
          <ProgressBar progress={user.progress} />
          <Button variant="ghost" className="p-0 text-gold hover:bg-transparent" onClick={() => onNext('CHECKLIST')}>
            {t('dash.missing', lang)} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Next Step Banner */}
        <div className="bg-navy p-5 rounded-2xl text-white flex items-center justify-between">
           <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{t('dash.current_step', lang)}</span>
              <h4 className="font-bold">{t('dash.step_temp', lang)}</h4>
           </div>
           <Button variant="secondary" size="sm" onClick={() => onNext('UPLOAD')}>
              {t('btn.continue', lang)}
           </Button>
        </div>

        {/* Upsell Card */}
        {!user.isPremium && (
          <Card className="bg-gold/10 border-gold/20 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="p-3 bg-gold rounded-xl shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-navy">{t('dash.support_title', lang)}</h4>
                <p className="text-xs text-navy/70 leading-relaxed">{t('dash.support_desc', lang)}</p>
              </div>
            </div>
            <Button variant="outline" fullWidth className="border-gold text-navy hover:bg-gold/10" onClick={() => onNext('PREMIUM')}>
              {t('dash.upgrade_btn', lang)}
            </Button>
          </Card>
        )}

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
           <ActionItem icon={<FileText />} label={t('dash.checklist', lang)} onClick={() => onNext('CHECKLIST')} count={2} />
           <ActionItem icon={<Mic />} label={t('dash.practice', lang)} onClick={() => onNext('INTERVIEW_SIMULATOR')} />
           <ActionItem icon={<MessageSquare />} label={t('dash.ai_assistant', lang)} onClick={() => onNext('AI_ASSISTANT')} />
           <ActionItem icon={<Users />} label={t('dash.family', lang)} onClick={() => onNext('FAMILY')} />
        </div>

        {/* WhatsApp Banner */}
        <div 
          onClick={() => onNext('WHATSAPP')}
          className="bg-[#25D366]/10 border border-[#25D366]/20 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-[#25D366]/20 transition-colors"
        >
           <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
           </div>
           <div className="space-y-0.5">
              <h5 className="font-bold text-navy text-sm">{t('dash.connect_whatsapp', lang)}</h5>
              <p className="text-[10px] text-navy/60">{t('dash.whatsapp_desc', lang)}</p>
           </div>
        </div>

        {/* What Happens Next Card */}
        <Card onClick={() => onNext('NEXT_STEPS')} className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-navy/5 rounded-lg">
                 <ArrowRight className="w-5 h-5 text-navy" />
              </div>
              <span className="font-bold text-sm">{t('dash.next_steps', lang)}</span>
           </div>
           <ChevronRight className="w-4 h-4 text-navy/20" />
        </Card>

        {/* Tutorial Link */}
        <div className="flex justify-center pb-6">
           <button 
             onClick={() => onNext('TUTORIAL')}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 hover:text-navy/60 transition-colors"
           >
              <HelpCircle className="w-4 h-4" />
              {t('dash.tutorial_btn', lang)}
           </button>
        </div>
      </div>

      {/* Floating Bottom Nav for simulation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md bg-white border border-navy/5 shadow-2xl rounded-2xl p-2 flex justify-around items-center z-50">
         <NavItem active icon={<FileText />} onClick={() => onNext('DASHBOARD')} />
         <NavItem icon={<Map />} onClick={() => onNext('ROADMAP')} />
         <button onClick={() => onNext('UPLOAD')} className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center -mt-8 shadow-lg shadow-navy/20">
            <Plus className="w-6 h-6 text-white" />
         </button>
         <NavItem icon={<MessageSquare />} onClick={() => onNext('AI_ASSISTANT')} />
         <NavItem icon={<Users />} onClick={() => onNext('FAMILY')} />
      </div>
    </Layout>
  );
};

const ActionItem = ({ icon, label, onClick, count }: { icon: React.ReactNode, label: string, onClick: () => void, count?: number }) => (
  <Card onClick={onClick} className="flex flex-col gap-3 p-4">
    <div className="flex justify-between items-start">
      <div className="text-gold">{icon}</div>
      {count && <span className="bg-navy text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{count}</span>}
    </div>
    <span className="font-bold text-sm text-navy">{label}</span>
  </Card>
);

const NavItem = ({ icon, active = false, onClick }: { icon: React.ReactNode, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-colors ${active ? 'bg-navy/5 text-navy' : 'text-navy/30 hover:text-navy'}`}>
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
  </button>
);

const ChevronRight = ({ className }: { className?: string }) => <ArrowRight className={`rotate-0 ${className}`} />;
