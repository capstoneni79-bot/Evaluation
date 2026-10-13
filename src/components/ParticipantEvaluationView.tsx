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
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Info,
  Clock,
  BookOpen
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

  // Find currently selected activity
  const currentActivity = activities.find(a => a.id === selectedActivityId) || activities[0];

  // Form State
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [participantCategory, setParticipantCategory] = useState<string>('farmer_fisherfolk');
  const [verificationMethod, setVerificationMethod] = useState<'student_id' | 'qr_code' | 'sms_code' | 'signed_attendance'>('student_id');
  const [verificationCode, setVerificationCode] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Ratings State (Default to 5 stars for high engagement)
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

  // Comments State
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Quick rating setter
  const handleCoreRatingChange = (qid: string, val: number) => {
    setCoreRatings(prev => ({ ...prev, [qid]: val }));
  };

  const handleSpecificRatingChange = (qid: string, val: number) => {
    setSpecificRatings(prev => ({ ...prev, [qid]: val }));
  };

  // Check if participant already evaluated this activity
  const isAlreadyEvaluated = !!participantEmail && (
    evaluations.some(e => e.activityId === currentActivity.id && e.participantEmail.toLowerCase() === participantEmail.toLowerCase()) ||
    offlineQueue.some(e => e.activityId === currentActivity.id && e.participantEmail.toLowerCase() === participantEmail.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!participantName.trim() || !participantEmail.trim()) {
      setErrorMessage('Please fill in your Full Name and Email Address.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please accept the Data Privacy and Consent Agreement to submit your evaluation.');
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
      setSuccessInfo(`Evaluation submitted successfully! Control No: ${result.evaluation?.controlNumber}`);
      // Clear sensitive fields
      setParticipantName('');
      setParticipantEmail('');
      setParticipantPhone('');
      setVerificationCode('');
      setStrengths('');
      setImprovements('');
      setSuggestions('');
      setConsentAccepted(false);
    } else {
      setErrorMessage(result.error || 'Failed to submit evaluation. Please review your entries.');
    }
  };

  // Likert label helper
  const getLikertLabel = (score: number) => {
    switch (score) {
      case 5: return '5 - Strongly Agree (Outstanding)';
      case 4: return '4 - Agree (Satisfactory)';
      case 3: return '3 - Neutral (Average)';
      case 2: return '2 - Disagree (Poor)';
      case 1: return '1 - Strongly Disagree (Needs Improvement)';
      default: return `${score}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Activity Selector & Info Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-amber-400 text-emerald-950 text-xs font-black uppercase px-2.5 py-1 rounded tracking-wider shadow-xs">
              Adaptive Evaluation Form
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-medium bg-emerald-950/60 px-3 py-1 rounded-full">
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                  <span>Offline Field Mode Active (Local Storage Queue)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Online Connected (Direct Cloud Sync)</span>
                </>
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Extension Activity Feedback & Verification
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Please share your honest ratings and qualitative feedback. Your responses directly guide the Southern Leyte State University Extension Advisory Council in continuously improving community services.
          </p>

          {/* Activity Dropdown selector */}
          <div className="mt-5 pt-4 border-t border-emerald-700/60">
            <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2">
              Select Extension Activity You Attended:
            </label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="w-full bg-emerald-950/90 text-white font-medium border border-emerald-600/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {activities.map(act => (
                <option key={act.id} value={act.id} className="bg-slate-900 text-white">
                  [{act.activityType.toUpperCase().replace('_', ' ')}] {act.title} ({act.date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Activity Meta Card */}
        <div className="bg-emerald-50/60 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Conducted: {currentActivity.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{currentActivity.venue}</span>
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <div className="flex sm:justify-end items-center gap-2 text-slate-700 font-medium">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Trainer/Speaker: {currentActivity.trainerOrSpeaker}</span>
            </div>
            <div className="text-slate-500">
              <span>Lead Dept: {currentActivity.organizingDepartment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1: Participant Identity & Validation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Participant Verification & Demographics
              </h3>
              <p className="text-xs text-slate-500">
                Data minimization applied pursuant to RA 10173 (Data Privacy Act of 2012)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g. Juan D. Dela Cruz"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                placeholder="e.g. juan.delacruz@gmail.com"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Number (Mobile / SMS)
              </label>
              <input
                type="tel"
                value={participantPhone}
                onChange={(e) => setParticipantPhone(e.target.value)}
                placeholder="e.g. 0917-123-4567"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Beneficiary Sector / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={participantCategory}
                onChange={(e) => setParticipantCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              >
                {Object.entries(PARTICIPANT_CATEGORIES_DISPLAY).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Verification Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={verificationMethod}
                onChange={(e) => setVerificationMethod(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              >
                <option value="student_id">SLSU ID / Student / Faculty ID</option>
                <option value="qr_code">Attendance Sheet QR Validation</option>
                <option value="signed_attendance">Signed Physical Logbook</option>
                <option value="sms_code">Barangay Certificate / Government ID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                ID / Control Reference Number (Optional)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="e.g. SLSU-2026-XXXX or ID No."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {isAlreadyEvaluated && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Notice:</strong> An evaluation record under this email address already exists for this activity. One evaluation per participant policy is enforced.
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Common Core Evaluation Questions (All Activity Types) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Core Extension Evaluation Indicators
              </h3>
              <p className="text-xs text-slate-500">
                Standard institutional metrics mandated for all extension modalities (1 to 5 scale)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {CORE_QUESTIONS.map((q, idx) => {
              const currentVal = coreRatings[q.id] || 5;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Metric 2.{idx + 1}: {q.label}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                        {q.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                      {getLikertLabel(currentVal)}
                    </span>
                  </div>

                  {/* 1-5 Star interactive selector */}
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleCoreRatingChange(q.id, star)}
                        className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          star <= currentVal
                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                        }`}
                        title={`Rate ${star}`}
                      >
                        <Star className={`w-5 h-5 ${star <= currentVal ? 'fill-amber-400 text-amber-500' : ''}`} />
                        <span className="text-xs font-bold">{star}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Adaptive Activity-Specific Questions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Adaptive Activity-Specific Indicators
                </h3>
                <span className="px-2 py-0.5 bg-amber-400 text-emerald-950 font-bold text-[10px] rounded uppercase">
                  {currentActivity.activityType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Questions customized specifically for this extension category
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {specificQuestions.map((q, idx) => {
              const currentVal = specificRatings[q.id] || 5;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 hover:bg-amber-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Specific 3.{idx + 1}: {q.label}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                        {q.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                      {getLikertLabel(currentVal)}
                    </span>
                  </div>

                  {/* 1-5 Star interactive selector */}
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleSpecificRatingChange(q.id, star)}
                        className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          star <= currentVal
                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                        }`}
                        title={`Rate ${star}`}
                      >
                        <Star className={`w-5 h-5 ${star <= currentVal ? 'fill-amber-400 text-amber-500' : ''}`} />
                        <span className="text-xs font-bold">{star}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Qualitative Written Feedback (For AI Sentiment & Topic Engine) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Qualitative Written Comments & Suggestions
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold text-[10px] rounded">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  NLP & Sentiment Analyzed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Your comments are processed through sentiment and topic analysis to highlight recurring strengths and weaknesses
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Strengths & Most Beneficial Aspects
              </label>
              <textarea
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="What aspects of the trainer, content, practical drills, or coordination did you appreciate most?"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Specific Areas for Improvement & Facility Challenges
              </label>
              <textarea
                rows={3}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Did you encounter issues with internet connectivity, venue ventilation, audio sound, queue time, or starter materials?"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Recommendations & Future Extension Offerings
              </label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="What other technical, agricultural, livelihood, or health trainings should SLSU-Hinunangan provide?"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Data Privacy Consent & Submission */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-600 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-1">
                Data Privacy Act of 2012 (Republic Act No. 10173) Compliance Notice
              </strong>
              <span>
                Southern Leyte State University (SLSU) is committed to protecting your privacy. The information collected in this evaluation form will be processed strictly for quality assurance, extension program assessment, and academic reporting. Identifiable details are stored securely under role-based encryption and will not be disclosed to unauthorized third parties.
              </span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none mb-6">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              I agree to the privacy notice and certify that my feedback is authentic and truthful.
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              Submission Mode:{' '}
              <strong className={isOfflineMode ? 'text-amber-700' : 'text-emerald-700'}>
                {isOfflineMode ? 'Local Field Offline Storage (Auto-sync ready)' : 'Direct Central Cloud Submission'}
              </strong>
            </p>

            <button
              type="submit"
              disabled={isSubmitting || isAlreadyEvaluated}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting || isAlreadyEvaluated
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white hover:shadow-lg'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Validating & Recording...' : 'Submit Official Evaluation'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
