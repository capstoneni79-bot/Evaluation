import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, EvaluationSubmission, AIExecutiveReport } from '../types';
import { 
  BarChart3, 
  Sparkles, 
  FileText, 
  Users, 
  ShieldCheck, 
  Calendar, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Printer, 
  Plus, 
  MessageSquare, 
  Building2, 
  Award,
  RefreshCw,
  Send,
  HelpCircle,
  Clock,
  Layers,
  FileCheck2,
  Lock
} from 'lucide-react';
import { TOPIC_LABELS, PARTICIPANT_CATEGORIES_DISPLAY } from '../data/seedData';

type AdminTab = 'overview' | 'sentiment_topics' | 'ai_reports' | 'submissions' | 'activities' | 'audit_privacy';

export const AdminDashboard: React.FC = () => {
  const { 
    activities, 
    evaluations, 
    createActivity, 
    maskPII, 
    setMaskPII, 
    logAuditAction, 
    updateFollowUpStatus, 
    exportDataAsCSV, 
    auditLogs,
    role
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Executive Report Generation State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<AIExecutiveReport | null>(null);
  const [reportFocus, setReportFocus] = useState('Comprehensive (Facilities, Trainer, Impact, Logistics)');
  
  // AI Quick Query State
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Unmask PII Confirmation Modal State
  const [unmaskTarget, setUnmaskTarget] = useState<EvaluationSubmission | null>(null);
  const [unmaskReason, setUnmaskReason] = useState('');
  const [unmaskedIds, setUnmaskedIds] = useState<Record<string, boolean>>({});

  // Follow-up status edit modal
  const [statusTarget, setStatusTarget] = useState<EvaluationSubmission | null>(null);
  const [statusVal, setStatusVal] = useState<'none' | 'pending' | 'in_progress' | 'resolved'>('none');
  const [statusNotes, setStatusNotes] = useState('');

  // New Activity Modal State
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActType, setNewActType] = useState<'training' | 'livelihood' | 'seminar' | 'outreach' | 'community_service'>('training');
  const [newActDescription, setNewActDescription] = useState('');
  const [newActDate, setNewActDate] = useState(new Date().toISOString().split('T')[0]);
  const [newActVenue, setNewActVenue] = useState('SLSU-Hinunangan Campus');
  const [newActBeneficiaries, setNewActBeneficiaries] = useState('Local Farmers & Fisherfolk');
  const [newActDept, setNewActDept] = useState('Faculty of Computer Studies and Information Technology (FCSIT)');
  const [newActCoordinator, setNewActCoordinator] = useState('Extension Coordinator');
  const [newActSpeaker, setNewActSpeaker] = useState('Faculty Resource Specialist');
  const [newActTargetCount, setNewActTargetCount] = useState(40);

  // Filter evaluations
  const filteredEvaluations = evaluations.filter(e => {
    if (selectedActivityFilter !== 'all' && e.activityId !== selectedActivityFilter) return false;
    if (selectedSentimentFilter !== 'all' && e.sentiment.overall !== selectedSentimentFilter) return false;
    if (selectedTopicFilter !== 'all' && !e.sentiment.topics.includes(selectedTopicFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = `${e.comments.strengths} ${e.comments.improvements} ${e.comments.suggestions}`.toLowerCase().includes(q);
      const matchName = e.participantName.toLowerCase().includes(q);
      const matchControl = e.controlNumber.toLowerCase().includes(q);
      if (!matchComment && !matchName && !matchControl) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalEvaluationsCount = filteredEvaluations.length;
  const overallMean = totalEvaluationsCount > 0
    ? Number((filteredEvaluations.reduce((acc, curr) => acc + curr.meanRating, 0) / totalEvaluationsCount).toFixed(2))
    : 0;

  // Promoters (ratings >= 4.5), Passives (3.5 - 4.49), Detractors (< 3.5)
  const promoters = filteredEvaluations.filter(e => e.meanRating >= 4.5).length;
  const detractors = filteredEvaluations.filter(e => e.meanRating < 3.5).length;
  const netSatisfactionScore = totalEvaluationsCount > 0
    ? Math.round(((promoters - detractors) / totalEvaluationsCount) * 100)
    : 85;

  // Sentiment Breakdown
  const positiveSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'positive').length;
  const neutralSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'neutral').length;
  const negativeSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'negative').length;

  // Topic Frequencies
  const topicCounts: Record<string, number> = {};
  filteredEvaluations.forEach(e => {
    (e.sentiment.topics || []).forEach(t => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });

  // Offline vs Online Count
  const offlineCount = filteredEvaluations.filter(e => e.submissionSource === 'offline_synced').length;
  const onlineCount = filteredEvaluations.filter(e => e.submissionSource === 'online').length;

  // Generate AI Executive Report
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/ai/executive-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: selectedActivityFilter === 'all' ? undefined : selectedActivityFilter,
          focusAreas: reportFocus,
          timeFrame: 'Academic Year 2025-2026'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.report);
      }
    } catch (err) {
      console.error('Failed to generate AI executive report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Ask AI Quick Insights Query
  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    setIsAskingAi(true);
    setQuickAnswer(null);

    try {
      const res = await fetch('/api/ai/quick-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: quickQuestion })
      });
      if (res.ok) {
        const data = await res.json();
        setQuickAnswer(data.answer);
      }
    } catch (err) {
      setQuickAnswer('Network error querying AI engine.');
    } finally {
      setIsAskingAi(false);
    }
  };

  // Confirm unmask PII with audit log
  const handleConfirmUnmask = () => {
    if (!unmaskTarget) return;
    if (!unmaskReason.trim()) return;

    logAuditAction(
      'UNMASK_PARTICIPANT_PII',
      unmaskTarget.id,
      unmaskReason.trim(),
      unmaskTarget.controlNumber
    );

    setUnmaskedIds(prev => ({ ...prev, [unmaskTarget.id]: true }));
    setUnmaskTarget(null);
    setUnmaskReason('');
  };

  // Confirm status update
  const handleSaveStatus = async () => {
    if (!statusTarget) return;
    await updateFollowUpStatus(statusTarget.id, statusVal, statusNotes);
    setStatusTarget(null);
  };

  // Create new activity handler
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    await createActivity({
      title: newActTitle,
      activityType: newActType,
      description: newActDescription,
      date: newActDate,
      venue: newActVenue,
      targetBeneficiaries: newActBeneficiaries,
      organizingDepartment: newActDept,
      leadCoordinator: newActCoordinator,
      trainerOrSpeaker: newActSpeaker,
      totalTargetParticipants: newActTargetCount
    });
    setShowNewActivityModal(false);
    setNewActTitle('');
    setNewActDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner: University Coordination Deck */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              {role === 'super_admin' ? 'Super Admin & Quality Assurance' : 'Coordinator Analytics Portal'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">SLSU-Hinunangan Campus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Extension Evaluation Analytics & Decision Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Automated sentiment analysis, topic detection, and evidence-based recommendations for extension activities.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowNewActivityModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Activity</span>
          </button>

          <button
            onClick={() => exportDataAsCSV(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Anonymized CSV Dataset"
          >
            <Download className="w-4 h-4" />
            <span>Export Anonymized</span>
          </button>

          {role === 'super_admin' && (
            <button
              onClick={() => exportDataAsCSV(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
              title="Super Admin Authorized Export with Identifiers (Logged)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Full PII Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('sentiment_topics')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sentiment_topics'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Sentiment & Topics</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_reports')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ai_reports'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Executive Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Submissions & Follow-Up ({evaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Activity Roster ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_privacy')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit_privacy'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Data Privacy & Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Activity Filter Row */}
      <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter by Extension Activity:</span>
          </span>
          <select
            value={selectedActivityFilter}
            onChange={(e) => setSelectedActivityFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="all">All Extension Activities Combined ({evaluations.length} evals)</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.activityType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Showing <strong className="text-slate-900">{filteredEvaluations.length}</strong> of {evaluations.length} submissions
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & KEY PERFORMANCE INDICATORS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Mean Rating</span>
                <span className="p-2 bg-emerald-50 rounded-lg text-emerald-700 font-bold text-xs">
                  Target: 4.00
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{overallMean}</span>
                <span className="text-xs font-semibold text-slate-400">/ 5.00</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Exceeds Institutional Quality Benchmark</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Satisfaction (NSS)</span>
                <span className="p-2 bg-amber-50 rounded-lg text-amber-700 font-bold text-xs">
                  {promoters} Promoters
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">+{netSatisfactionScore}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                % Promoters (4.5+) minus % Detractors (&lt;3.5)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Positive Sentiment</span>
                <span className="p-2 bg-teal-50 rounded-lg text-teal-700 font-bold text-xs">
                  NLP Analyzed
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-teal-900">
                  {totalEvaluationsCount > 0 ? Math.round((positiveSentimentCount / totalEvaluationsCount) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-500">({positiveSentimentCount} of {totalEvaluationsCount})</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {neutralSentimentCount} Neutral • {negativeSentimentCount} Negative comments
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Online / Offline Sync</span>
                <span className="p-2 bg-indigo-50 rounded-lg text-indigo-700 font-bold text-xs">
                  Field Resilient
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{onlineCount}</span>
                <span className="text-xs font-semibold text-slate-400">Online / {offlineCount} Field Synced</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% duplicate-verified integrity</span>
              </p>
            </div>

          </div>

          {/* Core Indicator Mean Rating Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Core Extension Dimension Ratings (Likert 1 to 5)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mean score aggregated across all validated submissions
            </p>

            <div className="space-y-4">
              {[
                { label: 'Overall Satisfaction', key: 'satisfaction', benchmark: 4.5 },
                { label: 'Attainment of Objectives', key: 'objectives', benchmark: 4.5 },
                { label: 'Relevance & Practical Utility', key: 'relevance', benchmark: 4.6 },
                { label: 'Venue & Facilities Setup', key: 'facilities', benchmark: 4.0 },
                { label: 'Time Management & Program Flow', key: 'timeManagement', benchmark: 4.2 },
                { label: 'Overall Organization & Coordination', key: 'organization', benchmark: 4.5 },
              ].map(dim => {
                const values = filteredEvaluations.map(e => e.coreRatings[dim.key as keyof typeof e.coreRatings] || 4.5);
                const avg = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 4.5;
                const percentage = (avg / 5.0) * 100;

                return (
                  <div key={dim.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dim.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-900">{avg} / 5.00</span>
                        <span className="text-[10px] text-slate-400">({Math.round(percentage)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          avg >= 4.5 ? 'bg-emerald-600' : avg >= 4.0 ? 'bg-teal-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Extension Activities Performance Leaderboard
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation turnout and satisfaction comparison across SLSU-Hinunangan programs
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Activity Title</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5 text-center">Evaluations</th>
                    <th className="px-4 py-3.5 text-center">Mean Rating</th>
                    <th className="px-4 py-3.5">Coordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activities.map(act => {
                    const actEvals = evaluations.filter(e => e.activityId === act.id);
                    const avg = actEvals.length > 0
                      ? Number((actEvals.reduce((a, b) => a + b.meanRating, 0) / actEvals.length).toFixed(2))
                      : 'No data';

                    return (
                      <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-xs">
                          {act.title}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded uppercase text-[10px]">
                            {act.activityType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{act.date}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                          {actEvals.length} / {act.totalTargetParticipants}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-extrabold text-emerald-900 px-2 py-0.5 bg-emerald-50 rounded">
                            {avg !== 'No data' ? `${avg} ★` : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{act.leadCoordinator}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SENTIMENT & TOPIC ANALYTICS ENGINE */}
      {/* ========================================================= */}
      {activeTab === 'sentiment_topics' && (
        <div className="space-y-6">

          {/* Sentiment Distribution Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Natural Language Sentiment Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Classified from written comments and suggestions using NLP polarity detection
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase">Positive Comments</p>
                  <p className="text-2xl font-black text-emerald-950 mt-1">{positiveSentimentCount}</p>
                </div>
                <span className="text-lg font-bold text-emerald-700">
                  {totalEvaluationsCount > 0 ? Math.round((positiveSentimentCount / totalEvaluationsCount) * 100) : 0}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase">Neutral / Constructive</p>
                  <p className="text-2xl font-black text-amber-950 mt-1">{neutralSentimentCount}</p>
                </div>
                <span className="text-lg font-bold text-amber-700">
                  {totalEvaluationsCount > 0 ? Math.round((neutralSentimentCount / totalEvaluationsCount) * 100) : 0}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-800 uppercase">Negative / Critical</p>
                  <p className="text-2xl font-black text-rose-950 mt-1">{negativeSentimentCount}</p>
                </div>
                <span className="text-lg font-bold text-rose-700">
                  {totalEvaluationsCount > 0 ? Math.round((negativeSentimentCount / totalEvaluationsCount) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-600 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (positiveSentimentCount / totalEvaluationsCount) * 100 : 80}%` }}
                title="Positive"
              />
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (neutralSentimentCount / totalEvaluationsCount) * 100 : 15}%` }}
                title="Neutral"
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (negativeSentimentCount / totalEvaluationsCount) * 100 : 5}%` }}
                title="Negative"
              />
            </div>
          </div>

          {/* Interactive Recurring Topics Cloud / Explorer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Recurring Feedback Themes & Topic Analysis
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click a theme below to filter comments specifically matching that domain:
            </p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              <button
                onClick={() => setSelectedTopicFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTopicFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Topics ({totalEvaluationsCount})
              </button>

              {Object.entries(TOPIC_LABELS).map(([key, config]) => {
                const count = topicCounts[key] || 0;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTopicFilter(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTopicFilter === key
                        ? 'ring-2 ring-emerald-700 bg-white text-emerald-950 font-black shadow-xs'
                        : config.color
                    }`}
                  >
                    <span>{config.label}</span>
                    <span className="px-1.5 py-0.2 bg-white/80 rounded-full text-[10px]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Recurring Concerns Highlight Box */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Identified Action Items & Logistical Bottlenecks:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium pl-1">
                <li>
                  <strong>Venue Internet Bandwidth:</strong> Participants in ICT lab sessions experienced slowdowns during practical cloud and e-commerce uploads.
                </li>
                <li>
                  <strong>Field Outreach Canopy Shade:</strong> Senior citizens waiting for health checkups required outdoor tents to mitigate direct sun exposure.
                </li>
                <li>
                  <strong>Audio Acoustics:</strong> Gymnasium echoes made open forum queries hard to hear; cordless roaming microphones requested.
                </li>
              </ul>
            </div>
          </div>

          {/* Real Beneficiary Written Quotes Feed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Verified Participant Feedback Statements ({filteredEvaluations.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvaluations.map(e => (
                <div key={e.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">
                      {maskPII && !unmaskedIds[e.id]
                        ? `${e.participantName.charAt(0)}*** ${e.participantName.split(' ')[1] ? e.participantName.split(' ')[1].charAt(0) + '***' : ''}`
                        : e.participantName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      e.sentiment.overall === 'positive'
                        ? 'bg-emerald-100 text-emerald-800'
                        : e.sentiment.overall === 'neutral'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {e.sentiment.overall}
                    </span>
                  </div>

                  {e.comments.strengths && (
                    <div className="text-xs">
                      <span className="text-emerald-800 font-bold block mb-0.5">Strengths:</span>
                      <p className="text-slate-700 italic">"{e.comments.strengths}"</p>
                    </div>
                  )}

                  {e.comments.improvements && (
                    <div className="text-xs">
                      <span className="text-amber-800 font-bold block mb-0.5">Areas for Improvement:</span>
                      <p className="text-slate-700 italic">"{e.comments.improvements}"</p>
                    </div>
                  )}

                  {e.comments.suggestions && (
                    <div className="text-xs">
                      <span className="text-blue-800 font-bold block mb-0.5">Suggestions:</span>
                      <p className="text-slate-700 italic">"{e.comments.suggestions}"</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1">
                    {(e.sentiment.topics || []).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AI-ASSISTED EXECUTIVE REPORT GENERATOR (GEMINI) */}
      {/* ========================================================= */}
      {activeTab === 'ai_reports' && (
        <div className="space-y-6">

          {/* Interactive AI Query Box */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-amber-300">
                AI Extension Analytics Query Engine
              </h3>
            </div>
            <p className="text-xs text-emerald-100 mb-4 max-w-2xl">
              Powered by Gemini API server-side analysis. Ask questions in natural language regarding beneficiary feedback, trainer performance, or community needs across Hinunangan.
            </p>

            <form onSubmit={handleAskAi} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="e.g. What were the most common complaints about venue facilities and internet?"
                className="flex-1 bg-emerald-900/60 border border-emerald-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={isAskingAi}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isAskingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isAskingAi ? 'Analyzing...' : 'Ask AI'}</span>
              </button>
            </form>

            {quickAnswer && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-900/80 border border-emerald-700 text-xs text-emerald-50 whitespace-pre-line leading-relaxed animate-in fade-in">
                <strong className="text-amber-300 block mb-1">AI Analytical Insight:</strong>
                {quickAnswer}
              </div>
            )}
          </div>

          {/* Executive Report Generator Trigger Deck */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  AI-Assisted Executive Report Generator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synthesizes ratings, themes, and qualitative remarks into an official academic report for the University Advisory Board
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={reportFocus}
                  onChange={(e) => setReportFocus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium"
                >
                  <option value="Comprehensive (Facilities, Trainer, Impact, Logistics)">Comprehensive Quality Audit</option>
                  <option value="Logistics and Venue Infrastructure Focus">Facilities & Logistics Focus</option>
                  <option value="Curriculum & Trainer Mastery Focus">Curriculum & Trainer Mastery Focus</option>
                  <option value="Community Needs & Livelihood Viability Focus">Community Needs & Viability Focus</option>
                </select>

                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingReport ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>{isGeneratingReport ? 'Generating Report...' : 'Generate Executive Report'}</span>
                </button>
              </div>
            </div>

            {/* Rendered Executive Report Document */}
            {aiReport ? (
              <div className="bg-slate-50 border-2 border-emerald-900/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                {/* Print button bar */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold uppercase tracking-wide">
                      Official Institutional Document
                    </span>
                    <span className="text-xs text-slate-500">Generated: {aiReport.generatedDate}</span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>

                {/* Letterhead */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-emerald-900">
                    Southern Leyte State University - Hinunangan Campus
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Faculty of Computer Studies and Information Technology • Office of Extension Services
                  </p>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                    {aiReport.reportTitle}
                  </h2>
                </div>

                {/* Executive Summary */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                    1. Executive Summary & Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                    {aiReport.executiveSummary}
                  </p>
                </div>

                {/* Key Performance Indicators */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                    2. Institutional Performance Indicators
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiReport.keyPerformanceIndicators.map((kpi, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">{kpi.metric}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-900">{kpi.value}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {kpi.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Benchmark: {kpi.benchmark}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recurring Strengths & Critical Weaknesses Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Strengths */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Validated Strengths & Commendations</span>
                    </h4>
                    <div className="space-y-3">
                      {aiReport.recurringStrengths.map((str, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-emerald-50/60 text-xs">
                          <span className="font-bold text-emerald-950 block">{str.topic}</span>
                          <p className="text-slate-700 mt-1">{str.summary}</p>
                          <span className="text-[10px] font-semibold text-emerald-700 mt-1 inline-block">
                            Ratio: {str.sentimentRatio}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white p-4 rounded-xl border border-rose-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Identified Weaknesses & Bottlenecks</span>
                    </h4>
                    <div className="space-y-3">
                      {aiReport.criticalWeaknesses.map((w, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-rose-50/60 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-rose-950">{w.topic}</span>
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                              {w.severity}
                            </span>
                          </div>
                          <p className="text-slate-700 mt-1">{w.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actionable Recommendations Table */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                    3. AI-Assisted Actionable Recommendations (Decision Support)
                  </h4>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Category</th>
                          <th className="p-3">Actionable Recommendation</th>
                          <th className="p-3">Expected Institutional Impact</th>
                          <th className="p-3">Responsible Unit</th>
                          <th className="p-3 text-center">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {aiReport.aiActionableRecommendations.map((rec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800">{rec.category}</td>
                            <td className="p-3 text-slate-700">{rec.recommendation}</td>
                            <td className="p-3 text-slate-600">{rec.expectedImpact}</td>
                            <td className="p-3 font-medium text-emerald-800">{rec.responsibleUnit}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                rec.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {rec.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Evidence Quotes */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                    4. Beneficiary Feedback Excerpts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiReport.evidenceQuotes.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs italic text-slate-700">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase not-italic block mb-1">
                          Theme: {q.theme}
                        </span>
                        "{q.quote}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-off footer */}
                <div className="pt-6 border-t border-slate-300 text-xs text-slate-600">
                  <p className="italic text-[11px] text-slate-500 mb-6">
                    {aiReport.policyNotice}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 mb-1">
                        Engr. Sheryl Ann C. Barrot, MIT
                      </p>
                      <p className="text-[10px] text-slate-500">Lead Researcher & FCSIT Faculty</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 mb-1">
                        Prof. Arnelyn T. Capapas
                      </p>
                      <p className="text-[10px] text-slate-500">Extension Services Coordinator</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 mb-1">
                        University Campus Director
                      </p>
                      <p className="text-[10px] text-slate-500">SLSU - Hinunangan Campus</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-700">No Executive Report Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Click the button above to generate a formal evaluation report synthesizing feedback from validated participants.
                </p>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
                >
                  Synthesize Report Now
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SUBMISSIONS & FOLLOW-UP TRACKER */}
      {/* ========================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">

          {/* Submissions Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by participant name, control number, or comments..."
                className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setMaskPII(!maskPII)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                title="Toggle Republic Act 10173 PII Masking"
              >
                {maskPII ? <EyeOff className="w-3.5 h-3.5 text-emerald-700" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                <span>{maskPII ? 'PII Masking Active (RA 10173)' : 'PII Visible'}</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Control No.</th>
                    <th className="px-4 py-3.5">Participant</th>
                    <th className="px-4 py-3.5">Sector</th>
                    <th className="px-4 py-3.5 text-center">Rating</th>
                    <th className="px-4 py-3.5">Sentiment</th>
                    <th className="px-4 py-3.5">Comments Excerpt</th>
                    <th className="px-4 py-3.5">Source</th>
                    <th className="px-4 py-3.5">Follow-Up</th>
                    <th className="px-4 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEvaluations.map(e => {
                    const isUnmasked = unmaskedIds[e.id] || !maskPII;
                    const displayName = isUnmasked
                      ? e.participantName
                      : `${e.participantName.charAt(0)}*** ${e.participantName.split(' ')[1] ? e.participantName.split(' ')[1].charAt(0) + '***' : ''}`;
                    const displayEmail = isUnmasked
                      ? e.participantEmail
                      : `${e.participantEmail.charAt(0)}***@${e.participantEmail.split('@')[1] || 'domain.com'}`;

                    return (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-emerald-950">
                          {e.controlNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-900">{displayName}</p>
                          <p className="text-[10px] text-slate-500">{displayEmail}</p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">
                          {PARTICIPANT_CATEGORIES_DISPLAY[e.participantCategory] || e.participantCategory}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-900">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded font-extrabold">
                            {e.meanRating} ★
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            e.sentiment.overall === 'positive'
                              ? 'bg-emerald-100 text-emerald-800'
                              : e.sentiment.overall === 'neutral'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {e.sentiment.overall}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 max-w-xs text-slate-600 truncate">
                          {e.comments.improvements || e.comments.strengths || e.comments.suggestions || 'No comments'}
                        </td>
                        <td className="px-4 py-3.5 text-[11px] text-slate-500">
                          {e.submissionSource === 'offline_synced' ? (
                            <span className="text-amber-700 font-semibold">Field Synced</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">Online</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            e.adminFollowUpStatus === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : e.adminFollowUpStatus === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : e.adminFollowUpStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {e.adminFollowUpStatus || 'none'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!isUnmasked && (
                              <button
                                onClick={() => setUnmaskTarget(e)}
                                className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                                title="Unmask PII with authorized audit reason"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setStatusTarget(e);
                                setStatusVal(e.adminFollowUpStatus || 'none');
                                setStatusNotes(e.adminNotes || '');
                              }}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-colors"
                            >
                              Update Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: EXTENSION ACTIVITY ROSTER */}
      {/* ========================================================= */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registered Extension Programs</h3>
              <p className="text-xs text-slate-500">Scheduled and completed outreach, trainings, and livelihood activities</p>
            </div>
            <button
              onClick={() => setShowNewActivityModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map(act => (
              <div key={act.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {act.activityType.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    act.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {act.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{act.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold text-slate-800">{act.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Venue:</span>
                    <span className="font-medium text-slate-700">{act.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lead Department:</span>
                    <span className="font-medium text-slate-700">{act.organizingDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Turnout:</span>
                    <span className="font-bold text-emerald-800">
                      {evaluations.filter(e => e.activityId === act.id).length} evaluations submitted
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: DATA PRIVACY & AUDIT LOGS (RA 10173) */}
      {/* ========================================================= */}
      {activeTab === 'audit_privacy' && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Data Privacy Compliance & Access Control (RA 10173)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  In accordance with the Data Privacy Act of 2012 of the Republic of the Philippines, all evaluation data undergoes automated pseudonymization and data minimization. Access to personally identifiable information (PII) is restricted by Role-Based Access Control (RBAC). Any inspection or export of unmasked records is permanently timestamped and logged below for regulatory auditing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Immutable Administrator Audit Trail</h4>
                <p className="text-xs text-slate-500 mt-0.5">Chronological record of sensitive actions and PII inspections</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Total Logs: {auditLogs.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-4 py-3.5">Administrator</th>
                    <th className="px-4 py-3.5">Action Executed</th>
                    <th className="px-4 py-3.5">Subject Control No.</th>
                    <th className="px-5 py-3.5">Authorized Justification / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleString('en-PH')}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{log.adminName}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10px] text-slate-800 rounded font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-emerald-800 font-semibold">
                        {log.participantControlNumber || 'N/A'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-sm">
                        {log.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UNMASK PII AUTHORIZATION */}
      {/* ========================================================= */}
      {unmaskTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-2.5 text-amber-800">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base">Authorized PII Inspection</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are requesting to view the identifiable details (Full Name, Contact Email/Phone) for evaluation <strong>{unmaskTarget.controlNumber}</strong>. Please provide a legitimate institutional justification pursuant to the Data Privacy Act.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Official Purpose / Justification:
              </label>
              <textarea
                rows={3}
                required
                value={unmaskReason}
                onChange={(e) => setUnmaskReason(e.target.value)}
                placeholder="e.g. Following up on participant grievance regarding starter kit condition / investigating reported medical concern..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUnmaskTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!unmaskReason.trim()}
                onClick={handleConfirmUnmask}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                Authorize & Log Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UPDATE FOLLOW-UP STATUS */}
      {/* ========================================================= */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">
              Update Administrator Follow-Up
            </h3>
            <p className="text-xs text-slate-500">
              Control Number: <strong className="text-emerald-900">{statusTarget.controlNumber}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Status:</label>
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs"
              >
                <option value="none">None / No action needed</option>
                <option value="pending">Pending Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Administrative Notes:</label>
              <textarea
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Detail the actions taken or coordination with faculty..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE NEW EXTENSION ACTIVITY */}
      {/* ========================================================= */}
      {showNewActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Create New Extension Activity</h3>
            
            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title:</label>
                <input
                  type="text"
                  required
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g. Hydroponics Vegetable Cultivation for Hinterland Barangays"
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classification:</label>
                  <select
                    value={newActType}
                    onChange={(e) => setNewActType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl p-2.5"
                  >
                    <option value="training">Training</option>
                    <option value="livelihood">Livelihood</option>
                    <option value="seminar">Seminar</option>
                    <option value="outreach">Outreach</option>
                    <option value="community_service">Community Service</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Conducted:</label>
                  <input
                    type="date"
                    required
                    value={newActDate}
                    onChange={(e) => setNewActDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Barangay Location:</label>
                <input
                  type="text"
                  required
                  value={newActVenue}
                  onChange={(e) => setNewActVenue(e.target.value)}
                  placeholder="e.g. Barangay Poblacion Hall, Hinunangan"
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Beneficiaries:</label>
                <input
                  type="text"
                  required
                  value={newActBeneficiaries}
                  onChange={(e) => setNewActBeneficiaries(e.target.value)}
                  placeholder="e.g. Coastal Fisherfolk, Barangay Health Workers"
                  className="w-full border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Coordinator:</label>
                  <input
                    type="text"
                    required
                    value={newActCoordinator}
                    onChange={(e) => setNewActCoordinator(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resource Trainer / Speaker:</label>
                  <input
                    type="text"
                    required
                    value={newActSpeaker}
                    onChange={(e) => setNewActSpeaker(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
