import React, { useState } from 'react';
import { useApp, DEMO_ACCOUNTS } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  X, 
  ShieldCheck, 
  Calendar, 
  Award, 
  User, 
  CheckCircle2, 
  KeyRound,
  ArrowRight,
  Lock
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    switchDemoAccount, 
    loginWithEmail, 
    currentUser 
  } = useApp();

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('demo1234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showLoginModal) return null;

  const handleSelectRole = (targetRole: UserRole) => {
    switchDemoAccount(targetRole);
    setShowLoginModal(false);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    setIsSubmitting(true);
    const success = await loginWithEmail(inputEmail.trim());
    setIsSubmitting(false);
    if (success) {
      setShowLoginModal(false);
    }
  };

  const roleConfigs: {
    role: UserRole;
    name: string;
    email: string;
    title: string;
    department: string;
    badgeColor: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      role: 'admin',
      name: DEMO_ACCOUNTS.admin.name,
      email: DEMO_ACCOUNTS.admin.email,
      title: DEMO_ACCOUNTS.admin.title || 'Director',
      department: DEMO_ACCOUNTS.admin.department || 'SLSU Administration',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: <ShieldCheck className="w-5 h-5 text-purple-700" />,
      features: [
        'Executive KPIs & Performance',
        'Extension Program & Activity Roster',
        'Sentiment & Topic NLP Analytics (Gemini)',
        'AI Executive Report Generator',
        'User Role & Account Management',
        'RA 10173 Compliance Audit Trail'
      ]
    },
    {
      role: 'participant',
      name: DEMO_ACCOUNTS.participant.name,
      email: DEMO_ACCOUNTS.participant.email,
      title: DEMO_ACCOUNTS.participant.title || 'Beneficiary',
      department: DEMO_ACCOUNTS.participant.department || 'Rural Agri-Cooperative',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <User className="w-5 h-5 text-amber-700" />,
      features: [
        'Adaptive Evaluation Form',
        'Personal Attendance Receipts',
        'Printable Certificate with QR Verification',
        'Extension Activity Calendar'
      ]
    }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="bg-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-lg text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 id="login-dialog-title" className="font-bold text-sm text-white">
                Role-Based Authentication & Demo Selector
              </h3>
              <p className="text-xs text-emerald-300">
                Southern Leyte State University Extension Services Evaluation System
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-900 text-sm mb-1">
              Select a Demonstration Role Account:
            </p>
            <p>
              Each role unlocks a tailored dashboard, customized metrics, and specific operational permissions. Click any card below to instantly sign in with that role's context.
            </p>
          </div>

          {/* 4 Demo Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {roleConfigs.map((cfg) => {
              const isCurrent = currentUser.role === cfg.role;
              return (
                <div
                  key={cfg.role}
                  onClick={() => handleSelectRole(cfg.role)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {cfg.icon}
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${cfg.badgeColor}`}>
                          {cfg.role}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {cfg.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {cfg.email}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 font-medium">
                      {cfg.title} · <span className="text-slate-400">{cfg.department}</span>
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Authorized Permissions:
                      </p>
                      <ul className="text-[11px] text-slate-600 space-y-0.5">
                        {cfg.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-700" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold text-emerald-900">
                    <span>{isCurrent ? 'Continue with Role' : 'Switch to this Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alternative Email Login Form */}
          <div className="pt-4 border-t border-slate-200">
            <details className="text-xs text-slate-600 group">
              <summary className="font-semibold text-slate-800 cursor-pointer hover:text-emerald-900 transition-colors flex items-center gap-1.5 select-none">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Or sign in using university email and password</span>
              </summary>
              <form onSubmit={handleManualLogin} className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Institutional Email:
                    </label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="e.g. coordinator.barrot@slsu.edu.ph"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Password (Demo):
                    </label>
                    <input
                      type="password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Sign In With Credentials'}
                  </button>
                </div>
              </form>
            </details>
          </div>

        </div>

      </div>
    </div>
  );
};
