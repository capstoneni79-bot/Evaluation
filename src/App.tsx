import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AdminDashboardView } from './components/dashboards/AdminDashboardView';
import { ParticipantDashboardView } from './components/dashboards/ParticipantDashboardView';
import { EvaluationReceiptModal } from './components/EvaluationReceiptModal';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { CapstoneAboutModal } from './components/CapstoneAboutModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/ui/Toast';
import { Building2, ShieldCheck, Award } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    role, 
    sidebarCollapsed,
    lastSubmittedEvaluation, 
    setLastSubmittedEvaluation, 
    activities,
    toasts,
    dismissToast
  } = useApp();

  const currentActivityForReceipt = lastSubmittedEvaluation
    ? activities.find(a => a.id === lastSubmittedEvaluation.activityId) || activities[0]
    : null;

  const renderDashboardByRole = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboardView />;
      case 'participant':
      default:
        return <ParticipantDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Fixed Desktop Sidebar & Mobile Drawer */}
      <Sidebar />

      {/* Main Content Area Offset by Desktop Sidebar */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Sticky Top Bar */}
        <TopBar />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {renderDashboardByRole()}
        </main>

        {/* Institutional Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-6 text-xs mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-amber-400 font-bold shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white text-xs">
                  Southern Leyte State University · Hinunangan Campus
                </p>
                <p className="text-slate-400 text-[11px]">
                  Faculty of Computer Studies and Information Technology (FCSIT)
                </p>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="font-medium text-slate-200">
                Extension Services Evaluation System with Data Analytics
              </p>
              <p className="text-slate-400 text-[11px]">
                Researchers: Barrot, S.A.C. · Capapas, A.T. · Tabugon, R.P. · Tibar, D.M.M. · May 2026
              </p>
              <p className="text-slate-500 text-[10px]">
                Governed under Republic Act No. 10173 (Data Privacy Act of 2012)
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Official Attendance & Evaluation Receipt Modal */}
      {lastSubmittedEvaluation && currentActivityForReceipt && (
        <EvaluationReceiptModal
          evaluation={lastSubmittedEvaluation}
          activity={currentActivityForReceipt}
          onClose={() => setLastSubmittedEvaluation(null)}
        />
      )}

      {/* Authentication & Role Switcher Modal */}
      <LoginModal />

      {/* Offline Synchronization Modal */}
      <OfflineSyncModal />

      {/* Capstone Project Information Modal */}
      <CapstoneAboutModal />

      {/* Real-time Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
