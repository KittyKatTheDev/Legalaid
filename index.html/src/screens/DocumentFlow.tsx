import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, Badge } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { CheckCircle2, Upload, Camera, AlertCircle, Trash2, Edit2, Check, ShieldCheck, Sparkles, ListChecks, Plus, Search, Scan } from 'lucide-react';
import { motion } from 'motion/react';
import { t } from '../lib/translations';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

export const Checklist: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const items = [
    { name: t('checklist.item1', lang), status: 'complete' },
    { name: t('checklist.item2', lang), status: 'missing', id: 'UPLOAD' },
    { name: t('checklist.item3', lang), status: 'review' },
    { name: t('checklist.item4', lang), status: 'missing', id: 'UPLOAD' },
  ];

  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full">
                 <ListChecks className="w-3 h-3 text-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold">{lang === 'es' ? 'Documentación Requerida' : 'Required Documentation'}</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('checklist.title', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('checklist.subtitle', lang)}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/20 mb-1">{lang === 'es' ? 'Estado General' : 'Overall Status'}</p>
              <Badge variant="outline" className="text-navy/60 border-navy/10 font-black uppercase tracking-widest">
                 {items.filter(i => i.status === 'complete').length} / {items.length} {lang === 'es' ? 'Completado' : 'Completed'}
              </Badge>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {items.map((item, i) => (
            <Card key={i} className="p-8 flex items-center justify-between hover:bg-gold/5 transition-colors group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  item.status === 'complete' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 
                  item.status === 'review' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 
                  'bg-navy/5 text-navy/20 border-2 border-dashed border-navy/10'
                }`}>
                  {item.status === 'complete' ? <CheckCircle2 className="w-6 h-6" /> : 
                   item.status === 'review' ? <AlertCircle className="w-6 h-6" /> : 
                   <div className="text-xs font-black">{i + 1}</div>}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-navy uppercase tracking-tighter">{item.name}</h4>
                  <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${
                    item.status === 'complete' ? 'text-green-500' : 
                    item.status === 'review' ? 'text-amber-500' : 
                    'text-navy/30'
                  }`}>
                    {item.status === 'complete' ? t('checklist.status_complete', lang) : 
                     item.status === 'review' ? t('checklist.status_review', lang) : 
                     t('checklist.status_missing', lang)}
                  </p>
                </div>
              </div>
              
              {item.status !== 'complete' && (
                <Button 
                  variant={item.status === 'missing' ? 'primary' : 'outline'}
                  size="sm" 
                  onClick={() => onNext('UPLOAD')} 
                  className="px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  {item.status === 'missing' ? t('checklist.btn_upload', lang) : (lang === 'es' ? 'Ver Detalles' : 'View Details')}
                </Button>
              )}
            </Card>
          ))}
        </div>

        <div className="pt-12 border-t border-navy/5 flex gap-4">
           <Button variant="outline" className="px-12 py-4 rounded-2xl border-navy/10 text-navy/40 uppercase tracking-widest font-black text-xs" onClick={onBack}>
              {t('nav.back', lang)}
           </Button>
           <Button className="flex-1 py-4 rounded-2xl text-lg font-black uppercase tracking-widest shadow-premium" onClick={() => onNext('UPLOAD')}>
              <Plus className="w-5 h-5 mr-3" /> {t('checklist.btn_upload', lang)}
           </Button>
        </div>
      </div>
    </Layout>
  );
};

