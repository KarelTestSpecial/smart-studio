import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Mail, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Pencil } from 'lucide-react';
import { Lead, PROBLEM_LABELS } from '../types';

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, isOpen, onClose, onAction, onEdit }) => {
  if (!isOpen || !lead) return null;

  const isWon = lead.status === 'WON';
  
  const getActionLabel = () => {
    switch (lead.status) {
      case 'NEW': return 'Start Outreach';
      case 'CONTACTED': return 'Check Compliance Rules';
      case 'WON': return 'Bekijk Deal';
      default: return 'Actie';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 border-b border-slate-800 ${isWon ? 'bg-emerald-900/10' : 'bg-slate-900'}`}>
          <div className="flex justify-between items-start mb-2">
            <h2 className={`text-2xl font-bold ${isWon ? 'text-emerald-400' : 'text-white'}`}>
              {lead.companyName}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(lead)} 
                className="text-slate-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-slate-800"
                title="Bewerk gegevens"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
               lead.status === 'NEW' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
               lead.status === 'CONTACTED' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
               'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {lead.status === 'NEW' ? 'NIEUW' : lead.status === 'CONTACTED' ? 'GEMAILD' : 'KLANT'}
            </span>
            {lead.gdprConfirmed && (
               <span className="flex items-center gap-1 text-xs text-slate-500" title="GDPR Verified">
                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                 GDPR Ok
               </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">E-mailadres</div>
                <div className="text-slate-200 font-mono text-sm">{lead.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Probleem</div>
                <div className="text-slate-200 font-medium">{PROBLEM_LABELS[lead.problemType]}</div>
                {lead.problemDescription && (
                  <p className="text-sm text-slate-400 mt-1 italic">"{lead.problemDescription}"</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Datum Toegevoegd</div>
                <div className="text-slate-200 text-sm">{new Date(lead.dateAdded).toLocaleDateString('nl-BE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAction(lead)}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                isWon 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            }`}
          >
            {isWon && <CheckCircle2 className="w-5 h-5" />}
            <span>{getActionLabel()}</span>
            {!isWon && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};