import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Award, 
  KeyRound,
  ChevronRight
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    currentUser, 
    role, 
    currentView, 
    setMobileMenuOpen, 
    isOfflineMode, 
    setIsOfflineMode, 
    offlineQueue, 
    setShowSyncModal, 
    setShowAboutModal,
    setShowLoginModal,
    theme
  } = useApp();

  const getViewTitle = () => {
    switch (currentView) {
      case 'overview':
        if (role === 'admin') return 'Executive Dashboard & Live System Monitoring';
        return 'Participant Portal';
      case 'activities': return 'Evaluation Activity Management';
      case 'form_builder': return 'Evaluation Form Builder & Rubrics';
      case 'surveys': return 'Survey Management & Stakeholder Assessments';
      case 'reports': return 'Evaluation Results, AI Synthesis & Analytics';
      case 'submissions': return 'Participant Evaluation Submissions Feed';
      case 'users': return 'User Management & Role Permissions';
      case 'appearance': return 'Website Appearance & Typography Settings';
      case 'audit': return 'Activity Logs & RA 10173 Audit Trail';
      case 'settings': return 'System Settings & Accreditation Benchmarks';
      case 'account': return 'My Account & Profile Details';
      case 'portal': return 'Extension Services Participant Portal';
      case 'evaluate': return 'Submit Extension Evaluation';
      case 'surveys_participant': return 'Community Stakeholder Surveys';
      case 'history': return 'My Evaluation Receipts & Certificates';
      case 'calendar': return 'Upcoming Extension Calendar';
      default: return 'Extension Services Evaluation System';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      
      {/* Top University Micro-Bar */}
      <div 
        className="px-4 sm:px-6 py-1.5 text-xs flex items-center justify-between border-b"
        style={{ 
          backgroundColor: theme.headerBgColor || '#022c22', 
          color: theme.headerTextColor || '#ffffff',
          borderColor: 'rgba(255,255,255,0.1)'
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold tracking-wide shrink-0" style={{ color: theme.accentColor }}>
            {theme.siteName || 'SOUTHERN LEYTE STATE UNIVERSITY'}
          </span>
          <span className="opacity-40 hidden sm:inline" aria-hidden="true">/</span>
          <span className="opacity-90 hidden sm:inline truncate">
            {theme.siteTagline || 'Hinunangan Campus • FCSIT Extension Services'}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <button
            onClick={() => setShowAboutModal(true)}
            className="hover:opacity-100 opacity-90 transition-opacity cursor-pointer font-medium flex items-center gap-1"
            style={{ color: theme.accentColor }}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BSIT Capstone Defense</span>
            <span>May 2026</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 capitalize">
              <span>{role} Portal</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-600 font-medium">{currentView.replace('_', ' ')}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate tracking-tight">
              {getViewTitle()}
            </h1>
          </div>
        </div>

        {/* Right Action Controls: Network Mode, Offline Sync, Demo Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Offline/Online Network Indicator Button */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
            title={isOfflineMode ? 'Field mode active. Click to switch to online.' : 'Online connected. Click to simulate field offline mode.'}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Offline Field</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Online Sync</span>
              </>
            )}
          </button>

          {/* Sync Queue Trigger Button */}
          {offlineQueue.length > 0 && (
            <button
              onClick={() => setShowSyncModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer animate-pulse"
              title="Review pending offline evaluations"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sync ({offlineQueue.length})</span>
            </button>
          )}

          {/* Demo Account Switcher Shortcut */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            title="Switch user role or test accounts"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold capitalize">{role}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