export const DocumentUpload: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [useAnonymous, setUseAnonymous] = useState(false);
  const lang = user.language;
  const [docType, setDocType] = useState('Green Card');

  const docTypes = ['Green Card', 'Passport', 'Work Permit', 'Driver\'s License'];

  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full">
                 <Upload className="w-3 h-3 text-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold">{lang === 'es' ? 'Portal de Carga' : 'Upload Portal'}</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('upload.title', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('upload.desc', lang)}</p>
           </div>
           <div className="flex items-center gap-4 p-4 bg-navy/[0.02] border border-navy/5 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-navy/20" />
              <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">{lang === 'es' ? 'Cifrado de 256 bits' : '256-bit Encryption'}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-1 space-y-8">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30">{t('upload.type_label', lang)}</h3>
                 <div className="grid grid-cols-1 gap-3">
                    {docTypes.map(type => (
                      <button 
                        key={type}
                        onClick={() => setDocType(type)}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                          docType === type ? 'bg-navy text-white border-navy shadow-lg' : 'bg-white text-navy border-navy/5 hover:border-navy/20'
                        }`}
                      >
                         <p className="text-xs font-black uppercase tracking-widest">{type}</p>
                         <p className="text-[10px] opacity-40 font-bold uppercase">{lang === 'es' ? 'Requerido' : 'Required'}</p>
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                 <button 
                  onClick={() => onNext('REVIEW')}
                  className="w-full h-72 border-4 border-dashed border-navy/10 rounded-[3rem] flex flex-col items-center justify-center gap-6 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                 >
                    <div className="w-20 h-20 bg-navy text-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                       <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-2">
                       <h4 className="text-2xl font-black text-navy uppercase tracking-tighter">{t('upload.storage_btn', lang)}</h4>
                       <p className="text-sm text-navy/40 font-medium italic">{lang === 'es' ? 'PDF, JPG o PNG hasta 10MB' : 'PDF, JPG or PNG up to 10MB'}</p>
                    </div>
                 </button>

                 <div className="flex gap-6">
                    <Card className="flex-1 p-8 bg-cream/30 border-navy/5 hover:border-navy/10 transition-all flex flex-col items-center gap-4 text-center cursor-pointer" onClick={() => onNext('REVIEW')}>
                       <Camera className="w-8 h-8 text-navy/20" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-navy">{t('upload.camera_btn', lang)}</span>
                    </Card>
                    <Card className="flex-1 p-8 bg-cream/30 border-navy/5 hover:border-navy/10 transition-all flex flex-col items-center gap-4 text-center cursor-pointer">
                       <Search className="w-8 h-8 text-navy/20" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-navy">{lang === 'es' ? 'Explorar Cloud' : 'Browse Cloud'}</span>
                    </Card>
                 </div>
              </div>

              <div className="flex items-center justify-between p-8 bg-navy text-white rounded-[2rem] shadow-premium">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold">{t('upload.anonymous', lang)}</span>
                    <p className="text-xs font-medium text-white/50 italic">{lang === 'es' ? 'No guardamos su identidad en nuestros servidores.' : 'We do not store your identity on our servers.'}</p>
                 </div>
                 <button 
                  onClick={() => setUseAnonymous(!useAnonymous)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${useAnonymous ? 'bg-gold' : 'bg-white/10'}`}
                 >
                    <motion.div 
                      animate={{ x: useAnonymous ? 30 : 4 }}
                      className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export const ReviewExtraction: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [isScanning, setIsScanning] = useState(true);
  const lang = user.language;
  
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { label: 'Full Name', value: 'JUAN RODRIGUEZ', confidence: 99 },
    { label: 'Date of Birth', value: '12/04/1988', confidence: 100 },
    { label: 'Document Number', value: 'AB-987654321', confidence: 98 },
    { label: 'A-Number', value: 'A123-456-789', confidence: 97 },
    { label: 'Expiration Date', value: '01/01/2030', confidence: 82 },
    { label: 'Issuing Country', value: 'MEXICO', confidence: 95 },
    { label: 'Place of Birth', value: 'GUADALAJARA', confidence: 64 },
  ];

  const getConfidenceColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50 px-2 py-1 rounded-md';
    if (score >= 85) return 'text-amber-600 bg-amber-50 px-2 py-1 rounded-md';
    return 'text-red-500 bg-red-50 px-2 py-1 rounded-md';
  };

  if (isScanning) {
    return (
      <Layout showHeader={false} user={user} updateUser={updateUser}>
        <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-12">
           <div className="relative w-80 h-96 bg-white rounded-[3rem] shadow-premium border-2 border-navy/5 overflow-hidden">
              <motion.div 
                animate={{ y: [0, 400, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_20px_rgba(212,166,74,0.8)] z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-10">
                 <Scan className="w-24 h-24 text-navy" />
              </div>
           </div>
           <div className="text-center space-y-4">
              <div className="flex justify-center">
                 <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
              </div>
              <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">{t('review.scanning', lang)}</h2>
              <p className="text-[10px] text-navy/30 font-black uppercase tracking-[0.3em] px-8 max-w-sm">{t('review.scanning_desc', lang)}</p>
           </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onBack={onBack} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-navy/5 pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                 <Check className="w-3 h-3 text-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{t('checklist.status_complete', lang)}</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('review.title', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('review.subtitle', lang)}</p>
           </div>
           <div className="bg-navy p-6 rounded-2xl text-white flex items-center gap-4 shadow-xl">
              <Sparkles className="w-6 h-6 text-gold" />
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{lang === 'es' ? 'Precisión IA' : 'AI Accuracy'}</p>
                 <p className="text-lg font-black tracking-tighter uppercase">94.5%</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2 space-y-6">
              <Card className="divide-y divide-navy/5 p-0 overflow-hidden border-none shadow-premium">
                {data.map((item) => (
                  <div key={item.label} className="p-8 flex justify-between items-center group transition-colors hover:bg-navy/[0.01]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-navy/20">{item.label}</span>
                        <span className={`text-[8px] font-black uppercase tracking-wider ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence < 90 && <AlertCircle className="w-2.5 h-2.5 inline mr-1" />}
                          {item.confidence}% {t('review.match_suffix', lang)}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-navy tracking-tighter uppercase">{item.value}</p>
                    </div>
                    <button className="w-12 h-12 rounded-xl bg-navy/5 text-navy/20 hover:bg-gold hover:text-white transition-all flex items-center justify-center">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </Card>
           </div>

           <div className="space-y-8">
              <Card className="p-8 bg-gold/5 border-gold/20 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{lang === 'es' ? 'Sugerencias de IA' : 'AI Suggestions'}</h4>
                 <div className="flex gap-4 items-start">
                    <Sparkles className="w-6 h-6 text-gold shrink-0" />
                    <p className="text-[11px] text-navy/60 leading-relaxed font-bold italic">
                       "{t('review.tip', lang)}"
                    </p>
                 </div>
              </Card>

              <div className="space-y-4">
                 <Button fullWidth size="lg" className="h-20 rounded-[2rem] shadow-premium text-lg font-black uppercase tracking-widest" onClick={() => onNext('DASHBOARD')}>
                    <Check className="w-6 h-6 mr-3" /> {t('review.confirm_btn', lang)}
                 </Button>
                 <Button variant="ghost" fullWidth onClick={onBack} className="text-navy/30 font-black uppercase tracking-[0.2em] text-[10px]">
                    {t('review.rescan_btn', lang)}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};
