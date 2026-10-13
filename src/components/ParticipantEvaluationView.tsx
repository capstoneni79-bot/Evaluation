import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ActivityType, EvaluationSubmission } from '../types';
import { 
  CORE_QUESTIONS, 
  ACTIVITY_SPECIFIC_QUESTIONS, 
  PARTICIPANT_CATEGORIES_DISPLAY 
} from '../data/seedData';
import { 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  UserCheck, 
  FileText,
  Building2,
  Sparkles,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const ParticipantEvaluationView: React.FC = () => {
  const { 
    activities, 
    selectedActivityId, 
    setSelectedActivityId, 
    submitEvaluation, 
    isOfflineMode, 
    evaluations, 
    offlineQueue 
  } = useApp();

  const currentActivity = activities.find(a => a.id === selectedActivityId) || activities[0];

  // Participant demographic fields
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [participantCategory, setParticipantCategory] = useState<string>('farmer_fisherfolk');
  const [verificationMethod, setVerificationMethod] = useState<'student_id' | 'qr_code' | 'sms_code' | 'signed_attendance'>('student_id');
  const [verificationCode, setVerificationCode] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Ratings
  const [coreRatings, setCoreRatings] = useState<Record<string, number>>({
    satisfaction: 5,
    objectives: 5,
    relevance: 5,
    facilities: 5,
    timeManagement: 5,
    organization: 5
  });

  const specificQuestions = ACTIVITY_SPECIFIC_QUESTIONS[currentActivity.activityType] || [];
  const [specificRatings, setSpecificRatings] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    specificQuestions.forEach(q => { init[q.id] = 5; });
    return init;
  });

  // Comments
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Duplicate Check
  const isAlreadyEvaluated = !!participantEmail && (
    evaluations.some(e => e.activityId === currentActivity.id && e.participantEmail.toLowerCase() === participantEmail.toLowerCase()) ||
    offlineQueue.some(e => e.activityId === currentActivity.id && e.participantEmail.toLowerCase() === participantEmail.toLowerCase())
  );

  const handleCoreRatingChange = (qid: string, val: number) => {
    setCoreRatings(prev => ({ ...prev, [qid]: val }));
  };

  const handleSpecificRatingChange = (qid: string, val: number) => {
    setSpecificRatings(prev => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!participantName.trim() || !participantEmail.trim()) {
      setErrorMessage('Please provide both your Full Name and a valid Email Address.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please accept the Data Privacy notice to finalize and certify your submission.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload: Partial<EvaluationSubmission> = {
      activityId: currentActivity.id,
      participantName: participantName.trim(),
      participantEmail: participantEmail.trim().toLowerCase(),
      participantPhone: participantPhone.trim(),
      participantCategory: participantCategory as any,
      verificationMethod,
      controlNumber: verificationCode.trim() || `SLSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      coreRatings: coreRatings as any,
      specificRatings,
      comments: {
        strengths: strengths.trim(),
        improvements: improvements.trim(),
        suggestions: suggestions.trim()
      },
      consentAccepted: true
    };

    const result = await submitEvaluation(submissionPayload);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessInfo(`Evaluation successfully recorded. Verification Control No: ${result.evaluation?.controlNumber}`);
      setParticipantName('');
      setParticipantEmail('');
      setParticipantPhone('');
      setVerificationCode('');
      setStrengths('');
      setImprovements('');
      setSuggestions('');
      setConsentAccepted(false);
    } else {
      setErrorMessage(result.error || 'Submission could not be completed.');
    }
  };

  const LIKERT_DESCRIPTIONS: Record<number, string> = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral / Moderately Satisfied',
    4: 'Agree / Satisfied',
    5: 'Strongly Agree / Outstanding'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Activity Context Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mb-8">
        
        {/* University Header Banner */}
        <div className="bg-emerald-950 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-300">Official Extension Evaluation</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{currentActivity.activityType.replace('_', ' ')} Program</span>
            </div>
            <div>
              <span>Mode: <strong className="text-white font-medium">{isOfflineMode ? 'Local Field Offline Storage' : 'Direct Cloud Sync'}</strong></span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Participant Feedback & Performance Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Southern Leyte State University uses this adaptive evaluation platform to gather empirical feedback from beneficiaries. Your ratings and suggestions directly inform program enhancements and institutional quality audits.
          </p>

          {/* Activity Dropdown Switcher */}
          <div className="mt-6 pt-5 border-t border-emerald-900">
            <label htmlFor="activity-select" className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
              Select Extension Activity Evaluated:
            </label>
            <select
              id="activity-select"
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full bg-emerald-900 text-white border border-emerald-700 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {activities.map(act => (
                <option key={act.id} value={act.id} className="bg-slate-900 text-white">
                  [{act.activityType.toUpperCase()}] {act.title} — {act.date}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Activity Metadata Strip */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Conducted: {currentActivity.date}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>{currentActivity.venue}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>Resource Speaker: <strong>{currentActivity.trainerOrSpeaker}</strong></span>
          </div>
        </div>

      </div>

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1: Participant Information & Demographics */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="font-bold text-base text-slate-900">
              1. Participant Identity & Demographics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Collected for attendance verification and quality assurance. Governed by the Data Privacy Act of 2012.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="participant-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="participant-name"
                type="text"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Juan D. Dela Cruz"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="participant-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                id="participant-email"
                type="email"
                required
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                placeholder="juan.delacruz@example.com"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="participant-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Number (Optional)
              </label>
              <input
                id="participant-phone"
                type="tel"
                value={participantPhone}
                onChange={(e) => setParticipantPhone(e.target.value)}
                placeholder="0917-000-0000"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="participant-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Beneficiary Sector <span className="text-rose-600">*</span>
              </label>
              <select
                id="participant-category"
                value={participantCategory}
                onChange={(e) => setParticipantCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {Object.entries(PARTICIPANT_CATEGORIES_DISPLAY).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="verification-method" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Verification Method <span className="text-rose-600">*</span>
              </label>
              <select
                id="verification-method"
                value={verificationMethod}
                onChange={(e) => setVerificationMethod(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="student_id">SLSU ID / Student or Employee ID</option>
                <option value="qr_code">Attendance QR Verification</option>
                <option value="signed_attendance">Signed Physical Attendance Sheet</option>
                <option value="sms_code">Barangay Resident ID / Government ID</option>
              </select>
            </div>

            <div>
              <label htmlFor="verification-code" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reference / ID Number (Optional)
              </label>
              <input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="SLSU-2026-XXXX"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {isAlreadyEvaluated && (
            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Evaluation already recorded for this email</strong>
                <span>One evaluation per participant per activity policy is in effect. You have already submitted feedback for this session.</span>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Core Institutional Evaluation Indicators */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="font-bold text-base text-slate-900">
              2. Core Extension Quality Indicators
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard Likert metrics evaluated across all university extension activities (1 to 5 scale).
            </p>
          </div>

          <div className="space-y-6">
            {CORE_QUESTIONS.map((q, idx) => {
              const currentVal = coreRatings[q.id] || 5;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Metric 2.{idx + 1} — {q.label}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                        {q.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-900 shrink-0">
                      {LIKERT_DESCRIPTIONS[currentVal]}
                    </span>
                  </div>

                  {/* 1 to 5 Likert Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={val === currentVal}
                        onClick={() => handleCoreRatingChange(q.id, val)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          val === currentVal
                            ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${val <= currentVal ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        <span>{val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Adaptive Activity-Specific Indicators */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">
                3. Adaptive Indicators for {currentActivity.activityType.toUpperCase().replace('_', ' ')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specialized questions tailored specifically for this extension delivery modality.
            </p>
          </div>

          <div className="space-y-6">
            {specificQuestions.map((q, idx) => {
              const currentVal = specificRatings[q.id] || 5;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Specific 3.{idx + 1} — {q.label}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                        {q.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-900 shrink-0">
                      {LIKERT_DESCRIPTIONS[currentVal]}
                    </span>
                  </div>

                  {/* 1 to 5 Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={val === currentVal}
                        onClick={() => handleSpecificRatingChange(q.id, val)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          val === currentVal
                            ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${val <= currentVal ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        <span>{val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Qualitative Written Comments & Suggestions */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="font-bold text-base text-slate-900">
              4. Qualitative Feedback & Narrative Remarks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Processed through Natural Language Processing (sentiment & theme extraction) to surface actionable insights.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="comment-strengths" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Strengths & Most Beneficial Aspects
              </label>
              <textarea
                id="comment-strengths"
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="What aspects of the trainer, learning materials, or practical demonstration were most valuable?"
                className="w-full border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="comment-improvements" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Areas for Improvement & Logistics / Facilities
              </label>
              <textarea
                id="comment-improvements"
                rows={3}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Did you encounter challenges regarding internet connectivity, sound clarity, venue comfort, or materials?"
                className="w-full border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label htmlFor="comment-suggestions" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Recommendations & Topics for Future Offerings
              </label>
              <textarea
                id="comment-suggestions"
                rows={2}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="What additional livelihood, technical, or community assistance should SLSU-Hinunangan provide?"
                className="w-full border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Data Privacy Consent & Form Action */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Republic Act No. 10173 (Data Privacy Act of 2012) Notice</span>
            </div>
            <p>
              Southern Leyte State University collects your evaluation feedback strictly for academic quality assurance, institutional extension accreditation, and program improvement. Your responses will be anonymized in public reports. Personal identifiers are protected under institutional security controls and will never be shared without your explicit consent.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none mb-6">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-700 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              I have read the privacy notice and certify that the evaluation submitted is my truthful, voluntary assessment.
            </span>
          </label>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Submission Mode:{' '}
              <span className="font-semibold text-slate-800">
                {isOfflineMode ? 'Local Field Buffer (Offline)' : 'Live Central Database'}
              </span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting || isAlreadyEvaluated}
              className={`w-full sm:w-auto px-7 py-3 rounded-lg font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting || isAlreadyEvaluated
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-900 hover:bg-emerald-950 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Validating Submission...' : 'Submit Official Evaluation'}</span>
            </button>
          </div>
        </section>

      </form>
    </div>
  );
};
