import React, { useState } from 'react';
import { Button, Card, Layout } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { FileText, CheckCircle2, Sparkles, Download, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
}

export const FormAutofill: React.FC<ScreenProps> = ({ onBack, onNext, user, updateUser }) => {
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [complete, setComplete] = useState(false);

  const forms = [
    { id: 'N-400', name: 'Application for Naturalization', status: 'Ready' },
    { id: 'I-130', name: 'Petition for Alien Relative', status: 'In Progress' },
    { id: 'I-765', name: 'Application for Employment Authorization', status: 'Ready' }
  ];

  const startAutofill = () => {
    setIsAutofilling(true);
    setTimeout(() => {
      setIsAutofilling(false);
      setComplete(true);
    }, 3000);
  };

  return (
    <Layout onBack={onBack} title="Smart Autofill" user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">One-Click Autofill</h2>
          <p className="text-navy/60">We use your verified profile data to fill out all required USCIS forms instantly.</p>
        </div>

        <div className="space-y-3">
          {forms.map(form => (
            <Card key={form.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-navy/5 rounded-lg text-navy">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-navy/30">{form.id}</p>
                  <p className="text-sm font-bold text-navy">{form.name}</p>
                </div>
              </div>
              {complete ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-navy/5" />
              )}
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <Button 
            fullWidth 
            size="lg" 
            onClick={complete ? () => onNext('DASHBOARD') : startAutofill}
            disabled={isAutofilling}
            className="flex items-center justify-center gap-2"
          >
            {isAutofilling ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                AI is Filling Forms...
              </>
            ) : complete ? (
              <>Go to Dashboard <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Autofill All Forms Now</>
            )}
          </Button>
        </div>

        {complete && (
          <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-4">
             <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
             <p className="text-[11px] text-green-800 leading-relaxed font-medium">
               Success! We have generated 3 forms with 98% accuracy. Please review each form before submitting to USCIS.
             </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
