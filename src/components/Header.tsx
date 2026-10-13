import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  BarChart3, 
  Award,
  Menu,
  X,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    switchDemoAccount, 
    isOfflineMode, 
    setIsOfflineMode, 
    offlineQueue, 
    setShowSyncModal, 
    setShowAboutModal,
    theme
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Institutional Top Accent Strip */}
      <div className="bg-emerald-950 px-4 sm:px-8 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold tracking-wide text-amber-400 shrink-0">SOUTHERN LEYTE STATE UNIVERSITY</span>
          <span className="text-emerald-700 hidden sm:inline" aria-hidden="true">/</span>
          <span className="text-slate-300 hidden sm:inline truncate">Hinunangan Campus • Faculty of Computer Studies & IT</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <button
            onClick={() => setShowAboutModal(true)}
            className="text-amber-300 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">BSIT Capstone Defense</span>
            <span>2026</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar (Strict 3-Zone Contract: Brand — Nav Links — Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single Text Element Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-xs shrink-0 overflow-hidden"
              style={{
                backgroundColor: theme.sidebarLogoBg || '#022c22',
                color: theme.sidebarLogoColor || '#d97706'
              }}
            >
              {theme.sidebarLogoType === 'image' && theme.sidebarLogoUrl ? (
                <img 
                  src={theme.sidebarLogoUrl} 
                  alt={theme.logoText || "Logo"} 
                  className="w-6 h-6 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); switchDemoAccount('participant'); }}
                className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-emerald-900 transition-colors"
              >
                SLSU Extension Evaluation
              </a>
              <span className="text-[11px] text-slate-500 font-medium -mt-0.5 whitespace-nowrap">
                Data Analytics & Decision Support
              </span>
            </div>
          </div>

          {/* Zone 2: Primary Nav Links (Single-Line, Text with Active States) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => switchDemoAccount('participant')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                role === 'participant'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Participant Portal</span>
            </button>


            <button
              onClick={() => switchDemoAccount('admin')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin & Audit</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Network Telemetry */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Offline/Online Network Indicator Button */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="Review pending offline evaluations"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sync ({offlineQueue.length})</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-xs">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-2 pt-1">
            Navigation Roles
          </p>
          <button
            onClick={() => { switchDemoAccount('participant'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between ${
              role === 'participant' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Participant Portal</span>
            </span>
          </button>


          <button
            onClick={() => { switchDemoAccount('admin'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg font-medium flex items-center justify-between ${
              role === 'admin' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Admin & Audit</span>
            </span>
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => { setShowAboutModal(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Capstone Project Information</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
