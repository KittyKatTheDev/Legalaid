export type ScreenId = 
  | 'LANDING'
  | 'SIGNUP'
  | 'LANGUAGE'
  | 'CASE_TYPE'
  | 'INTAKE'
  | 'CASE_SUMMARY'
  | 'DASHBOARD'
  | 'CHECKLIST'
  | 'UPLOAD'
  | 'REVIEW'
  | 'FORMS'
  | 'ROADMAP'
  | 'TIMELINE'
  | 'AI_ASSISTANT'
  | 'WHATSAPP'
  | 'FAMILY'
  | 'NEXT_STEPS'
  | 'PREMIUM'
  | 'SUPPORT'
  | 'INTERVIEW_SIMULATOR'
  | 'TUTORIAL'
  | 'KNOW_YOUR_RIGHTS'
  | 'LAWYER_CHAT'
  | 'FORM_AUTOFILL'
  | 'PROGRESS_SCORE'
  | 'SMART_ALERTS'
  | 'VOICE_INPUT'
  | 'CHECKLIST'
  | 'ELIGIBILITY_CHECK'
  | 'LAWYER_AI'
  | 'AI_GUIDE';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  language: 'en' | 'es' | 'mix' | 'other';
  caseType: string;
  isPremium: boolean;
  progress: number;
  isSimplifiedMode?: boolean;
}
