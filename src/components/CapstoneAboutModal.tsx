import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Building2, 
  Users, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  X, 
  Calendar,
  CheckCircle,
  Cpu
} from 'lucide-react';

export const CapstoneAboutModal: React.FC = () => {
  const { showAboutModal, setShowAboutModal } = useApp();

  if (!showAboutModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Academic Header */}
        <div className="bg-emerald-950 p-6 text-white text-center relative border-b-4 border-amber-500">
          <button
            onClick={() => setShowAboutModal(false)}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 font-black text-xl mb-2 shadow-md">
            SLSU
          </div>
          <h2 className="text-sm font-extrabold tracking-widest uppercase text-amber-300">
            Southern Leyte State University
          </h2>
          <p className="text-xs text-emerald-200 font-medium">
            HINUNANGAN CAMPUS • Hinunangan, Southern Leyte
          </p>
          <p className="text-xs text-emerald-300 mt-1 font-semibold">
            Faculty of Computer Studies and Information Technology (FCSIT)
          </p>

          <div className="my-4 py-2 border-y border-emerald-800/80">
            <h1 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
              Extension Services Evaluation System with Data Analytics
            </h1>
            <p className="text-xs text-emerald-300 italic mt-0.5">
              A Capstone Project in Partial Fulfillment of the Requirements for the Degree of Bachelor of Science in Information Technology (BSIT)
            </p>
          </div>

          <div className="text-xs text-emerald-200 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>May 2026</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Researchers / Authors Panel */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Project Proponents / Capstone Researchers</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Barrot, Sheryl Ann C.', role: 'Proponent' },
                { name: 'Capapas, Arnelyn T.', role: 'Proponent' },
                { name: 'Tabugon, Rencilyn P.', role: 'Proponent' },
                { name: 'Tibar, Dina Mae M.', role: 'Proponent' },
              ].map((author, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <p className="font-bold text-emerald-950 text-xs">{author.name}</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">{author.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Research Objectives */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Specific Project Objectives</span>
            </h3>
            <ul className="space-y-1.5 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700">
              <li>
                <strong>Adaptive Forms:</strong> Combine common core questions with activity-specific question sets for trainings, livelihood programs, seminars, outreach, and community services.
              </li>
              <li>
                <strong>Offline-Resilient Architecture:</strong> Support online submissions and field offline storage on local device/server with automatic synchronization once internet is restored.
              </li>
              <li>
                <strong>Data Validity Mechanisms:</strong> Enforce one-evaluation per participant per activity, duplicate prevention, verification credentials, and timestamping.
              </li>
              <li>
                <strong>Data Analytics & NLP:</strong> Extract recurring themes (facilities, trainer mastery, logistics, community needs) and polarity via sentiment and topic analysis.
              </li>
              <li>
                <strong>AI-Assisted Decision Support:</strong> Generate evidence-based executive reports via Gemini API to aid university administrators in future program planning.
              </li>
              <li>
                <strong>Data Privacy (RA 10173):</strong> Protect participant confidentiality with role-based access control, consent agreements, and immutable audit logs.
              </li>
            </ul>
          </div>

          {/* Theoretical Foundations */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Theoretical Frameworks (Chapter II)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Technology Acceptance Model (TAM):</strong> Davis (1989) — Prioritizing ease of use and perceived usefulness for high participant and administrator adoption.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong>User-Centered Design (UCD):</strong> Norman (2013) — Intuitive mobile-first interface minimizing cognitive load for diverse rural participants.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Data Integrity Theory:</strong> Hernandez et al. (2021) — Multi-tier duplicate checks and validation maintaining pristine feedback quality.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong>Security by Design & RA 10173:</strong> Sullivan (2019) — Built-in consent notices, role-based PII masking, and access audit trails.
              </div>
            </div>
          </div>

          {/* Technological Stack */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Technology Stack (Chapter III)</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React 19 SPA',
                'TypeScript',
                'Node.js Express Backend',
                'Gemini API (gemini-3.8-flash)',
                'Local Storage & Offline Queue',
                'Tailwind CSS',
                'Audit Logging Engine',
                'Data Privacy Act (RA 10173)'
              ].map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-medium text-[11px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowAboutModal(false)}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs cursor-pointer"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
