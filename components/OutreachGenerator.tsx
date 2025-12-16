import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Send, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { Lead, UserProfile, PROBLEM_LABELS } from '../types';
import { EMAIL_TEMPLATES } from '../constants';

interface OutreachGeneratorProps {
  leads: Lead[];
  userProfile: UserProfile;
  onUpdateStatus: (id: string, status: 'CONTACTED') => void;
}

export const OutreachGenerator: React.FC<OutreachGeneratorProps> = ({ leads, userProfile, onUpdateStatus }) => {
  const newLeads = leads.filter((l) => l.status === 'NEW');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(EMAIL_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  // Auto select first lead if available
  useEffect(() => {
    if (newLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(newLeads[0].id);
    }
  }, [newLeads, selectedLeadId]);

  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const selectedTemplate = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];

  const generateEmail = (lead: Lead) => {
    const problemText = lead.problemDescription || PROBLEM_LABELS[lead.problemType].toLowerCase();
    const userName = userProfile.name || '[Uw Naam]';

    let body = selectedTemplate.body
      .replace(/{bedrijfsnaam}/g, lead.companyName)
      .replace(/{notitie}/g, problemText)
      .replace(/{gebruikersnaam}/g, userName);

    let subject = selectedTemplate.subject
      .replace(/{bedrijfsnaam}/g, lead.companyName);
    
    return { subject, body };
  };

  const handleCopy = () => {
    if (!selectedLead) return;
    const { subject, body } = generateEmail(selectedLead);
    const fullText = `Onderwerp: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkSent = () => {
    if (!selectedLead) return;
    onUpdateStatus(selectedLead.id, 'CONTACTED');
    setSelectedLeadId(null);
  };

  if (newLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
          <Check className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Alles is bijgewerkt!</h2>
        <p className="text-slate-400 max-w-md">Geen nieuwe leads meer om te contacteren. Voeg nieuwe leads toe via het dashboard om weer aan de slag te gaan.</p>
      </div>
    );
  }

  const generatedContent = selectedLead ? generateEmail(selectedLead) : { subject: '', body: '' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      {/* List of New Leads */}
      <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Nieuwe Leads ({newLeads.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {newLeads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedLeadId === lead.id
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-900/20'
                  : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-slate-200">{lead.companyName}</div>
              <div className="text-xs text-slate-500 mt-1">{new Date(lead.dateAdded).toLocaleDateString('nl-BE')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {selectedLead ? (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 shadow-2xl relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                <Send className="w-32 h-32 text-slate-800" />
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">Outreach Generator</h2>
                        <p className="text-sm text-slate-400">Prospect: <span className="text-blue-400">{selectedLead.companyName}</span></p>
                      </div>
                      <div className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono">
                        {selectedLead.email}
                      </div>
                   </div>

                   {/* Template Selector */}
                   <div className="relative mb-4">
                      <select 
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="w-full appearance-none bg-slate-950 border border-slate-700 hover:border-blue-500/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                      >
                        {EMAIL_TEMPLATES.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                   </div>
                </div>

                <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-inner">
                  <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/50 text-sm font-medium text-slate-400 flex gap-2">
                    <span className="text-slate-500">Onderwerp:</span>
                    <span className="text-slate-200 select-all">{generatedContent.subject}</span>
                  </div>
                  <div className="p-4 font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1 select-all">
                    {generatedContent.body}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 group"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400 group-hover:text-white" />}
                {copied ? 'Gekopieerd!' : 'Kopieer naar Klembord'}
              </button>
              
              <button
                onClick={handleMarkSent}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95"
              >
                <span>Markeer als Gemaild</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {!userProfile.name && (
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm">
                 <AlertCircle className="w-5 h-5" />
                 <span>Vergeet niet je naam in te stellen bij Instellingen voor de handtekening!</span>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            Selecteer een lead om te beginnen
          </div>
        )}
      </div>
    </div>
  );
};
