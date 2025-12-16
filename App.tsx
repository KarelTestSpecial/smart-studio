import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { OutreachGenerator } from './components/OutreachGenerator';
import { Settings } from './components/Settings';
import { ComplianceGuide } from './components/ComplianceGuide';
import { ComplianceManager } from './components/ComplianceManager';
import { LeadModal } from './components/LeadModal';
import { SmartChecklistModal } from './components/SmartChecklistModal';
import { LeadDetailsModal } from './components/LeadDetailsModal';
import { Confetti } from './components/Confetti';
import { AppState, Lead, LeadStatus, UserProfile } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'phoenix_crm_data';

const initialData: AppState = {
  leads: [],
  userProfile: { name: '' },
};

export default function App() {
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [selectedLeadForChecklist, setSelectedLeadForChecklist] = useState<Lead | null>(null);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleSaveLead = (leadData: Omit<Lead, 'id' | 'dateAdded' | 'status'>) => {
    if (editingLead) {
      // Update existing
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((l) => 
          l.id === editingLead.id 
            ? { ...l, ...leadData } 
            : l
        ),
      }));
      setEditingLead(null);
    } else {
      // Create new
      const newLead: Lead = {
        ...leadData,
        id: crypto.randomUUID(),
        dateAdded: new Date().toISOString(),
        status: 'NEW',
      };
      setData((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
    }
    setIsLeadModalOpen(false);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLeadForDetails(null);
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleAddLeadClick = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    }));
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLeadForDetails(lead);
  };

  const handleLeadAction = (lead: Lead) => {
    setSelectedLeadForDetails(null);
    
    if (lead.status === 'NEW') {
       setCurrentView('outreach');
    } else if (lead.status === 'CONTACTED') {
       // Now redirects to the new Compliance workspace instead of opening the modal directly
       setCurrentView('compliance');
    }
    // Won leads just stay on dashboard/details for now
  };

  const handleWinDeal = () => {
    if (selectedLeadForChecklist) {
      updateLeadStatus(selectedLeadForChecklist.id, 'WON');
      setSelectedLeadForChecklist(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };
  
  // This is used by the ComplianceManager component
  const handleWinDealFromManager = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status);
    if (status === 'WON') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.leads) {
          setData(json);
          alert('Data succesvol geïmporteerd!');
        }
      } catch (err) {
        alert('Fout bij importeren bestand.');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenix_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {showConfetti && <Confetti />}
      
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 ml-20 md:ml-56 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Dashboard
                  leads={data.leads}
                  onAddLead={handleAddLeadClick}
                  onSelectLead={handleLeadClick}
                />
              </motion.div>
            )}

            {currentView === 'outreach' && (
              <motion.div
                key="outreach"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <OutreachGenerator
                  leads={data.leads}
                  userProfile={data.userProfile}
                  onUpdateStatus={updateLeadStatus}
                />
              </motion.div>
            )}

            {currentView === 'compliance' && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ComplianceManager 
                    leads={data.leads}
                    onUpdateStatus={handleWinDealFromManager}
                />
              </motion.div>
            )}

            {currentView === 'compliance-rules' && (
              <motion.div
                key="compliance-rules"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ComplianceGuide />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Settings
                  userProfile={data.userProfile}
                  onUpdateProfile={(p) => setData((prev) => ({ ...prev, userProfile: p }))}
                  onExport={handleExport}
                  onImport={handleImport}
                  onClearData={() => setData(initialData)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      <LeadDetailsModal
        isOpen={!!selectedLeadForDetails}
        lead={selectedLeadForDetails}
        onClose={() => setSelectedLeadForDetails(null)}
        onAction={handleLeadAction}
        onEdit={handleEditLead}
      />

      <SmartChecklistModal
        isOpen={!!selectedLeadForChecklist}
        lead={selectedLeadForChecklist}
        onClose={() => setSelectedLeadForChecklist(null)}
        onConfirm={handleWinDeal}
      />
    </div>
  );
}