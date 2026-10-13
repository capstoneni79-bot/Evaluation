import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  BookOpen, 
  X, 
  Calendar,
  CheckCircle,
  Cpu
} from 'lucide-react';

export const CapstoneAboutModal: React.FC = () => {
  const { showAboutModal, setShowAboutModal } = useApp();

  if (!showAboutModal) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="capstone-dialog-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Academic Header */}
        <div className="bg-emerald-950 p-6 text-white text-center relative border-b-2 border-amber-500">
          <button
            onClick={() => setShowAboutModal(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xs font-bold tracking-widest uppercase text-amber-400">
            Southern Leyte State University · Hinunangan Campus
          </h2>
          <p className="text-[11px] text-slate-300 font-medium mt-0.5">
            Faculty of Computer Studies and Information Technology (FCSIT)
          </p>

          <div className="my-4 py-2 border-y border-emerald-900">
            <h1 id="capstone-dialog-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
              Extension Services Evaluation System with Data Analytics
            </h1>
            <p className="text-xs text-emerald-300 mt-1">
              A Capstone Project in Partial Fulfillment of the Degree of Bachelor of Science in Information Technology (BSIT)
            </p>
          </div>

          <div className="text-xs text-slate-300 flex items-center justify-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic Year 2025–2026 · May 2026 Defense</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Researchers */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-800" />
              <span>Project Proponents (FCSIT Researchers)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Barrot, Sheryl Ann C.', title: 'Lead Proponent' },
                { name: 'Capapas, Arnelyn T.', title: 'Proponent' },
                { name: 'Tabugon, Rencilyn P.', title: 'Proponent' },
                { name: 'Tibar, Dina Mae M.', title: 'Proponent' },
              ].map((author, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <p className="font-semibold text-slate-900 text-xs">{author.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{author.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Research Objectives */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-800" />
              <span>Core Project Objectives</span>
            </h3>
            <ul className="space-y-1.5 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
              <li>
                <strong>Adaptive Evaluation Forms:</strong> Dynamic combination of common core metrics with activity-specific question sets (trainings, livelihood programs, seminars, outreach, community services).
              </li>
              <li>
                <strong>Offline-Resilient Sync Architecture:</strong> Local device buffering for remote field activities in Hinunangan with batch synchronization once connectivity is restored.
              </li>
              <li>
                <strong>Data Validity Mechanisms:</strong> Single evaluation per participant per activity verification, duplicate prevention, required fields, and timestamping.
              </li>
              <li>
                <strong>Natural Language Analytics:</strong> Sentiment analysis and theme detection highlighting recurring strengths, bottlenecks, and suggestions.
              </li>
              <li>
                <strong>AI-Assisted Decision Support:</strong> Institutional executive reporting powered by Gemini API to assist university leadership and the extension council.
              </li>
              <li>
                <strong>Data Privacy (RA 10173):</strong> Role-based access control, consent verification, and audit-logged inspection of identifiable information.
              </li>
            </ul>
          </div>

          {/* Theoretical Foundations */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Theoretical Frameworks (Chapter II)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Technology Acceptance Model (TAM):</strong> Davis (1989) — Prioritizing perceived ease of use and usefulness for high user adoption.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">User-Centered Design (UCD):</strong> Norman (2013) — Intuitive mobile-first interface minimizing cognitive load for diverse rural participants.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Data Integrity Theory:</strong> Hernandez et al. (2021) — Multi-tier duplicate checks and validation maintaining pristine feedback quality.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Security by Design & RA 10173:</strong> Sullivan (2019) — Built-in consent notices, role-based PII masking, and access audit trails.
              </div>
            </div>
          </div>

          {/* Technologies Used */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-800" />
              <span>Implemented Technologies (Chapter III)</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                'React 19 SPA',
                'TypeScript',
                'Node.js Express Full-Stack Server',
                'Gemini API (gemini-3.8-flash)',
                'Local Storage & Offline Buffer',
                'Tailwind CSS',
                'Audit Logging Engine',
                'Data Privacy Act (RA 10173)'
              ].map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setShowAboutModal(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
