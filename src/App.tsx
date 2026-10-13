import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ParticipantEvaluationView } from './components/ParticipantEvaluationView';
import { AdminDashboard } from './components/AdminDashboard';
import { EvaluationReceiptModal } from './components/EvaluationReceiptModal';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { CapstoneAboutModal } from './components/CapstoneAboutModal';
import { Building2, ShieldCheck, Award } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    role, 
    lastSubmittedEvaluation, 
    setLastSubmittedEvaluation, 
    activities,
    setShowAboutModal 
  } = useApp();

  const currentActivityForReceipt = lastSubmittedEvaluation
    ? activities.find(a => a.id === lastSubmittedEvaluation.activityId) || activities[0]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 pb-16">
        {role === 'participant' ? (
          <ParticipantEvaluationView />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Official Attendance & Evaluation Receipt Modal */}
      {lastSubmittedEvaluation && currentActivityForReceipt && (
        <EvaluationReceiptModal
          evaluation={lastSubmittedEvaluation}
          activity={currentActivityForReceipt}
          onClose={() => setLastSubmittedEvaluation(null)}
        />
      )}

      {/* Offline Synchronization Modal */}
      <OfflineSyncModal />

      {/* Capstone Project Information Modal */}
      <CapstoneAboutModal />

      {/* Institutional Footer */}
      <footer className="bg-emerald-950 text-emerald-200 border-t-2 border-amber-500 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-emerald-950 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Southern Leyte State University - Hinunangan Campus
              </p>
              <p className="text-emerald-300">
                Faculty of Computer Studies and Information Technology (FCSIT)
              </p>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-medium text-white">
              Extension Services Evaluation System with Data Analytics
            </p>
            <p className="text-emerald-400 text-[11px]">
              Researchers: Barrot, S.A.C., Capapas, A.T., Tabugon, R.P., Tibar, D.M.M. • May 2026
            </p>
            <p className="text-emerald-400/80 text-[10px]">
              Compliant with Republic Act No. 10173 (Data Privacy Act of 2012)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
