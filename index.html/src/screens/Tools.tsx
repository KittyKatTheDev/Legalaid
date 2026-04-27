import React, { useState } from 'react';
import { Button, Card, Layout, ProgressBar } from '../components/Common';
import { ScreenId, UserData } from '../types';
import { 
  MessageSquare, 
  Send, 
  Languages, 
  Sparkles, 
  Phone, 
  Users, 
  Plus, 
  Trash2,
  ChevronRight,
  HelpCircle,
  Brain,
  Mic,
  MicOff,
  Check,
  Copy,
  Scale,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface ScreenProps {
  onNext: (next: ScreenId) => void;
  onBack?: () => void;
  updateUser: (data: Partial<UserData>) => void;
  user: UserData;
}

import { t } from '../lib/translations';

export const AIAssistant: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopyNotice, setShowCopyNotice] = useState(false);
  const [mode, setMode] = useState<'advisor' | 'translator'>('advisor');
  const [scannedDoc, setScannedDoc] = useState<string | null>(null);
  const lang = user.language;

  const topics = [
    t('ai.ex1', lang),
    t('ai.ex2', lang),
    t('ai.ex3', lang)
  ];

  const handleGenerate = () => {
    if (!query.trim() && !scannedDoc) return;
    setIsGenerating(true);
    setResult("");
    
    setTimeout(() => {
      let guidance = "";
      if (mode === 'translator') {
        guidance = lang === 'es' 
          ? `# Traducción Certificada: Certificado de Nacimiento\n\n## Datos Extraídos\n* **Nombre:** Juan Rodriguez\n* **Fecha:** 15 de Mayo, 1992\n* **Lugar:** Oaxaca, México\n\n## Traducción Oficial (Inglés)\nThis is a certified translation of the birth certificate for Juan Rodriguez, born on May 15, 1992 in Oaxaca, Mexico. All data has been verified against the original document provided.\n\n## Próximos Pasos\n1. Guarde este documento para su entrevista.\n2. No es necesario apostillar para trámites de USCIS si la traducción está certificada.`
          : `# Certified Translation: Birth Certificate\n\n## Extracted Data\n* **Name:** Juan Rodriguez\n* **Date:** May 15, 1992\n* **Location:** Oaxaca, Mexico\n\n## Official Translation\nEsta es una traducción certificada del acta de nacimiento de Juan Rodriguez, nacido el 15 de mayo de 1992 en Oaxaca, México. Todos los datos han sido verificados contra el documento original proporcionado.\n\n## Next Steps\n1. Save this document for your interview.\n2. Apostille is not required for USCIS processes if the translation is certified.`;
      } else {
        guidance = lang === 'es' 
          ? `# Plan de Acción Legal: ${user.firstName || 'Usuario'}\n\n## Lo que dice su documento\nEl documento que recibió es una **Notificación de Acción (I-797)**. Significa que el gobierno ha recibido su solicitud y está en proceso de revisión.\n\n## Sus Próximos Pasos (Paso a Paso)\n1. **Revisar Errores:** Verifique que su nombre y fecha de nacimiento sean correctos.\n2. **Guardar el Recibo:** El número de recibo (empieza con LIN, SRC, etc.) es vital para rastrear su caso.\n3. **Cita de Biometría:** Espere una carta con la fecha para sus huellas digitales.\n\n## Resumen en Palabras Simples\n"El gobierno recibió su papel. No tiene que hacer nada ahora, solo esperar la siguiente carta."`
          : `# Legal Action Plan: ${user.firstName || 'User'}\n\n## What your document says\nThe document you received is a **Notice of Action (I-797)**. It means the government has received your application and it is currently being reviewed.\n\n## Your Next Steps (Step-by-Step)\n1. **Check for Errors:** Verify that your name and date of birth are correct.\n2. **Save the Receipt:** The receipt number (starts with LIN, SRC, etc.) is vital for tracking your case.\n3. **Biometrics Appointment:** Wait for a letter with the date for your fingerprints.\n\n## Summary in Simple Words\n"The government got your paperwork. You don't need to do anything right now, just wait for the next letter."`;
      }
      
      setResult(guidance);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `Puente_Legal_Report_${user.firstName || 'User'}.md`;
    document.body.appendChild(element);
    element.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setShowCopyNotice(true);
    setTimeout(() => setShowCopyNotice(false), 2000);
  };

  const { isListening, toggle, transcript, error: voiceError } = useVoiceInput({
    lang: user.language === 'es' ? 'es-ES' : 'en-US',
    onResult: (text) => setQuery(text)
  });

  const handleScanDoc = () => {
    setScannedDoc("document_scan_id_123");
    setMode('advisor');
    setQuery(lang === 'es' ? "¿Qué dice este documento que recibí y qué debo hacer?" : "What does this document I got say and what should I do next?");
  };

  return (
    <Layout onBack={onBack} onNavigate={onNext} activeScreen="TOOLS" title={mode === 'translator' ? "AI Document Translator" : t('dash.ai_assistant', lang)} user={user} updateUser={updateUser}>
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-navy/5 pb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full">
                 <Sparkles className="w-3 h-3 text-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gold">{t('ai.mode_advisor', lang)}</span>
              </div>
              <h1 className="text-5xl font-black text-navy uppercase tracking-tighter leading-none">{t('ai.title', lang)}</h1>
              <p className="text-xl text-navy/40 font-medium italic lowercase">{t('ai.welcome', lang)}</p>
           </div>
           
           <div className="flex bg-navy/5 p-1 rounded-2xl">
              <button 
                onClick={() => setMode('advisor')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'advisor' ? 'bg-navy text-white shadow-xl' : 'text-navy/40 hover:text-navy'}`}
              >
                {t('ai.mode_advisor', lang)}
              </button>
              <button 
                onClick={() => setMode('translator')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'translator' ? 'bg-navy text-white shadow-xl' : 'text-navy/40 hover:text-navy'}`}
              >
                {t('ai.mode_translator', lang)}
              </button>
           </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 gap-12">
          
          {/* Input Panel */}
          {!result && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-8 border-dashed border-2 bg-navy/[0.02] flex flex-col items-center justify-center text-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all group" onClick={handleScanDoc}>
                     <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Scale className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-navy">{lang === 'es' ? 'Escanear Documento' : 'Scan Document'}</h4>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">{lang === 'es' ? 'Analice cartas del gobierno' : 'Analyze government letters'}</p>
                     </div>
                  </Card>
                  <Card className="p-8 border-dashed border-2 bg-navy/[0.02] flex flex-col items-center justify-center text-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all group" onClick={() => { setMode('translator'); setQuery(lang === 'es' ? "Traduce mi acta de nacimiento" : "Translate my birth certificate"); }}>
                     <div className="w-16 h-16 rounded-2xl bg-gold text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Languages className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-navy">{t('ai.mode_translator', lang)}</h4>
                        <p className="text-[10px] text-navy/40 font-bold uppercase">{lang === 'es' ? 'Traduzca actas y certificados' : 'Translate certificates'}</p>
                     </div>
                  </Card>
               </div>

               <Card className="p-10 bg-white border-navy/5 shadow-premium space-y-8">
                  {scannedDoc && (
                    <div className="flex items-center justify-between p-4 bg-gold/5 border border-gold/20 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold">{t('ai.scanned_title', lang)}</span>
                       </div>
                       <button onClick={() => setScannedDoc(null)} className="text-navy/20 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-navy/30">{mode === 'advisor' ? t('ai.topics_header', lang) : t('ai.translate_doc', lang)}</label>
                     <div className="relative">
                        <textarea 
                          value={query || transcript}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={mode === 'advisor' ? t('ai.placeholder', lang) : (lang === 'es' ? 'Escribe qué documento quieres traducir...' : 'Write which document you want to translate...')} 
                          rows={6}
                          className="w-full p-8 rounded-[2rem] border border-navy/10 bg-cream/30 text-lg font-medium outline-none focus:ring-4 focus:ring-gold/10 transition-all resize-none italic"
                        />
                        <div className="absolute right-6 bottom-6 flex gap-4">
                           <button 
                             onClick={toggle}
                             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-navy text-white hover:bg-navy/90'}`}
                           >
                              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                           </button>
                           <Button 
                             onClick={handleGenerate} 
                             disabled={isGenerating || (!query.trim() && !scannedDoc)}
                             size="lg"
                             className="px-10 h-14 rounded-2xl shadow-premium"
                           >
                              {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2 text-gold" />}
                              {isGenerating ? t('common.processing', lang) : (mode === 'advisor' ? t('ai.generate_btn', lang) : t('ai.mode_translator', lang))}
                           </Button>
                        </div>
                     </div>
                  </div>
               </Card>
               
               <div className="flex items-center gap-4 p-6 bg-navy/[0.02] rounded-2xl border border-navy/5">
                  <HelpCircle className="w-5 h-5 text-navy/20" />
                  <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest leading-relaxed">
                     {t('ai.disclaimer', lang)}
                  </p>
               </div>
            </div>
          )}

          {/* Result Panel */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 space-y-8"
              >
                 <div className="relative">
                    <div className="w-24 h-24 border-2 border-gold/10 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Brain className="w-10 h-10 text-gold animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-2 text-center">
                    <p className="text-xl font-black text-navy uppercase tracking-widest">{t('ai.loading', lang)}</p>
                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest">{lang === 'es' ? 'Consultando precedentes legales...' : 'Consulting legal precedents...'}</p>
                 </div>
              </motion.div>
            )}

            {result && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <Card className="p-16 bg-white border-navy/5 shadow-2xl relative overflow-hidden font-serif">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Scale className="w-48 h-48 text-navy" />
                   </div>
                   <div className="flex justify-between items-center mb-16 border-b border-navy/10 pb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-navy flex items-center justify-center rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-gold" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/30">{t('brand.name', lang)}</p>
                            <p className="text-xs font-bold text-navy uppercase">{lang === 'es' ? 'Documento de Orientación' : 'Guidance Document'}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">{lang === 'es' ? 'Fecha de Emisión' : 'Issue Date'}</p>
                         <p className="text-xs font-bold text-navy">{new Date().toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="space-y-10">
                      {result.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black text-navy tracking-tighter mb-8 uppercase font-sans">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-black text-gold uppercase tracking-[0.2em] mt-12 mb-4 font-sans">{line.replace('## ', '')}</h2>;
                        if (line.match(/^\d\./)) return (
                           <div key={i} className="flex gap-4 items-start pl-4 border-l-2 border-gold/20 py-2">
                              <span className="font-sans font-black text-gold mt-1">{line.split('.')[0]}.</span>
                              <p className="text-lg text-navy/80 leading-relaxed italic">{line.split('.').slice(1).join('.').trim()}</p>
                           </div>
                        );
                        return <p key={i} className="text-lg text-navy/70 leading-relaxed italic mb-4">{line}</p>;
                      })}
                   </div>

                   <div className="mt-20 pt-12 border-t-2 border-dashed border-navy/5 flex justify-between items-end">
                      <div className="space-y-2 opacity-30 italic">
                         <p className="text-[10px] font-bold">Puente de Asistencia Legal AI v2.4</p>
                         <p className="text-[8px] max-w-xs">{t('ai.disclaimer', lang)}</p>
                      </div>
                      <div className="flex gap-4">
                         <Button variant="ghost" size="sm" onClick={() => setResult("")} className="text-red-500 font-black uppercase tracking-widest text-[10px]">
                            <Trash2 className="w-4 h-4 mr-2" /> {lang === 'es' ? 'Descartar' : 'Discard'}
                         </Button>
                      </div>
                   </div>
                </Card>

                <div className="flex flex-col md:flex-row gap-4">
                   <Button fullWidth size="lg" onClick={downloadMarkdown} className="h-16 rounded-2xl bg-navy text-white shadow-premium">
                      <FileText className="w-5 h-5 mr-3" /> {t('ai.download_btn', lang)}
                   </Button>
                   <Button fullWidth variant="outline" size="lg" onClick={copyToClipboard} className="h-16 rounded-2xl border-navy/20">
                      {showCopyNotice ? <Check className="w-5 h-5 mr-3 text-green-500" /> : <Copy className="w-5 h-5 mr-3" />}
                      {showCopyNotice ? (lang === 'es' ? 'Copiado' : 'Copied') : t('ai.copy_btn', lang)}
                   </Button>
                </div>
                <Button variant="ghost" fullWidth onClick={() => setResult("")} className="text-navy/30 uppercase font-black tracking-[0.3em] text-[10px]">
                   {lang === 'es' ? 'Volver al Inicio' : 'Return to Home'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export const WhatsAppConnect: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('whatsapp.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-8 py-4">
        <div className="text-center space-y-4">
           <div className="mx-auto w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center">
              <Phone className="w-10 h-10 text-[#25D366]" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold text-navy">{t('whatsapp.subtitle', lang)}</h2>
              <p className="text-navy/60">{t('whatsapp.desc', lang)}</p>
           </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-medium text-navy/70">{t('whatsapp.label', lang)}</label>
           <input type="tel" className="w-full p-4 rounded-xl border border-navy/10 bg-white" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="space-y-4">
           <Button fullWidth onClick={() => onNext('DASHBOARD')} className="bg-[#25D366] hover:bg-[#25D366]/90 border-none">
              {t('whatsapp.btn.connect', lang)}
           </Button>
           <p className="text-[10px] text-center text-navy/40">{t('whatsapp.disclaimer', lang)}</p>
        </div>
      </div>
    </Layout>
  );
};

export const FamilyMode: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  const family = [
    { name: 'Maria Rodriguez', relation: t('family.relation_spouse', lang), cases: 1 },
    { name: 'Juan Jr.', relation: t('family.relation_child', lang), cases: 1 },
  ];

  return (
    <Layout onBack={onBack} title={t('family.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('family.subtitle', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('family.desc', lang)}</p>
        </div>

        <div className="space-y-3">
          {family.map((member) => (
            <Card key={member.name} className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy/5 rounded-full flex items-center justify-center text-navy font-bold">
                    {member.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-sm">{member.name}</h5>
                    <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider">{member.relation} • {member.cases} {t('family.meta', lang)}</p>
                  </div>
               </div>
               <ChevronRight className="w-4 h-4 text-navy/20" />
            </Card>
          ))}
          
          <button className="w-full p-4 border-2 border-dashed border-navy/10 rounded-2xl flex items-center justify-center gap-2 text-navy/40 hover:text-navy hover:border-navy/20 transition-all">
             <Plus className="w-5 h-5" />
             <span className="font-bold text-sm">{t('family.btn.add', lang)}</span>
          </button>
        </div>

        <div className="pt-4">
           <Button variant="outline" fullWidth onClick={onBack}>{t('nav.back', lang)}</Button>
        </div>
      </div>
    </Layout>
  );
};

export const NextSteps: React.FC<ScreenProps> = ({ onNext, onBack, user, updateUser }) => {
  const lang = user.language;
  return (
    <Layout onBack={onBack} title={t('nextsteps.title', lang)} user={user} updateUser={updateUser}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy">{t('nextsteps.subtitle', lang)}</h2>
          <p className="text-navy/60 text-sm">{t('nextsteps.desc', lang)}</p>
        </div>

        <div className="space-y-4">
           <Card className="bg-navy text-white space-y-3">
              <h4 className="font-bold">{t('nextsteps.card1.title', lang)}</h4>
              <p className="text-sm text-white/70 leading-relaxed">
                {t('nextsteps.card1.desc', lang)}
              </p>
           </Card>

           <Card className="space-y-3">
              <h4 className="font-bold text-navy">{t('nextsteps.card2.title', lang)}</h4>
              <p className="text-sm text-navy/60 leading-relaxed">
                {t('nextsteps.card2.desc', lang)}
              </p>
           </Card>

           <Card className="space-y-3 border-gold/20 bg-gold/5">
              <h4 className="font-bold text-navy">{t('nextsteps.card3.title', lang)}</h4>
              <p className="text-sm text-navy/60 leading-relaxed">
                {t('nextsteps.card3.desc', lang)}
              </p>
           </Card>
        </div>

        <Button fullWidth onClick={onBack}>{t('nav.back', lang)}</Button>
      </div>
    </Layout>
  );
};
