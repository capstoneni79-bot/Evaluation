import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  FileText, 
  BarChart3, 
  HelpCircle,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    isOfflineMode, 
    setIsOfflineMode, 
    offlineQueue, 
    setShowSyncModal, 
    setShowAboutModal 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b-2 border-amber-500">
      {/* Top micro-bar for institutional identity & capstone recognition */}
      <div className="bg-emerald-950/80 px-4 py-1 text-xs text-emerald-200 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide text-amber-300">SOUTHERN LEYTE STATE UNIVERSITY</span>
          <span className="text-emerald-400">•</span>
          <span>Hinunangan Campus</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-300 hidden sm:inline">Faculty of Computer Studies and Information Technology (FCSIT)</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAboutModal(true)}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            title="View Capstone Project Details"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>BSIT Capstone 2026</span>
          </button>
          <span className="text-emerald-500">|</span>
          <span className="text-emerald-300">May 2026</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow text-emerald-950 font-black text-xl border border-amber-300/60 shrink-0">
              <Building2 className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
                  Extension Services Evaluation System
                </h1>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide shadow-xs">
                  Analytics & AI
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                SLSU-Hinunangan Adaptive Feedback & Decision Support Platform
              </p>
            </div>
          </div>

          {/* Right Action Controls: Role Switcher + Offline Simulator + Sync Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Offline/Online Field Mode Toggle */}
            <div className="flex items-center bg-emerald-950/70 p-1 rounded-lg border border-emerald-700/60 text-xs">
              <button
                type="button"
                onClick={() => setIsOfflineMode(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-medium ${
                  !isOfflineMode 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Online Mode: Direct cloud sync"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Online</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOfflineMode(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-medium ${
                  isOfflineMode 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Offline Field Mode: Queues feedback on local device"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                <span>Offline Field</span>
              </button>
            </div>

            {/* Offline Queue Sync Indicator */}
            {offlineQueue.length > 0 && (
              <button
                onClick={() => setShowSyncModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all animate-pulse"
                title="Pending evaluations waiting to sync"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{offlineQueue.length} Pending Sync</span>
              </button>
            )}

            {/* Role Navigation Switcher */}
            <div className="flex items-center bg-emerald-800/80 p-1 rounded-lg border border-emerald-700 text-xs font-medium">
              <button
                onClick={() => setRole('participant')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                  role === 'participant'
                    ? 'bg-white text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Participant</span>
              </button>

              <button
                onClick={() => setRole('coordinator')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                  role === 'coordinator'
                    ? 'bg-white text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Coordinator</span>
              </button>

              <button
                onClick={() => setRole('super_admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                  role === 'super_admin'
                    ? 'bg-white text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin & Audit</span>
              </button>
            </div>

            {/* Capstone Info Dialog button */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-700/60"
              title="Capstone Research Details"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
