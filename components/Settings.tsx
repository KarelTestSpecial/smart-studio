import React, { useRef } from 'react';
import { Download, Upload, User, Save, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClearData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile, onExport, onImport, onClearData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Instellingen</h2>
        <p className="text-slate-400">Beheer je gegevens en profiel.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Jouw Profiel
          </h3>
          <p className="text-sm text-slate-400 mt-1">Deze naam wordt gebruikt in de automatische e-mails.</p>
        </div>
        <div className="p-6 bg-slate-900/50">
          <label className="block text-sm font-medium text-slate-300 mb-2">Volledige Naam</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => onUpdateProfile({ ...userProfile, name: e.target.value })}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="bv. Jan Peeters"
            />
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Opslaan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-500" />
            Data Soevereiniteit
          </h3>
          <p className="text-sm text-slate-400 mt-1">Jij bent eigenaar van je data. Exporteer of importeer je volledige database.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all group"
          >
            <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Exporteer Data</div>
              <div className="text-xs text-slate-400">Download .json backup</div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all group"
          >
            <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-bold">Importeer Data</div>
              <div className="text-xs text-slate-400">Herstel vanuit .json</div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>
        <div className="px-6 pb-6 pt-2">
             <button
              onClick={() => {
                  if(window.confirm('Weet je zeker dat je alle data wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
                      onClearData();
                  }
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
             >
                 <Trash2 className="w-3 h-3"/>
                 Wis alle lokale data
             </button>
        </div>
      </div>
    </div>
  );
};
