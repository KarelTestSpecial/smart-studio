import React from 'react';
import { ShieldAlert, AlertOctagon, Info } from 'lucide-react';
import { SMART_CHECKLIST_STEPS } from '../constants';

export const ComplianceGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full overflow-y-auto custom-scrollbar pb-10">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Smart Compliance Rules</h2>
        <p className="text-slate-400">Referentiegids voor het veilig en legaal werken via Smart.</p>
      </div>

      <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
         <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
         <div>
            <h4 className="font-bold text-blue-300 text-lg mb-1">Waarom deze regels?</h4>
            <p className="text-blue-200/70 text-sm leading-relaxed">
               Deze regels zijn niet optioneel. Ze zorgen ervoor dat je verzekerd bent tijdens je werkzaamheden en dat je 100% legaal betaald wordt. 
               Volg deze stappen voor elke klant om problemen met de sociale inspectie of verzekering te voorkomen.
            </p>
         </div>
      </div>

      <div className="space-y-4">
        {SMART_CHECKLIST_STEPS.map((rule) => (
          <div 
            key={rule.step}
            className={`p-6 rounded-2xl border transition-all hover:bg-slate-900 ${
              rule.critical 
                ? 'bg-slate-900/40 border-red-500/30 shadow-lg shadow-red-900/10' 
                : 'bg-slate-900/40 border-slate-800'
            }`}
          >
            <div className="flex items-start gap-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                rule.critical 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {rule.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-200">{rule.title}</h3>
                  {rule.critical && (
                    <span className="flex items-center gap-1.5 text-xs uppercase font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md border border-red-400/20">
                      <AlertOctagon className="w-3.5 h-3.5" /> Critical
                    </span>
                  )}
                </div>
                <p className="text-slate-400 leading-relaxed text-base md:text-lg">{rule.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center pt-8 text-slate-600 text-sm">
        <ShieldAlert className="w-4 h-4 mr-2" />
        <span>Phoenix CRM Safety Suite v1.0</span>
      </div>
    </div>
  );
};