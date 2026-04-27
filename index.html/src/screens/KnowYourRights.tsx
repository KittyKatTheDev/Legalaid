import React, { useState } from 'react';
import { Button, Card, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  ShieldAlert, 
  Hand, 
  UserRound, 
  Scale, 
  FileWarning, 
  Languages,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const KnowYourRights: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;

  const RIGHTS_CONTENT = [
    {
      icon: <Hand className="w-8 h-8 text-red-500" />,
      title: t('rights.item1_title', lang),
      desc: t('rights.item1_desc', lang)
    },
    {
      icon: <Scale className="w-8 h-8 text-red-500" />,
      title: t('rights.item2_title', lang),
      desc: t('rights.item2_desc', lang)
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
      title: t('rights.item3_title', lang),
      desc: t('rights.item3_desc', lang)
    },
    {
      icon: <FileWarning className="w-8 h-8 text-red-500" />,
      title: t('rights.item4_title', lang),
      desc: t('rights.item4_desc', lang)
    }
  ];

  return (
    <Layout onBack={onBack} title={t('rights.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4 pb-24 text-center">
        <div className="flex justify-between items-center">
            <button 
              onClick={() => {
                const next = lang === 'en' ? 'es' : 'en';
                updateUser({ language: next as any });
              }}
              className="px-4 py-1.5 rounded-full bg-navy/5 text-navy text-xs font-bold flex items-center gap-2"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? t('rights.view_es', lang) : t('rights.view_en', lang)}
            </button>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-left">
           <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
              <div className="space-y-1">
                 <h4 className="font-bold text-red-700 text-sm">
                    {t('rights.emergency_title', lang)}
                 </h4>
                 <p className="text-xs text-red-600 leading-relaxed font-medium">
                    {t('rights.emergency_desc', lang)}
                 </p>
              </div>
           </div>
        </div>

        <div className="space-y-4 text-left">
           {RIGHTS_CONTENT.map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
               <Card className="flex items-start gap-4 p-5">
                  <div className="p-3 bg-red-50 rounded-xl shrink-0">{item.icon}</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-navy">
                      {item.title}
                    </h4>
                    <p className="text-xs text-navy/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
               </Card>
             </motion.div>
           ))}
        </div>

        <Card className="bg-navy/5 border-navy/10 flex gap-4 p-4 items-start text-left">
           <div className="p-2 bg-navy rounded-lg shrink-0">
              <Info className="w-4 h-4 text-white" />
           </div>
           <p className="text-[10px] text-navy/60 leading-relaxed font-medium italic">
             {t('rights.disclaimer', lang)}
           </p>
        </Card>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md bg-white border border-navy/5 shadow-2xl rounded-2xl p-4 flex gap-3 z-50">
           <Button fullWidth onClick={onBack}>
              {t('rights.btn_back', lang)}
           </Button>
        </div>
      </div>
    </Layout>
  );
};
