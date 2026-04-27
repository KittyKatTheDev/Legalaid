import React from 'react';
import { Button, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { Sparkles } from 'lucide-react';
import { t } from '../lib/translations';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  user: UserData;
  title: string;
}

export const FeaturePlaceholder: React.FC<ScreenProps> = ({ onBack, title, user }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={title}>
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-gold animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{title}</h2>
          <p className="text-navy/60 max-w-xs">{t('feature.placeholder.desc', lang)}</p>
        </div>
        <Button onClick={onBack}>{t('feature.back_btn', lang)}</Button>
      </div>
    </Layout>
  );
};
