import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, Badge } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { CheckCircle2, Upload, Camera, AlertCircle, Trash2, Edit2, Check, ShieldCheck, Sparkles } from 'lucide-react';
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
    { name: t('checklist.item2', lang), status: 'missing' },
    { name: t('checklist.item3', lang), status: 'review' },
    { name: t('checklist.item4', lang), status: 'missing' },
  ];

  return (
    <Layout onBack={onBack} title={t('checklist.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('checklist.subtitle', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('checklist.desc', lang)}</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.name} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.status === 'complete' ? (
                  <div className="bg-green-100 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                ) : item.status === 'review' ? (
                  <div className="bg-amber-100 p-1.5 rounded-full"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
                ) : (
                  <div className="bg-navy/5 p-1.5 rounded-full w-8 h-8 border border-navy/10" />
                )}
                <div>
                  <span className="font-bold text-navy text-sm">{item.name}</span>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${item.status === 'complete' ? 'text-green-600' : item.status === 'review' ? 'text-amber-600' : 'text-navy/30'}`}>
                    {item.status === 'complete' ? t('checklist.status_complete', lang) : item.status === 'review' ? t('checklist.status_review', lang) : t('checklist.status_missing', lang)}
                  </p>
                </div>
              </div>
              {item.status === 'missing' && (
                <Button variant="ghost" size="sm" onClick={() => onNext('UPLOAD')} className="text-gold">{t('checklist.status_missing', lang)}</Button>
              )}
            </Card>
          ))}
        </div>

        <div className="pt-4 space-y-4">
          <Button fullWidth onClick={() => onNext('UPLOAD')}>{t('checklist.btn_upload', lang)}</Button>
          <Button variant="outline" fullWidth onClick={onBack}>{t('nav.back', lang)}</Button>
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
    <Layout onBack={onBack} title={t('upload.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-navy">{t('upload.header', lang)}</h2>
          <p className="text-navy/60">{t('upload.desc', lang)}</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-navy/30">{t('upload.type_label', lang)}</label>
          <div className="grid grid-cols-2 gap-2">
            {docTypes.map(type => (
              <button 
                key={type}
                onClick={() => setDocType(type)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${docType === type ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/10 hover:border-navy/30'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button size="lg" className="h-40 flex flex-col gap-3 rounded-3xl" onClick={() => onNext('REVIEW')}>
             <Upload className="w-8 h-8" />
             <span>{t('upload.storage_btn', lang)} ({docType})</span>
          </Button>
          <Button variant="outline" size="lg" className="h-40 flex flex-col gap-3 rounded-3xl" onClick={() => onNext('REVIEW')}>
             <Camera className="w-8 h-8" />
             <span>{t('upload.camera_btn', lang)}</span>
          </Button>
        </div>

        <Card className="bg-navy/5 border-navy/10">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-navy/40" />
              <p className="text-xs text-navy/60 leading-relaxed font-medium">
                {t('upload.privacy_note', lang)}
              </p>
           </div>
        </Card>

        <div className="flex items-center justify-between p-2">
           <span className="text-sm font-bold text-navy">{t('upload.anonymous', lang)}</span>
           <button 
            onClick={() => setUseAnonymous(!useAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors relative ${useAnonymous ? 'bg-gold' : 'bg-navy/20'}`}
           >
              <motion.div 
                animate={{ x: useAnonymous ? 24 : 4 }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
              />
           </button>
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
    if (score >= 95) return 'text-green-600 bg-green-50 px-1.5 rounded-sm';
    if (score >= 85) return 'text-amber-600 bg-amber-50 px-1.5 rounded-sm';
    return 'text-red-500 bg-red-50 px-1.5 rounded-sm';
  };

  if (isScanning) {
    return (
      <Layout showHeader={false} user={user} updateUser={updateUser}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
           <div className="relative w-64 h-80 bg-navy/5 rounded-3xl border-2 border-dashed border-navy/20 overflow-hidden">
              <motion.div 
                animate={{ y: [0, 240, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1 bg-gold shadow-[0_0_15px_rgba(212,166,74,1)] z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <Camera className="w-16 h-16 text-navy" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-navy">{t('review.scanning', lang)}</h2>
              <p className="text-xs text-navy/40 font-bold uppercase tracking-widest px-8">{t('review.scanning_desc', lang)}</p>
           </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onBack={onBack} title={t('review.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-navy">{t('review.title', lang)}</h2>
            <div className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{t('checklist.status_complete', lang)}</div>
          </div>
          <p className="text-navy/60 text-sm">{t('review.subtitle', lang)}</p>
        </div>

        <div className="space-y-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-navy/30 ml-4">{t('review.fields_label', lang)}</span>
           <Card className="divide-y divide-navy/5 p-0 overflow-hidden border-gold/20">
            {data.map((item) => (
              <div key={item.label} className="p-4 flex justify-between items-center group hover:bg-navy/[0.02]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-navy/30">{item.label}</span>
                    <span className={`text-[8px] font-bold ${getConfidenceColor(item.confidence)} flex items-center gap-1`}>
                      {item.confidence < 90 && <AlertCircle className="w-2 h-2" />}
                      {item.confidence}% {t('review.match_suffix', lang)}
                    </span>
                  </div>
                  <p className="font-bold text-navy tracking-tight">{item.value}</p>
                </div>
                <button className="p-2 text-navy/20 hover:text-gold transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
           </Card>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-gold/5 border border-gold/10 p-4 rounded-2xl flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-gold shrink-0" />
            <p className="text-[11px] text-navy/60 leading-relaxed italic">
              "{t('review.tip', lang)}"
            </p>
          </div>
          <Button fullWidth onClick={() => onNext('DASHBOARD')}>
            <Check className="w-5 h-5 mr-2" /> {t('review.confirm_btn', lang)}
          </Button>
          <Button variant="ghost" fullWidth onClick={onBack}>{t('review.rescan_btn', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};
