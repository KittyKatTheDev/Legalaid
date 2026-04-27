import { t } from './translations';

export type InterviewCaseType = 'green_card' | 'citizenship' | 'asylum' | 'family';
export type InterviewMode = 'confidence' | 'real';
export type InterviewTone = 'neutral' | 'skeptical' | 'rushed';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  expectedKeywords: string[];
  followUps?: InterviewQuestion[];
  isCurveball?: boolean;
}

export const getQuestionBank = (caseType: InterviewCaseType, lang: 'en' | 'es' | 'mix'): InterviewQuestion[] => {
  // Generic questions first
  const generic: InterviewQuestion[] = [
    {
      id: 'gen_1',
      question: lang === 'en' ? 'Tell me about yourself.' : 'Hábleme de usted.',
      category: lang === 'en' ? 'Background' : 'Información Personal',
      expectedKeywords: ['name', 'born', 'live', 'nombre', 'nací', 'vivo'],
    },
    {
      id: 'gen_2',
      question: lang === 'en' ? 'When did you last enter the United States?' : '¿Cuándo fue la última vez que entró a los Estados Unidos?',
      category: lang === 'en' ? 'Entry History' : 'Historial de Entrada',
      expectedKeywords: ['date', 'port', 'visa', 'fecha', 'puerto', 'entrada'],
    }
  ];

  const specialized: Record<InterviewCaseType, InterviewQuestion[]> = {
    green_card: [
      {
        id: 'gc_1',
        question: lang === 'en' ? 'How did you meet your spouse?' : '¿Cómo conoció a su cónyuge?',
        category: lang === 'en' ? 'Relationship' : 'Relación',
        expectedKeywords: ['first', 'met', 'married', 'conocí', 'primera', 'casamos'],
        followUps: [
          {
            id: 'gc_1_f1',
            question: lang === 'en' ? 'What happened on your first date?' : '¿Qué pasó en su primera cita?',
            category: lang === 'en' ? 'Relationship' : 'Relación',
            expectedKeywords: ['date', 'dinner', 'movie', 'cita', 'cena', 'película'],
          }
        ]
      },
      {
        id: 'gc_2',
        question: lang === 'en' ? 'Have you ever worked without authorization?' : '¿Alguna vez ha trabajado sin autorización?',
        category: lang === 'en' ? 'Admissibility' : 'Admisibilidad',
        expectedKeywords: ['no', 'never', 'authorized', 'nunca', 'autorizado'],
        isCurveball: true
      }
    ],
    citizenship: [
      {
        id: 'cit_1',
        question: lang === 'en' ? 'What is the supreme law of the land?' : '¿Cuál es la ley suprema de la nación?',
        category: lang === 'en' ? 'Civics' : 'Educación Cívica',
        expectedKeywords: ['Constitution', 'Constitución'],
      },
      {
        id: 'cit_2',
        question: lang === 'en' ? 'Do you support the Constitution and form of government of the United States?' : '¿Apoya usted la Constitución y el sistema de gobierno de los Estados Unidos?',
        category: lang === 'en' ? 'Oath' : 'Juramento',
        expectedKeywords: ['yes', 'support', 'sí', 'apoyo'],
      }
    ],
    asylum: [
      {
        id: 'asy_1',
        question: lang === 'en' ? 'Why are you afraid to return to your country?' : '¿Por qué tiene miedo de regresar a su país?',
        category: lang === 'en' ? 'Fear' : 'Miedo',
        expectedKeywords: ['harm', 'afraid', 'safety', 'daño', 'miedo', 'seguridad'],
      },
      {
        id: 'asy_2',
        question: lang === 'en' ? 'Who exactly threatened you?' : '¿Quién exactamente le amenazó?',
        category: lang === 'en' ? 'Detail' : 'Detalle',
        expectedKeywords: ['who', 'specific', 'name', 'quién', 'específico', 'nombre'],
      }
    ],
    family: [
      {
        id: 'fam_1',
        question: lang === 'en' ? 'What is your petitioners relationship to you?' : '¿Cuál es el parentesco del peticionario con usted?',
        category: lang === 'en' ? 'Eligibility' : 'Elegibilidad',
        expectedKeywords: ['father', 'mother', 'brother', 'sister', 'padre', 'madre', 'hermano', 'hermana'],
      },
      {
        id: 'fam_2',
        question: lang === 'en' ? 'When was the last time you saw each other in person?' : '¿Cuándo fue la última vez que se vieron en persona?',
        category: lang === 'en' ? 'Verification' : 'Verificación',
        expectedKeywords: ['date', 'visit', 'year', 'fecha', 'visita', 'año'],
      }
    ]
  };

  return [...generic, ...specialized[caseType]];
};

export const COMMON_MISTAKES = (lang: 'en' | 'es' | 'mix') => [
  {
    title: lang === 'en' ? 'Guessing Answers' : 'Adivinar las respuestas',
    desc: lang === 'en' ? "If you don't know, say 'I don't recall'. Guessing can damage your credibility." : "Si no lo sabe, diga 'No lo recuerdo'. Adivinar puede dañar su credibilidad.",
    icon: 'AlertTriangle'
  },
  {
    title: lang === 'en' ? 'Changing Timelines' : 'Cambiar los tiempos',
    desc: lang === 'en' ? 'Inconsistency in dates is a major red flag for officers.' : 'Las fechas inconsistentes son una señal de alerta para los oficiales.',
    icon: 'Calendar'
  },
  {
    title: lang === 'en' ? 'Overexplaining' : 'Explicar de más',
    desc: lang === 'en' ? 'Keep answers direct. Irrelevant details can lead to confusing follow-up questions.' : 'Sea directo. Los detalles irrelevantes pueden llevar a preguntas de seguimiento confusas.',
    icon: 'MessageSquare'
  },
  {
    title: lang === 'en' ? 'Scripted Responses' : 'Respuestas ensayadas',
    desc: lang === 'en' ? 'Avoid sounding like you memorized a script. Be natural.' : 'Evite sonar como si hubiera memorizado un guión. Sea natural.',
    icon: 'Frown'
  }
];
