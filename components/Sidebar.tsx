import React from 'react';
import { LayoutDashboard, Send, Settings, ShieldCheck, ClipboardCheck, BookText, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'outreach', label: 'Outreach', icon: Send },
    { id: 'compliance', label: 'Compliance', icon: ClipboardCheck },
    { id: 'compliance-rules', label: 'Compliance Rules', icon: BookText },
    { id: 'settings', label: 'Instellingen', icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-20 md:w-56'
        }`}
    >
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-blue to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        {!isCollapsed && (
          <h1 className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 whitespace-nowrap overflow-hidden">
            Phoenix
          </h1>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                className={`w-6 h-6 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
              />
              {!isCollapsed && (
                <span className="hidden md:block font-medium text-sm text-left leading-tight whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 flex flex-col gap-2">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-full p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          {!isCollapsed && <span className="hidden md:block text-xs text-slate-400 whitespace-nowrap">System Secure</span>}
        </div>
      </div>
    </aside>
  );
};