import React, { useRef, useState } from 'react';
import { EvaluationSubmission, Activity } from '../types';
import { 
  Printer, 
  X, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { PARTICIPANT_CATEGORIES_DISPLAY } from '../data/seedData';
import { useApp } from '../context/AppContext';

interface Props {
  evaluation: EvaluationSubmission;
  activity: Activity;
  onClose: () => void;
}

export const EvaluationReceiptModal: React.FC<Props> = ({ evaluation, activity, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyControlNumber = () => {
    navigator.clipboard.writeText(evaluation.controlNumber);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Control Number Copied',
      description: evaluation.controlNumber
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header bar */}
        <div className="bg-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-900 rounded-lg text-amber-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="receipt-modal-title" className="font-bold text-sm text-white">Evaluation & Attendance Receipt</h3>
              <p className="text-xs text-emerald-300">Official SLSU Verification Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate / Receipt Document */}
        <div ref={receiptRef} className="p-6 bg-slate-50 border-b border-slate-200 print-container">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs relative overflow-hidden">
            
            {/* Watermark badge */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none" aria-hidden="true">
              <Building2 className="w-48 h-48 text-emerald-950" />
            </div>

            {/* University Letterhead */}
            <div className="text-center pb-4 border-b border-slate-200">
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-emerald-950">
                Southern Leyte State University
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">HINUNANGAN CAMPUS • Hinunangan, Southern Leyte</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Faculty of Computer Studies and Information Technology • Office of Extension Services
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-4">
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-900 mb-1">
                Certificate of Completed Evaluation
              </p>
              <p className="text-xs text-slate-500">This certifies the validated attendance and feedback submission of:</p>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {evaluation.participantName}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {PARTICIPANT_CATEGORIES_DISPLAY[evaluation.participantCategory] || evaluation.participantCategory}
              </p>
            </div>

            {/* Activity details table */}
            <div className="bg-slate-50 rounded-lg p-3.5 text-xs space-y-1.5 border border-slate-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Activity Title:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[280px]">{activity.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Classification:</span>
                <span className="font-medium text-slate-800 capitalize">{activity.activityType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue:</span>
                <span className="font-medium text-slate-800 text-right">{activity.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Recorded:</span>
                <span className="font-medium text-slate-800">{new Date(evaluation.submittedAt).toLocaleDateString('en-PH', { dateStyle: 'long' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lead Unit:</span>
                <span className="font-medium text-slate-800">{activity.organizingDepartment}</span>
              </div>
            </div>

            {/* Security validation box */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3.5 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Official Control Number</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="font-mono font-bold text-slate-900 text-sm tabular-nums">{evaluation.controlNumber}</p>
                  <button
                    onClick={handleCopyControlNumber}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Copy Control Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mode: <span className="capitalize">{evaluation.submissionSource.replace('_', ' ')}</span>
                </p>
              </div>

              {/* QR validation representation */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-900 rounded p-1 flex items-center justify-center text-white shadow-xs">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <span className="text-[9px] text-emerald-900 font-bold mt-1">VERIFIED VALID</span>
              </div>
            </div>

            {/* Sign-off footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
              <div>
                <p className="font-semibold text-slate-800">{activity.leadCoordinator}</p>
                <p>Extension Activity Coordinator</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">Engr. Sheryl Ann C. Barrot, MIT</p>
                <p>FCSIT Extension Head</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-6 py-4 bg-white flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>SLSU Central Extension Services Registry</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
