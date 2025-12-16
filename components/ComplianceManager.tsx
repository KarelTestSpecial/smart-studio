import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldAlert, FileSignature, Landmark, HardHat, ShieldCheck, AlertOctagon, Send, ArrowRight } from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { SMART_CHECKLIST_STEPS } from '../constants';

interface ComplianceManagerProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

export const ComplianceManager: React.FC<ComplianceManagerProps> = ({ leads, onUpdateStatus }) => {
  // Filter for leads that are currently in the process (CONTACTED)
  const complianceLeads = leads.filter((l) => l.status === 'CONTACTED');
  
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Auto select first lead if available
  useEffect(() => {
    if (complianceLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(complianceLeads[0].id);
    }
  }, [complianceLeads, selectedLeadId]);

  // Reset steps when changing lead
  useEffect(() => {
    setCompletedSteps([]);
  }, [selectedLeadId]);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId) 
        : [...prev, stepId]
    );
  };

  const handleConfirmDeal = () => {
    if (selectedLeadId) {
      onUpdateStatus(selectedLeadId, 'WON');
      setSelectedLeadId(null);
    }
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const allChecked = SMART_CHECKLIST_STEPS.every(step => completedSteps.includes(step.step));

  const getIcon = (index: number) => {
    const icons = [FileSignature, Landmark, HardHat, Send, ShieldCheck];
    return icons[index % icons.length];
  };

  if (complianceLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Alles is compliant!</h2>
        <p className="text-slate-400 max-w-md">Er zijn geen leads die wachten op compliance checks. Stuur eerst mails via Outreach om nieuwe trajecten te starten.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      {/* List of Leads in Compliance Phase */}
      <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Compliance Checks ({complianceLeads.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {complianceLeads.map((lead) => (
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

      {/* Checklist Area */}
      <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
        {selectedLead ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 shadow-2xl overflow-hidden flex flex-col relative">
             {/* Header */}
             <div className="p-6 border-b border-slate-800 bg-slate-900/90 z-10 flex justify-between items-start">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-1">Smart Safety Checklist</h2>
                   <p className="text-slate-400 text-sm">
                     Verifieer dossier voor <span className="text-white font-semibold">{selectedLead.companyName}</span>
                   </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  BE{new Date().getFullYear()}-SMART-ID
                </div>
             </div>

             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

             {/* Scrollable Checklist */}
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-3">
                {SMART_CHECKLIST_STEPS.map((rule, index) => {
                  const isChecked = completedSteps.includes(rule.step);
                  const Icon = getIcon(index);

                  return (
                    <label 
                      key={rule.step}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group select-none ${
                        isChecked 
                          ? 'bg-blue-900/20 border-blue-500/50' 
                          : rule.critical 
                            ? 'bg-slate-950/50 border-slate-800 hover:border-red-500/30'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-4 h-4 text-white" />}
                      </div>
                      
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isChecked} 
                        onChange={() => toggleStep(rule.step)} 
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`font-semibold ${isChecked ? 'text-white' : 'text-slate-200'}`}>
                            {rule.step}. {rule.title}
                          </div>
                          {rule.critical && !isChecked && (
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
                               <AlertOctagon className="w-3 h-3" /> Critical
                            </div>
                          )}
                        </div>
                        <div className={`text-sm leading-relaxed ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                          {rule.description}
                        </div>
                      </div>
                      
                      <Icon className={`w-6 h-6 flex-shrink-0 ${isChecked ? 'text-blue-400' : 'text-slate-700 group-hover:text-slate-500'}`} />
                    </label>
                  );
                })}
             </div>

             {/* Footer Action */}
             <div className="p-6 border-t border-slate-800 bg-slate-900/50 z-10">
                <button
                  onClick={handleConfirmDeal}
                  disabled={!allChecked}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                    allChecked
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-900/30 scale-100'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {allChecked ? (
                    <>
                      <span>Bevestig Deal & Vier Feest</span>
                      <span className="text-xl">🎉</span>
                    </>
                  ) : (
                    <span className="text-sm font-normal">Voltooi nog {SMART_CHECKLIST_STEPS.length - completedSteps.length} stappen...</span>
                  )}
                </button>
             </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            Selecteer een lead om te beginnen
          </div>
        )}
      </div>
    </div>
  );
};