import React, { useState } from 'react';
import { Button, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  Smartphone, 
  Camera, 
  MessagesSquare, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../lib/translations';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

const TUTORIAL_STEPS: { 
  icon: React.ReactNode, 
  titleKey: string, 
  descKey: string 
}[] = [
  {
    icon: <Scale className="w-12 h-12 text-gold" />,
    titleKey: 'help.step1_title',
    descKey: 'help.step1_desc'
  },
  {
    icon: <Camera className="w-12 h-12 text-gold" />,
    titleKey: 'help.step2_title',
    descKey: 'help.step2_desc'
  },
  {
    icon: <Sparkles className="w-12 h-12 text-gold" />,
    titleKey: 'help.step3_title',
    descKey: 'help.step3_desc'
  },
  {
    icon: <ChevronRight className="w-12 h-12 text-gold" />,
    titleKey: 'help.step4_title',
    descKey: 'help.step4_desc'
  }
];

export const Tutorial: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const lang = user.language;

  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext('LANDING');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack?.();
    }
  };

  return (
    <Layout showHeader={false} user={user} updateUser={updateUser}>
      <div className="flex flex-col min-h-[85vh] justify-between py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <span className="text-[10px] font-black text-navy uppercase tracking-widest">{t('brand.name', lang)} Guide</span>
            </div>
            <span className="text-xs font-black text-navy/20 uppercase tracking-widest">
              {currentStep + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>

          <div className="flex flex-col items-center text-center space-y-6 pt-10">
            <motion.div 
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gold/10 rounded-3xl flex items-center justify-center p-4 shadow-inner"
            >
              {step.icon}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={`${currentStep}-${lang}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="space-y-4 px-4"
              >
                <h2 className="text-3xl font-black text-navy leading-none">
                  {t(step.titleKey as any, lang)}
                </h2>
                <p className="text-lg text-navy/60 leading-relaxed font-medium">
                  {t(step.descKey as any, lang)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-1 justify-center">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-gold' : 'w-2 bg-navy/10'}`} 
              />
            ))}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handlePrev}
            >
              {currentStep === 0 ? t('tutorial.btn.exit', lang) : t('tutorial.btn.back', lang)}
            </Button>
            <Button 
              className="flex-1"
              onClick={handleNext}
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? t('tutorial.btn.finish', lang) : t('tutorial.btn.next', lang)}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
