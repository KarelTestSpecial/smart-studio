import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { Lead, ProblemType, PROBLEM_LABELS } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'dateAdded' | 'status'>) => void;
  initialData?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    problemType: 'no_website' as ProblemType,
    problemDescription: '',
    gdprConfirmed: false,
  });

  // Populate form when initialData changes (edit mode) or reset when opening fresh
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          companyName: initialData.companyName,
          email: initialData.email,
          problemType: initialData.problemType,
          problemDescription: initialData.problemDescription || '',
          gdprConfirmed: initialData.gdprConfirmed,
        });
      } else {
        setFormData({
          companyName: '',
          email: '',
          problemType: 'no_website',
          problemDescription: '',
          gdprConfirmed: false,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdprConfirmed) return;
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

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
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{isEditing ? 'Lead Bewerken' : 'Nieuwe Prospect Toevoegen'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bedrijfsnaam</label>
              <input
                required
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="bv. Bakkerij Jansen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">E-mailadres</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="info@bakkerijjansen.be"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Probleem Categorie</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {(Object.entries(PROBLEM_LABELS) as [ProblemType, string][]).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                      formData.problemType === key
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="problemType"
                      value={key}
                      checked={formData.problemType === key}
                      onChange={() => setFormData({ ...formData, problemType: key })}
                      className="hidden"
                    />
                    {label}
                  </label>
                ))}
              </div>
              
              <AnimatePresence>
                {(formData.problemType === 'other' || formData.problemDescription) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-slate-400 mb-1">Beschrijving Probleem</label>
                    <textarea
                      required={formData.problemType === 'other'}
                      value={formData.problemDescription}
                      onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all min-h-[80px]"
                      placeholder="Beschrijf wat er specifiek mis is..."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  required
                  checked={formData.gdprConfirmed}
                  onChange={(e) => setFormData({ ...formData, gdprConfirmed: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-amber-500/50 rounded flex items-center justify-center peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all">
                  <ShieldCheck className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-amber-200">GDPR Verificatie</span>
                <p className="text-xs text-amber-500/80 mt-1">
                  Ik bevestig dat dit een zakelijk e-mailadres is en ik deze prospect mag benaderen volgens de huidige wetgeving.
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={!formData.gdprConfirmed}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Wijzigingen Opslaan' : 'Lead Opslaan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};