/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, UserData } from './types';
import { 
  Landing, 
  Signup, 
  LanguageSelection, 
  CaseTypeSelection 
} from './screens/Onboarding';
import { 
  Intake, 
  CaseSummary 
} from './screens/IntakeFlow';
import { 
  DashboardHub 
} from './screens/DashboardHub';
import { 
  Checklist, 
  DocumentUpload, 
  ReviewExtraction 
} from './screens/DocumentFlow';
import { 
  Roadmap, 
  Timeline 
} from './screens/Journey';
import { 
  AIAssistant, 
  WhatsAppConnect, 
  FamilyMode, 
  NextSteps 
} from './screens/Tools';
import { 
  PremiumCheckout, 
  Support 
} from './screens/AppSupport';
import { 
  InterviewSimulator 
} from './screens/InterviewSimulator';
import {
  Tutorial
} from './screens/Tutorial';
import { 
  KnowYourRights 
} from './screens/KnowYourRights';
import {
  LawyerChat
} from './screens/LawyerChat';
import {
  FormAutofill
} from './screens/FormAutofill';
import {
  FeaturePlaceholder
} from './screens/FeaturePlaceholder';
import { AnimatePresence, motion } from 'motion/react';
import { t } from './lib/translations';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('LANDING');
  const [user, setUser] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    language: 'en',
    caseType: 'Citizenship / Naturalization',
    isPremium: false,
    progress: 65,
  });

  const [history, setHistory] = useState<ScreenId[]>([]);

  const navigateTo = (screen: ScreenId) => {
    setHistory([...history, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentScreen(prev);
    }
  };

  const updateUser = (data: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const renderScreen = () => {
    const props = {
      onNext: navigateTo,
      onBack: history.length > 0 ? goBack : undefined,
      updateUser,
      user,
    };

    switch (currentScreen) {
      case 'LANDING': return <Landing {...props} />;
      case 'SIGNUP': return <Signup {...props} />;
      case 'LANGUAGE': return <LanguageSelection {...props} />;
      case 'CASE_TYPE': return <CaseTypeSelection {...props} />;
      case 'INTAKE': return <Intake {...props} />;
      case 'CASE_SUMMARY': return <CaseSummary {...props} />;
      case 'DASHBOARD': return <DashboardHub {...props} />;
      case 'CHECKLIST': return <Checklist {...props} />;
      case 'UPLOAD': return <DocumentUpload {...props} />;
      case 'REVIEW': return <ReviewExtraction {...props} />;
      case 'ROADMAP': return <Roadmap {...props} />;
      case 'TIMELINE': return <Timeline {...props} />;
      case 'AI_ASSISTANT': return <AIAssistant {...props} />;
      case 'WHATSAPP': return <WhatsAppConnect {...props} />;
      case 'FAMILY': return <FamilyMode {...props} />;
      case 'NEXT_STEPS': return <NextSteps {...props} />;
      case 'PREMIUM': return <PremiumCheckout {...props} />;
      case 'SUPPORT': return <Support {...props} />;
      case 'INTERVIEW_SIMULATOR': return <InterviewSimulator {...props} />;
      case 'TUTORIAL': return <Tutorial {...props} />;
      case 'KNOW_YOUR_RIGHTS': return <KnowYourRights {...props} />;
      case 'LAWYER_CHAT': return <LawyerChat {...props} />;
      case 'FORM_AUTOFILL': return <FormAutofill {...props} />;
      case 'AI_GUIDE': return <FeaturePlaceholder {...props} title={t('feature.ai_guide', user.language)} />;
      case 'PROGRESS_SCORE': return <FeaturePlaceholder {...props} title={t('feature.progress_score', user.language)} />;
      case 'SMART_ALERTS': return <FeaturePlaceholder {...props} title={t('feature.smart_alerts', user.language)} />;
      case 'VOICE_INPUT': return <FeaturePlaceholder {...props} title={t('feature.voice_input', user.language)} />;
      case 'CHECKLIST': return <FeaturePlaceholder {...props} title={t('feature.smart_checklist', user.language)} />;
      case 'ELIGIBILITY_CHECK': return <FeaturePlaceholder {...props} title={t('feature.eligibility_check', user.language)} />;
      case 'LAWYER_AI': return <FeaturePlaceholder {...props} title={t('feature.lawyer_ai', user.language)} />;
      default: return <Landing {...props} />;
    }
  };

  return (
    <div className="bg-cream min-h-screen selection:bg-gold/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

