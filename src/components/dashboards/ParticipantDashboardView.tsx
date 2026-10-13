import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParticipantEvaluationView } from '../ParticipantEvaluationView';
import { Survey } from '../../types';
import { 
  Home, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Printer, 
  Download, 
  MapPin, 
  Users, 
  Building2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  ClipboardList,
  X,
  Send,
  HelpCircle
} from 'lucide-react';

export const ParticipantDashboardView: React.FC = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    evaluations, 
    activities, 
    surveys,
    submitSurveyResponse,
    setLastSubmittedEvaluation, 
    setSelectedActivityId,
    addToast
  } = useApp();

  // Active survey to answer
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [respondentName, setRespondentName] = useState(currentUser.name);
  const [respondentEmail, setRespondentEmail] = useState(currentUser.email);
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);

  // Participant's completed evaluations (match by email or participantName, or show all recent for demo convenience)
  const myEvaluations = evaluations.filter(e => 
    e.participantEmail.toLowerCase() === currentUser.email.toLowerCase() ||
    e.participantName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || '')
  );

  const displayEvals = myEvaluations.length > 0 ? myEvaluations : evaluations.slice(0, 3);
  const publishedSurveys = surveys.filter(s => s.status === 'published');

  const handleOpenSurvey = (survey: Survey) => {
    setActiveSurvey(survey);
    const initialAnswers: Record<string, any> = {};
    survey.questions?.forEach(q => {
      if (q.type === 'rating_scale') initialAnswers[q.id] = 5;
      else if (q.type === 'single_choice') initialAnswers[q.id] = q.options?.[0] || '';
      else initialAnswers[q.id] = '';
    });
    setSurveyAnswers(initialAnswers);
  };

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSurvey) return;

    setIsSubmittingSurvey(true);
    try {
      await submitSurveyResponse(
        activeSurvey.id,
        surveyAnswers,
        activeSurvey.isAnonymous ? undefined : respondentName,
        activeSurvey.isAnonymous ? undefined : respondentEmail
      );
      addToast({
        type: 'success',
        title: 'Survey Submitted',
        description: `Thank you! Your feedback for "${activeSurvey.title}" has been recorded.`
      });
      setActiveSurvey(null);
    } catch {
      addToast({
        type: 'error',
        title: 'Submission Error',
        description: 'Unable to submit survey response.'
      });
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  const renderSubView = () => {
    switch (currentView) {
      case 'evaluate':
        return <ParticipantEvaluationView />;

      case 'surveys_participant':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-800" />
                  <span>Community Feedback Surveys & Questionnaires</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your voice guides future university research, livelihood programs, and community agricultural initiatives.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                {publishedSurveys.length} Active Surveys
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedSurveys.map(survey => (
                <div key={survey.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Open for Responses
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Until {survey.endDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{survey.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{survey.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Group:</span>
                        <span className="font-medium">{survey.targetAudience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Questions:</span>
                        <span className="font-bold">{survey.questions?.length || 0} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Privacy:</span>
                        <span className="font-semibold text-purple-700">{survey.isAnonymous ? 'Anonymous' : 'Identified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenSurvey(survey)}
                      className="w-full py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Take Survey Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {publishedSurveys.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700">No Active Surveys Available</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Check back soon for new community feedback questionnaires.
                </p>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">My Completed Evaluation Receipts & Certificates</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official certificates of attendance verified under Republic Act No. 10173 with QR codes.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('evaluate')}
                className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit New Evaluation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayEvals.map(ev => {
                const act = activities.find(a => a.id === ev.activityId) || activities[0];
                return (
                  <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-emerald-900">Control #{ev.controlNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          Verified Submission
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{act.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Conducted on {act.date} · {act.venue}</p>

                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Overall Score Given</span>
                          <span className="font-extrabold text-slate-900 tabular-nums text-sm">{ev.meanRating.toFixed(2)} ★</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">Verification Method</span>
                          <span className="font-medium text-slate-700 capitalize">{ev.verificationMethod.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {new Date(ev.submittedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setLastSubmittedEvaluation(ev)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>View / Print Certificate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">SLSU-Hinunangan Extension Schedule & Calendar</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Community workshops, skills training, and agricultural technology transfer programs available for participation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map(act => (
                <div key={act.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {act.activityType}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {act.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">{act.title}</h4>
                    <p className="text-xs text-slate-500 mb-3">{act.description}</p>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{act.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">Resource: {act.trainerOrSpeaker}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedActivityId(act.id);
                        setCurrentView('evaluate');
                      }}
                      className="w-full py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Evaluate This Activity</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'portal':
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-xl p-6 text-white shadow-xs border border-emerald-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-800 text-amber-300">
                    Beneficiary & Participant Portal
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">
                    Welcome, {currentUser.name}
                  </h2>
                  <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                    Thank you for participating in Southern Leyte State University extension activities. 
                    Submit evaluations to receive official downloadable certificates.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('evaluate')}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap self-start md:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Extension Evaluation</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div 
                onClick={() => setCurrentView('evaluate')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-900 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Evaluate Activity</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Complete the quick evaluation form to assess speaker mastery, venue, and materials.
                </p>
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span>Start Evaluation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => setCurrentView('surveys_participant')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:bg-purple-900 group-hover:text-white transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Community Surveys</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Share community feedback and needs assessment for upcoming university programs.
                </p>
                <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                  <span>View Surveys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => setCurrentView('history')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">My Certificates</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Download and print verified certificates of completion with QR codes.
                </p>
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <span>View Certificates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => setCurrentView('calendar')}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Extension Calendar</h4>
                <p className="text-xs text-slate-500 mb-4">
                  Browse upcoming schedules for agricultural trainings, workshops, and seminars.
                </p>
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <span>Explore Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Recent Completed Evaluations Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Recent Completed Evaluations</h3>
                <button
                  onClick={() => setCurrentView('history')}
                  className="text-xs text-emerald-800 hover:underline font-bold"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {displayEvals.map(ev => {
                  const act = activities.find(a => a.id === ev.activityId) || activities[0];
                  return (
                    <div key={ev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{act.title}</span>
                        <span className="text-slate-500 text-[11px]">
                          Ref: #{ev.controlNumber} · {act.venue} · Score: {ev.meanRating.toFixed(2)} ★
                        </span>
                      </div>
                      <button
                        onClick={() => setLastSubmittedEvaluation(ev)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderSubView()}

      {/* Interactive Take Survey Modal */}
      {activeSurvey && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Community Feedback Survey
                </span>
                <h3 className="font-bold text-base text-slate-900">{activeSurvey.title}</h3>
              </div>
              <button 
                onClick={() => setActiveSurvey(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {activeSurvey.description}
            </p>

            <form onSubmit={handleSubmitSurvey} className="space-y-5 text-xs">
              {!activeSurvey.isAnonymous && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={respondentEmail}
                      onChange={(e) => setRespondentEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded p-2 text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>
              )}

              {activeSurvey.questions?.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="block font-bold text-xs text-slate-900">
                    {idx + 1}. {q.title} {q.required && <span className="text-rose-500">*</span>}
                  </label>

                  {q.type === 'rating_scale' && (
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: val })}
                          className={`w-10 h-10 rounded-lg font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
                            surveyAnswers[q.id] === val
                              ? 'bg-emerald-900 text-white shadow-xs'
                              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                      <span className="text-[11px] text-slate-400 ml-2">
                        {surveyAnswers[q.id] === 5 ? 'Strongly Agree / Excellent' : `Rating: ${surveyAnswers[q.id] || 5}/5`}
                      </span>
                    </div>
                  )}

                  {q.type === 'single_choice' && (
                    <div className="space-y-1.5 pt-1">
                      {q.options?.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={surveyAnswers[q.id] === opt}
                            onChange={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: opt })}
                            className="text-emerald-800"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <textarea
                      rows={3}
                      value={surveyAnswers[q.id] || ''}
                      onChange={(e) => setSurveyAnswers({ ...surveyAnswers, [q.id]: e.target.value })}
                      placeholder="Write your constructive feedback or recommendations..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSurvey(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSurvey}
                  className="px-5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingSurvey ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
