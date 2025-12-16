import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Mail, User, AlertTriangle } from 'lucide-react';
import { Lead, LeadStatus, PROBLEM_LABELS } from '../types';

interface DashboardProps {
  leads: Lead[];
  onAddLead: () => void;
  onSelectLead: (lead: Lead) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, onAddLead, onSelectLead }) => {
  const columns: { id: LeadStatus; title: string; color: string; icon: any }[] = [
    { id: 'NEW', title: 'Nieuwe Leads', color: 'bg-cyber-blue', icon: User },
    { id: 'CONTACTED', title: 'Gemaild', color: 'bg-cyber-orange', icon: Mail },
    { id: 'WON', title: 'Deal / Contract', color: 'bg-cyber-green', icon: CheckCircle2 },
  ];

  const getLeadsByStatus = (status: LeadStatus) => leads.filter((l) => l.status === status);

  const stats = {
    total: leads.length,
    converted: leads.filter((l) => l.status === 'WON').length,
    rate: leads.length > 0 ? Math.round((leads.filter((l) => l.status === 'WON').length / leads.length) * 100) : 0,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Overzicht</h2>
          <p className="text-slate-400">Beheer je pijplijn en blijf compliant.</p>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-slate-500 block">Totaal Leads</span>
            <span className="text-xl font-bold text-white">{stats.total}</span>
          </div>
          <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-sm">
            <span className="text-sm text-slate-500 block">Conversie</span>
            <span className="text-xl font-bold text-cyber-green">{stats.rate}%</span>
          </div>
          <button
            onClick={onAddLead}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nieuwe Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnLeads = getLeadsByStatus(col.id);
          const isWon = col.id === 'WON';

          return (
            <div key={col.id} className="flex flex-col h-full min-w-[300px]">
              {/* Column Header */}
              <div className="flex items-center mb-4 px-1 gap-3">
                {/* Title Group */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`p-1.5 rounded-lg bg-slate-800 ${col.id === 'NEW' ? 'text-cyber-blue' : col.id === 'CONTACTED' ? 'text-cyber-orange' : 'text-cyber-green'}`}>
                    <col.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-200">{col.title}</h3>
                </div>

                {/* Middle Action Area (Stretches) */}
                <div className="flex-1 flex justify-center">
                  {col.id === 'NEW' && (
                    <button
                      onClick={onAddLead}
                      className="w-full mx-2 py-1.5 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 border border-blue-400/20 group"
                      title="Nieuwe lead toevoegen"
                    >
                      <Plus className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={3} />
                    </button>
                  )}
                </div>

                {/* Counter Group */}
                <div className="shrink-0">
                  <span className="text-xs font-mono px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 block text-center min-w-[30px]">
                    {columnLeads.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-2 space-y-2 backdrop-blur-sm">
                <AnimatePresence mode="popLayout">
                  {columnLeads.map((lead) => (
                    <motion.div
                      layout
                      key={lead.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onSelectLead(lead)}
                      className={`group cursor-pointer px-4 py-3 rounded-lg border transition-all duration-200 shadow-md relative overflow-hidden flex items-center justify-between gap-3 ${
                         isWon 
                         ? 'bg-slate-900/60 border-emerald-900/30 hover:border-emerald-500/50' 
                         : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-blue-500/30'
                      }`}
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      
                      <div className="min-w-0">
                        <h4 className={`font-bold text-sm truncate ${isWon ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {lead.companyName}
                        </h4>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                         {lead.problemType !== 'other' && !isWon && (
                           <div className="text-amber-500/80 bg-amber-500/10 p-1 rounded" title={PROBLEM_LABELS[lead.problemType]}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                           </div>
                         )}
                         {isWon && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {columnLeads.length === 0 && (
                  <div className="h-24 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl opacity-50">
                    <span className="text-xs">Geen leads</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};