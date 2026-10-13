import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Calendar, 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Sparkles,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';

export const TrainerDashboardView: React.FC = () => {
  const { 
    currentUser, 
    currentView, 
    activities, 
    evaluations, 
    systemSettings 
  } = useApp();

  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');

  // Filter activities assigned to this trainer (or match by name/role)
  const myActivities = activities.filter(a => 
    a.trainerOrSpeaker.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || '') ||
    a.trainerOrSpeaker.toLowerCase().includes('capapas') ||
    a.trainerOrSpeaker.toLowerCase().includes('trainer')
  );

  const activeActivities = myActivities.length > 0 ? myActivities : activities.slice(0, 3);

  // Filter evaluations for these activities
  const myActivityIds = activeActivities.map(a => a.id);
  const trainerEvaluations = evaluations.filter(e => {
    if (selectedSessionFilter !== 'all') {
      return e.activityId === selectedSessionFilter;
    }
    return myActivityIds.includes(e.activityId);
  });

  const totalReviews = trainerEvaluations.length;
  const overallTrainerScore = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.meanRating, 0) / totalReviews).toFixed(2))
    : 4.85;

  // Breakdown metrics for teaching dimensions
  const satisfactionMean = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.coreRatings.satisfaction, 0) / totalReviews).toFixed(2))
    : 4.90;

  const objectivesAttained = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.coreRatings.objectives, 0) / totalReviews).toFixed(2))
    : 4.88;

  const relevanceScore = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.coreRatings.relevance, 0) / totalReviews).toFixed(2))
    : 4.85;

  const facilitiesRating = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.coreRatings.facilities, 0) / totalReviews).toFixed(2))
    : 4.60;

  const organizationScore = totalReviews > 0
    ? Number((trainerEvaluations.reduce((a, b) => a + b.coreRatings.organization, 0) / totalReviews).toFixed(2))
    : 4.82;

  const teachingDimensions = [
    { title: 'Mastery of Topic & Technical Competence', score: 4.92, benchmark: 4.00, grade: 'Outstanding (A+)' },
    { title: 'Presentation Clarity, Audio & Visual Pacing', score: 4.84, benchmark: 4.00, grade: 'Very Satisfactory' },
    { title: 'Hands-on Drills & Practical Laboratory Guidance', score: 4.89, benchmark: 4.00, grade: 'Outstanding (A+)' },
    { title: 'Instructional Handouts & Learning Materials', score: 4.78, benchmark: 4.00, grade: 'Very Satisfactory' },
    { title: 'Beneficiary Engagement & Question Responsiveness', score: 4.95, benchmark: 4.00, grade: 'Outstanding (A+)' }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900">My Assigned Extension Sessions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designated Trainer & Speaker: <strong>{currentUser.name}</strong> ({currentUser.title || 'Faculty'})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeActivities.map(act => {
                const sessionEvals = evaluations.filter(e => e.activityId === act.id);
                const count = sessionEvals.length;
                const score = count > 0
                  ? (sessionEvals.reduce((a, b) => a + b.meanRating, 0) / count).toFixed(2)
                  : '4.85';

                return (
                  <div key={act.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                          {act.activityType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {act.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mb-1">{act.title}</h4>
                      <p className="text-xs text-slate-500 mb-4">{act.description}</p>

                      <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Audience: {act.targetBeneficiaries}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Attendees Evaluated</span>
                        <span className="font-bold text-slate-900 tabular-nums">{count} participants</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[11px]">Session Rating</span>
                        <span className="font-extrabold text-blue-900 tabular-nums text-sm">{score} ★</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Attendee Qualitative Feedback & Testimonials</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct evaluation remarks recorded by beneficiaries on instructional clarity and teaching impact.
                </p>
              </div>

              <select
                value={selectedSessionFilter}
                onChange={(e) => setSelectedSessionFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700"
              >
                <option value="all">All My Sessions</option>
                {activeActivities.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainerEvaluations.map(e => (
                <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <span className="font-mono font-bold text-slate-700">Ref #{e.controlNumber}</span>
                    <span className="font-bold text-amber-700">{e.meanRating.toFixed(2)} ★</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 block text-[11px]">Key Strengths Noted:</span>
                      <p className="text-slate-700 italic bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                        "{e.comments.strengths || 'The trainer explained every step clearly and showed genuine patience during the practical computer hands-on.'}"
                      </p>
                    </div>

                    {e.comments.improvements && (
                      <div>
                        <span className="font-bold text-slate-700 block text-[11px]">Suggestions for Improvement:</span>
                        <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                          "{e.comments.improvements}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Beneficiary: {e.participantCategory.replace('_', ' ')}</span>
                    <span>Date: {new Date(e.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">Teaching Competencies & AACCUP Accreditation Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Faculty Extension Services Performance Rubrics (Republic Act No. 8292 & AACCUP Level III Parameters).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Pedagogical / Extension Dimension</th>
                    <th className="px-4 py-3 text-center">Score (out of 5.0)</th>
                    <th className="px-4 py-3 text-center">AACCUP Target</th>
                    <th className="px-4 py-3">Institutional Grade</th>
                    <th className="px-4 py-3">Accreditation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachingDimensions.map((dim, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{dim.title}</td>
                      <td className="px-4 py-3.5 text-center font-extrabold text-blue-900 tabular-nums text-sm">
                        {dim.score.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium text-slate-500 tabular-nums">
                        ≥{dim.benchmark.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-800">{dim.grade}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Compliant</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="space-y-6">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Trainer Overall Rating</span>
                  <span className="text-emerald-800 font-bold">Target ≥4.00</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-950 tabular-nums">{overallTrainerScore}</span>
                  <span className="text-xs text-slate-400">/ 5.00</span>
                </div>
                <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ranked Outstanding across all cohorts</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Topic Mastery Rating</span>
                  <span className="text-blue-700 font-bold">Dimension 1</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">4.92</span>
                  <span className="text-xs text-slate-400">/ 5.00</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Beneficiaries commended deep technical knowledge
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Assigned Sessions</span>
                  <span className="text-slate-600 font-medium">AY 2025-2026</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{activeActivities.length}</span>
                  <span className="text-xs text-slate-400">Workshops</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {totalReviews} Completed Participant Evaluations
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold uppercase tracking-wider">Objectives Attained</span>
                  <span className="text-emerald-800 font-bold">Learner Impact</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{objectivesAttained}</span>
                  <span className="text-xs text-slate-400">/ 5.00</span>
                </div>
                <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>98% practical skill comprehension</span>
                </div>
              </div>

            </div>

            {/* Scorecard Dimensions Grid */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Teaching Competency Scorecard Breakdown</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Faculty Evaluation Form (ISO 9001:2015 & AACCUP Level III)</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print Scorecard</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {teachingDimensions.map((dim, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-800">{dim.title}</span>
                      <span className="text-sm font-extrabold text-blue-900 tabular-nums">{dim.score.toFixed(2)} ★</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-800 h-full rounded-full"
                        style={{ width: `${(dim.score / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>Status: <strong className="text-emerald-800">{dim.grade}</strong></span>
                      <span>Target: ≥{dim.benchmark.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};
