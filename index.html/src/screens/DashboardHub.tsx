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
  HelpCircle,
  Scale
} from 'lucide-react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const DashboardHub: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('nav.dashboard', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-12 max-w-6xl mx-auto">
        
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full">
                 <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold">{lang === 'es' ? 'Caso Activo' : 'Active Case'}</span>
              </div>
              <h2 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">
                 {lang === 'es' ? 'Bienvenido, ' : 'Welcome, '} {user.firstName || 'User'}
              </h2>
              <p className="text-lg text-navy/40 font-medium italic">{user.caseType}</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <Button onClick={() => onNext('UPLOAD')} className="flex-1 md:px-8">
                 <Plus className="w-4 h-4 mr-2" /> {lang === 'es' ? 'Nuevo Documento' : 'New Document'}
              </Button>
              <Button variant="outline" onClick={() => onNext('ROADMAP')} className="flex-1 md:px-8">
                 <Map className="w-4 h-4 mr-2" /> {lang === 'es' ? 'Ver Mapa' : 'View Roadmap'}
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Stats Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Big Progress Card */}
            <Card className="p-10 space-y-8 bg-white border-navy/5 shadow-premium">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="font-black text-xs uppercase tracking-[0.3em] text-navy/30">{t('dash.case_progress', lang)}</h3>
                     <p className="text-3xl font-black text-navy uppercase tracking-tighter">{t('dash.readiness', lang)}</p>
                  </div>
                  <div className="text-6xl font-black text-gold tracking-tighter">{user.progress}%</div>
               </div>
               <div className="space-y-4">
                  <ProgressBar progress={user.progress} className="h-4 rounded-full bg-navy/5" />
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-navy/40 grayscale">
                     <span>{lang === 'es' ? 'Inicio del Proceso' : 'Start Process'}</span>
                     <span className="text-gold opacity-100 grayscale-0">{lang === 'es' ? 'Presentación' : 'Filing'}</span>
                     <span>{lang === 'es' ? 'Aprobación' : 'Approval'}</span>
                  </div>
               </div>
               <div className="pt-6 border-t border-navy/5">
                  <Button variant="ghost" className="p-0 text-gold hover:bg-transparent font-black uppercase tracking-widest text-xs" onClick={() => onNext('CHECKLIST')}>
                     {t('dash.missing', lang)} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </Card>

            {/* AI Advisor Preview */}
            <Card className="bg-navy p-10 text-white relative overflow-hidden group cursor-pointer border-none shadow-2xl" onClick={() => onNext('AI_ASSISTANT')}>
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-500">
                  <Sparkles className="w-32 h-32 text-gold" />
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gold text-navy rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter">{t('dash.ai_assistant', lang)}</h4>
                  </div>
                  <p className="text-lg text-white/50 leading-relaxed italic max-w-xl">
                     {lang === 'es' ? 'Basado en su formulario N-400, tiene 2 documentos pendientes por subir para completar su caso.' : 'Based on your N-400 form, you have 2 pending documents to upload to complete your case.'}
                  </p>
                  <Button variant="secondary" className="px-8 font-black uppercase tracking-widest text-xs">{lang === 'es' ? 'Consultar con IA' : 'Consult AI'}</Button>
               </div>
            </Card>

            {/* Desktop Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { id: 'CHECKLIST', icon: <FileText />, label: t('dash.checklist', lang), count: 2 },
                 { id: 'INTERVIEW_SIMULATOR', icon: <Mic />, label: t('dash.practice', lang) },
                 { id: 'ROADMAP', icon: <Map />, label: lang === 'es' ? 'RutaCrítica' : 'Roadmap' },
                 { id: 'FAMILY', icon: <Users />, label: t('dash.family', lang) }
               ].map((action) => (
                 <Card 
                  key={action.id} 
                  onClick={() => onNext(action.id as ScreenId)} 
                  className="p-8 flex flex-col items-center justify-center gap-4 aspect-square text-center hover:bg-gold/5 transition-colors group"
                >
                    <div className="text-gold group-hover:scale-110 transition-transform">
                       {React.cloneElement(action.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-navy leading-none">{action.label}</span>
                    {action.count && (
                       <span className="bg-navy text-white text-[8px] font-black px-2 py-1 rounded-full">{action.count} PENDIENTE</span>
                    )}
                 </Card>
               ))}
            </div>
          </div>

          {/* Sidebar / Secondary Info */}
          <div className="space-y-8">
            
            {/* Next Step Card */}
            <Card className="bg-[#FFFAF0] border-gold/20 p-8 space-y-6">
               <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-black">{t('dash.current_step', lang)}</span>
                  <h4 className="text-2xl font-black text-navy uppercase tracking-tighter">{t('dash.step_temp', lang)}</h4>
               </div>
              <p className="text-sm text-navy/50 font-medium">Requisito esencial para procesar su solicitud de naturalización.</p>
               <Button variant="primary" fullWidth size="lg" onClick={() => onNext('UPLOAD')} className="rounded-2xl">
                  {t('btn.continue', lang)}
               </Button>
            </Card>

            {/* Premium Support */}
            {!user.isPremium && (
              <Card className="bg-gradient-to-br from-gold/20 to-gold/5 border-gold/30 p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-gold rounded-2xl shrink-0 shadow-lg shadow-gold/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-navy uppercase tracking-tighter text-lg">{t('dash.support_title', lang)}</h4>
                    <p className="text-xs text-navy/60 leading-relaxed font-medium">{t('dash.support_desc', lang)}</p>
                  </div>
                </div>
                <Button variant="outline" fullWidth className="border-gold text-navy hover:bg-gold/10 font-black uppercase tracking-widest text-[10px]" onClick={() => onNext('PREMIUM')}>
                  {t('dash.upgrade_btn', lang)}
                </Button>
              </Card>
            )}

            {/* WhatsApp Integration */}
            <Card 
              onClick={() => onNext('WHATSAPP')}
              className="bg-[#25D366]/5 border-[#25D366]/20 p-8 space-y-6 cursor-pointer group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                     <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-0.5">
                     <h5 className="font-black text-navy text-xs uppercase tracking-widest">{t('dash.connect_whatsapp', lang)}</h5>
                     <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest">Active Chat</p>
                  </div>
               </div>
               <p className="text-xs text-navy/60 leading-relaxed italic">{t('dash.whatsapp_desc', lang)}</p>
            </Card>

            {/* Legal Disclaimer / Help */}
            <div className="p-8 space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/20">{lang === 'es' ? 'Recursos Adicionales' : 'Additional Resources'}</h5>
                <ul className="space-y-4">
                   <li onClick={() => onNext('TUTORIAL')} className="flex items-center gap-3 text-xs font-black text-navy/40 hover:text-navy cursor-pointer transition-colors uppercase tracking-widest">
                      <HelpCircle className="w-4 h-4" /> {t('dash.tutorial_btn', lang)}
                   </li>
                   <li className="flex items-center gap-3 text-xs font-black text-navy/40 hover:text-navy cursor-pointer transition-colors uppercase tracking-widest">
                      <Scale className="w-4 h-4" /> {lang === 'es' ? 'Glosario Legal' : 'Legal Glossary'}
                   </li>
                </ul>
            </div>
          </div>
        </div>
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
