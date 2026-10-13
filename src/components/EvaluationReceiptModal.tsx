import React, { useRef } from 'react';
import { EvaluationSubmission, Activity } from '../types';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  X, 
  QrCode, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Award,
  Building2,
  FileCheck2
} from 'lucide-react';
import { PARTICIPANT_CATEGORIES_DISPLAY } from '../data/seedData';

interface Props {
  evaluation: EvaluationSubmission;
  activity: Activity;
  onClose: () => void;
}

export const EvaluationReceiptModal: React.FC<Props> = ({ evaluation, activity, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="bg-emerald-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 rounded-lg text-amber-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Evaluation & Attendance Receipt</h3>
              <p className="text-xs text-emerald-200">Official SLSU-Hinunangan Verification Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate / Receipt Document */}
        <div ref={receiptRef} className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="bg-white border-2 border-emerald-900/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
            
            {/* Watermark badge */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
              <Building2 className="w-48 h-48 text-emerald-950" />
            </div>

            {/* University Letterhead */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900 text-amber-400 mb-1 font-bold text-lg shadow-xs">
                SLSU
              </div>
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-emerald-900">
                Southern Leyte State University
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">HINUNANGAN CAMPUS • Hinunangan, Southern Leyte</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                Office of Extension and Community Services • FCSIT
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-4">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide uppercase">
                Certificate of Completed Evaluation
              </span>
              <p className="text-xs text-slate-500 mt-1">This validates the formal attendance and feedback submission of:</p>
              <h2 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                {evaluation.participantName}
              </h2>
              <p className="text-xs text-emerald-700 font-medium">
                {PARTICIPANT_CATEGORIES_DISPLAY[evaluation.participantCategory] || evaluation.participantCategory}
              </p>
            </div>

            {/* Activity details table */}
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-200/80 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Activity Title:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[280px]">{activity.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Classification:</span>
                <span className="font-semibold text-emerald-700 uppercase text-[11px]">{activity.activityType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue:</span>
                <span className="font-medium text-slate-700 text-right">{activity.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Completed:</span>
                <span className="font-medium text-slate-700">{new Date(evaluation.submittedAt).toLocaleDateString('en-PH', { dateStyle: 'long' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lead Department:</span>
                <span className="font-medium text-slate-700">{activity.organizingDepartment}</span>
              </div>
            </div>

            {/* Security validation box */}
            <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Official Control Number</p>
                <p className="font-mono font-bold text-emerald-900 text-sm">{evaluation.controlNumber}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Submission Source: <span className="font-medium capitalize">{evaluation.submissionSource.replace('_', ' ')}</span>
                </p>
              </div>

              {/* QR validation simulation */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-900 rounded p-1 flex items-center justify-center text-white shadow-xs">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <span className="text-[9px] text-emerald-800 font-semibold mt-1">VERIFIED VALID</span>
              </div>
            </div>

            {/* Institutional Sign-off footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
              <div>
                <p className="font-medium text-slate-700">{activity.leadCoordinator}</p>
                <p>Extension Activity Coordinator</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-700">Engr. Sheryl Ann C. Barrot, MIT</p>
                <p>FCSIT Extension Head</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-white flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Recorded in SLSU Central Extension Database</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
