import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, ShieldAlert, FileSignature, Landmark, HardHat, ShieldCheck, AlertOctagon, Send } from 'lucide-react';
import { Lead } from '../types';
import { SMART_CHECKLIST_STEPS } from '../constants';

interface SmartChecklistModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SmartChecklistModal: React.FC<SmartChecklistModalProps> = ({ isOpen, lead, onClose, onConfirm }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Reset steps when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCompletedSteps([]);
    }
  }, [isOpen]);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId) 
        : [...prev, stepId]
    );
  };

  const allChecked = SMART_CHECKLIST_STEPS.every(step => completedSteps.includes(step.step));

  const getIcon = (index: number) => {
    const icons = [FileSignature, Landmark, HardHat, Send, ShieldCheck];
    return icons[index % icons.length];
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
        
        <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
          <div className="flex items-start justify-between mb-6 flex-shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <ShieldAlert className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Smart Safety Checklist</h2>
              </div>
              <p className="text-slate-400">
                Om <span className="text-white font-semibold">{lead.companyName}</span> als deal te sluiten, moet je voldoen aan de Smart-regels.
              </p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {SMART_CHECKLIST_STEPS.map((rule, index) => {
              const isChecked = completedSteps.includes(rule.step);
              const Icon = getIcon(index);

              return (
                <label 
                  key={rule.step}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    isChecked 
                      ? 'bg-blue-900/20 border-blue-500/50' 
                      : rule.critical 
                        ? 'bg-slate-950 border-slate-800 hover:border-red-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
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

          <div className="mt-6 flex-shrink-0">
            <button
              onClick={onConfirm}
              disabled={!allChecked}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                allChecked
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-900/50 scale-100'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              {allChecked ? 'Bevestig Deal & Vier Feest 🎉' : `Nog ${SMART_CHECKLIST_STEPS.length - completedSteps.length} stappen te gaan...`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
