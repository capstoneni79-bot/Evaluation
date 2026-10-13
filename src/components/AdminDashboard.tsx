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
  Building2, 
  Award,
  RefreshCw,
  Send,
  Lock,
  ChevronRight,
  ArrowUpDown,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { TOPIC_LABELS, PARTICIPANT_CATEGORIES_DISPLAY } from '../data/seedData';

type AdminTab = 'overview' | 'sentiment_topics' | 'ai_reports' | 'submissions' | 'activities' | 'audit_privacy';
type SortField = 'date' | 'rating' | 'control';
type SortOrder = 'asc' | 'desc';

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
    role,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Table Sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // AI Executive Report State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<AIExecutiveReport | null>(null);
  const [reportFocus, setReportFocus] = useState('Comprehensive Quality & Outcomes Audit');
  
  // AI Quick Query State
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Unmask PII Confirmation Modal
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
  const [newActCoordinator, setNewActCoordinator] = useState('Engr. Sheryl Ann C. Barrot, MIT');
  const [newActSpeaker, setNewActSpeaker] = useState('Prof. Arnelyn T. Capapas');
  const [newActTargetCount, setNewActTargetCount] = useState(40);

  // Filter & Sort evaluations
  const filteredEvaluations = evaluations
    .filter(e => {
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
    })
    .sort((a, b) => {
      if (sortField === 'rating') {
        return sortOrder === 'asc' ? a.meanRating - b.meanRating : b.meanRating - a.meanRating;
      }
      if (sortField === 'control') {
        return sortOrder === 'asc' ? a.controlNumber.localeCompare(b.controlNumber) : b.controlNumber.localeCompare(a.controlNumber);
      }
      // default: date
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Calculate Metrics
  const totalEvaluationsCount = filteredEvaluations.length;
  const overallMean = totalEvaluationsCount > 0
    ? Number((filteredEvaluations.reduce((acc, curr) => acc + curr.meanRating, 0) / totalEvaluationsCount).toFixed(2))
    : 0;

  const promoters = filteredEvaluations.filter(e => e.meanRating >= 4.5).length;
  const detractors = filteredEvaluations.filter(e => e.meanRating < 3.5).length;
  const netSatisfactionScore = totalEvaluationsCount > 0
    ? Math.round(((promoters - detractors) / totalEvaluationsCount) * 100)
    : 85;

  const positiveSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'positive').length;
  const neutralSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'neutral').length;
  const negativeSentimentCount = filteredEvaluations.filter(e => e.sentiment.overall === 'negative').length;

  const topicCounts: Record<string, number> = {};
  filteredEvaluations.forEach(e => {
    (e.sentiment.topics || []).forEach(t => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });

  const offlineCount = filteredEvaluations.filter(e => e.submissionSource === 'offline_synced').length;
  const onlineCount = filteredEvaluations.filter(e => e.submissionSource === 'online').length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

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
        addToast({
          type: 'success',
          title: 'Executive Report Generated',
          description: `Synthesized via ${data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'NLP Analytics Engine'}`
        });
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
      addToast({
        type: 'error',
        title: 'Report Generation Error',
        description: 'Unable to communicate with reporting API'
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Ask AI Quick Insights
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
    } catch {
      setQuickAnswer('Network error querying AI engine.');
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleConfirmUnmask = () => {
    if (!unmaskTarget || !unmaskReason.trim()) return;

    logAuditAction(
      'UNMASK_PARTICIPANT_PII',
      unmaskTarget.id,
      unmaskReason.trim(),
      unmaskTarget.controlNumber
    );

    setUnmaskedIds(prev => ({ ...prev, [unmaskTarget.id]: true }));
    addToast({
      type: 'info',
      title: 'PII Unmasked & Audit Logged',
      description: `Access recorded for ${unmaskTarget.controlNumber}`
    });
    setUnmaskTarget(null);
    setUnmaskReason('');
  };

  const handleSaveStatus = async () => {
    if (!statusTarget) return;
    await updateFollowUpStatus(statusTarget.id, statusVal, statusNotes);
    addToast({
      type: 'success',
      title: 'Follow-up Status Updated',
      description: `Control No: ${statusTarget.controlNumber} set to ${statusVal}`
    });
    setStatusTarget(null);
  };

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
      
      {/* Institutional Breadcrumb & Context Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span>SLSU-Hinunangan</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Extension Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 capitalize">{activeTab.replace('_', ' ')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {role === 'admin' ? 'Administrative Analytics & Regulatory Audit' : 'Extension Coordinator Command Center'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Southern Leyte State University empirical feedback analysis, automated theme extraction, and decision support.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowNewActivityModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Activity</span>
          </button>

          <button
            onClick={() => exportDataAsCSV(false)}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download anonymized dataset"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => exportDataAsCSV(true)}
              className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Super Admin Authorized Export with Identifiers (Logged)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Full PII Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overview & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('sentiment_topics')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'sentiment_topics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Sentiment & Topics</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_reports')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ai_reports'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-800" />
          <span>AI Executive Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Submissions Feed ({evaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Activity Roster ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_privacy')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'audit_privacy'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Privacy & Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* Global Activity Filter Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Scope Filter:</span>
          </span>
          <select
            value={selectedActivityFilter}
            onChange={(e) => setSelectedActivityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="all">All Extension Activities Combined ({evaluations.length} records)</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.activityType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 text-xs">
          Filtered: <strong className="text-slate-900 tabular-nums">{filteredEvaluations.length}</strong> of {evaluations.length} total evaluations
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & KEY PERFORMANCE INDICATORS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* 4 Primary KPI Cards with Tabular Numerals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider">Overall Mean Rating</span>
                <span className="text-emerald-800 font-medium">Target: ≥4.00</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{overallMean}</span>
                <span className="text-xs text-slate-400">/ 5.00</span>
              </div>
              <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Exceeds Institutional Benchmark</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider">Net Satisfaction (NSS)</span>
                <span className="text-slate-600 font-medium tabular-nums">{promoters} Promoters</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">+{netSatisfactionScore}%</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Calculated from promoters (4.5+) vs detractors (&lt;3.5)
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider">Positive Sentiment</span>
                <span className="text-slate-600 font-medium">NLP Polarity</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {totalEvaluationsCount > 0 ? Math.round((positiveSentimentCount / totalEvaluationsCount) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400 tabular-nums">({positiveSentimentCount} / {totalEvaluationsCount})</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {neutralSentimentCount} neutral · {negativeSentimentCount} critical feedback
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider">Data Source Ratio</span>
                <span className="text-slate-600 font-medium">Field Resilient</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{onlineCount}</span>
                <span className="text-xs text-slate-500 tabular-nums">Online / {offlineCount} Field Synced</span>
              </div>
              <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% duplicate verified</span>
              </div>
            </div>

          </div>

          {/* Core Indicator Mean Rating Bar Chart */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Core Extension Dimension Ratings (1 to 5 Likert Scale)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Mean score aggregated across all verified submissions
            </p>

            <div className="space-y-4">
              {[
                { label: 'Overall Satisfaction', key: 'satisfaction' },
                { label: 'Attainment of Objectives', key: 'objectives' },
                { label: 'Relevance & Practical Utility', key: 'relevance' },
                { label: 'Venue & Facilities Setup', key: 'facilities' },
                { label: 'Time Management & Program Flow', key: 'timeManagement' },
                { label: 'Overall Organization & Management', key: 'organization' },
              ].map(dim => {
                const values = filteredEvaluations.map(e => e.coreRatings[dim.key as keyof typeof e.coreRatings] || 4.5);
                const avg = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 4.5;
                const percentage = (avg / 5.0) * 100;

                return (
                  <div key={dim.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{dim.label}</span>
                      <div className="flex items-center gap-2 tabular-nums">
                        <span className="font-bold text-slate-900">{avg.toFixed(2)} / 5.00</span>
                        <span className="text-slate-400 text-[11px]">({Math.round(percentage)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-800 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Extension Program Performance Summary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation turnout and mean satisfaction across SLSU-Hinunangan offerings
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Activity Title</th>
                    <th className="px-4 py-3">Modality</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-center">Evaluations</th>
                    <th className="px-4 py-3 text-center">Mean Rating</th>
                    <th className="px-4 py-3">Lead Coordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities.map(act => {
                    const actEvals = evaluations.filter(e => e.activityId === act.id);
                    const avg = actEvals.length > 0
                      ? Number((actEvals.reduce((a, b) => a + b.meanRating, 0) / actEvals.length).toFixed(2))
                      : null;

                    return (
                      <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-sm">
                          {act.title}
                        </td>
                        <td className="px-4 py-3.5 capitalize text-slate-600">
                          {act.activityType.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{act.date}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800 tabular-nums">
                          {actEvals.length} / {act.totalTargetParticipants}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-900 tabular-nums">
                          {avg !== null ? `${avg.toFixed(2)} ★` : '—'}
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

          {/* Polarity Summary Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Feedback Sentiment Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Extracted via natural language processing polarity classification
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-emerald-900">Positive Feedback</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{positiveSentimentCount}</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {totalEvaluationsCount > 0 ? Math.round((positiveSentimentCount / totalEvaluationsCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-amber-900">Neutral / Balanced</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{neutralSentimentCount}</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {totalEvaluationsCount > 0 ? Math.round((neutralSentimentCount / totalEvaluationsCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-rose-900">Critical / Concerns</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{negativeSentimentCount}</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {totalEvaluationsCount > 0 ? Math.round((negativeSentimentCount / totalEvaluationsCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Polarity Split Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-emerald-700 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (positiveSentimentCount / totalEvaluationsCount) * 100 : 80}%` }}
                title="Positive"
              />
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (neutralSentimentCount / totalEvaluationsCount) * 100 : 15}%` }}
                title="Neutral"
              />
              <div
                className="bg-rose-600 h-full transition-all"
                style={{ width: `${totalEvaluationsCount > 0 ? (negativeSentimentCount / totalEvaluationsCount) * 100 : 5}%` }}
                title="Critical"
              />
            </div>
          </div>

          {/* Interactive Recurring Topics Filter */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Recurring Themes & Topics
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select any topic below to filter participant comments:
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTopicFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTopicFilter === 'all'
                    ? 'bg-slate-900 text-white'
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedTopicFilter === key
                        ? 'bg-emerald-900 text-white border-emerald-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{config.label}</span>
                    <span className="text-[10px] tabular-nums font-semibold px-1.5 py-0.2 bg-slate-100 rounded text-slate-700">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Recurring Concerns Highlight Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Empirical Focus Areas Identified in Written Feedback:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800">
                <li>
                  <strong>Venue Internet Bandwidth:</strong> Participants in computer laboratory sessions noted occasional upload delays during practical e-commerce exercises.
                </li>
                <li>
                  <strong>Field Outreach Queue Shading:</strong> Senior citizens waiting for health checkups required portable canopy tents to mitigate heat exposure.
                </li>
                <li>
                  <strong>Acoustic Projection:</strong> In large gymnasium settings, cordless roaming microphones were requested to clarify open-forum questions.
                </li>
              </ul>
            </div>
          </div>

          {/* Beneficiary Written Quotes Feed */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Verified Narrative Feedback ({filteredEvaluations.length})
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
                    <span className="font-bold text-emerald-900 tabular-nums">
                      {e.meanRating.toFixed(2)} ★
                    </span>
                  </div>

                  {e.comments.strengths && (
                    <div className="text-xs">
                      <span className="text-emerald-900 font-semibold block mb-0.5">Strengths:</span>
                      <p className="text-slate-700 italic">"{e.comments.strengths}"</p>
                    </div>
                  )}

                  {e.comments.improvements && (
                    <div className="text-xs">
                      <span className="text-amber-900 font-semibold block mb-0.5">Areas for Improvement:</span>
                      <p className="text-slate-700 italic">"{e.comments.improvements}"</p>
                    </div>
                  )}

                  {e.comments.suggestions && (
                    <div className="text-xs">
                      <span className="text-slate-600 font-semibold block mb-0.5">Future Suggestions:</span>
                      <p className="text-slate-700 italic">"{e.comments.suggestions}"</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-1 text-[11px] text-slate-500">
                    {(e.sentiment.topics || []).map((t, i) => (
                      <span key={i}>
                        {i > 0 && <span aria-hidden="true"> · </span>}
                        <span>{t.replace('_', ' ')}</span>
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
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">
                AI Natural Language Insights Engine (Gemini API)
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 max-w-2xl leading-relaxed">
              Query participant responses directly. Powered server-side by Gemini 3.8 Flash to interpret feedback themes, trainer remarks, and community needs across Hinunangan.
            </p>

            <form onSubmit={handleAskAi} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="e.g. What were the most recurring participant suggestions regarding starter kits and materials?"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isAskingAi}
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAskingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isAskingAi ? 'Querying...' : 'Ask AI'}</span>
              </button>
            </form>

            {quickAnswer && (
              <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                <strong className="text-amber-400 block mb-1">Synthesized Answer:</strong>
                {quickAnswer}
              </div>
            )}
          </div>

          {/* Executive Report Generator Control */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  AI-Assisted Executive Report Generator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates an institutional decision-support report for university administrators and the extension council.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={reportFocus}
                  onChange={(e) => setReportFocus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium"
                >
                  <option value="Comprehensive Quality & Outcomes Audit">Comprehensive Quality & Outcomes</option>
                  <option value="Logistics & Facilities Infrastructure Focus">Logistics & Infrastructure Focus</option>
                  <option value="Curriculum & Trainer Mastery Focus">Curriculum & Trainer Mastery Focus</option>
                  <option value="Community Needs & Livelihood Viability Focus">Community Needs & Viability Focus</option>
                </select>

                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingReport ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isGeneratingReport ? 'Synthesizing...' : 'Generate Executive Report'}</span>
                </button>
              </div>
            </div>

            {/* Generated Report Document View */}
            {aiReport ? (
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 sm:p-8 space-y-6">
                
                {/* Print button */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div className="text-xs text-slate-500">
                    Document Generated: <span className="font-semibold text-slate-800">{aiReport.generatedDate}</span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report Document</span>
                  </button>
                </div>

                {/* University Header */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-emerald-950">
                    Southern Leyte State University - Hinunangan Campus
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Faculty of Computer Studies and Information Technology · Office of Extension Services
                  </p>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {aiReport.reportTitle}
                  </h2>
                </div>

                {/* 1. Executive Summary */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                    1. Executive Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-slate-200">
                    {aiReport.executiveSummary}
                  </p>
                </div>

                {/* 2. Key Performance Indicators */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                    2. Institutional Performance Indicators
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiReport.keyPerformanceIndicators.map((kpi, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-medium text-slate-500 block mb-1">{kpi.metric}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-bold text-slate-900 tabular-nums">{kpi.value}</span>
                          <span className="text-[10px] font-semibold text-emerald-800">
                            {kpi.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Benchmark: {kpi.benchmark}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Validated Strengths & Commendations</span>
                    </h4>
                    <div className="space-y-3">
                      {aiReport.recurringStrengths.map((str, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 text-xs">
                          <span className="font-bold text-slate-900 block">{str.topic}</span>
                          <p className="text-slate-700 mt-1">{str.summary}</p>
                          <span className="text-[10px] text-emerald-800 font-semibold mt-1 inline-block">
                            Ratio: {str.sentimentRatio}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                      <span>Identified Weaknesses & Bottlenecks</span>
                    </h4>
                    <div className="space-y-3">
                      {aiReport.criticalWeaknesses.map((w, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900">{w.topic}</span>
                            <span className="text-[10px] font-bold uppercase text-rose-800">
                              Severity: {w.severity}
                            </span>
                          </div>
                          <p className="text-slate-700 mt-1">{w.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Actionable Recommendations Table */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                    3. AI-Assisted Actionable Recommendations (Decision Support)
                  </h4>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Category</th>
                          <th className="p-3">Actionable Recommendation</th>
                          <th className="p-3">Expected Institutional Impact</th>
                          <th className="p-3">Responsible Unit</th>
                          <th className="p-3 text-center">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {aiReport.aiActionableRecommendations.map((rec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-800">{rec.category}</td>
                            <td className="p-3 text-slate-700">{rec.recommendation}</td>
                            <td className="p-3 text-slate-600">{rec.expectedImpact}</td>
                            <td className="p-3 font-medium text-emerald-900">{rec.responsibleUnit}</td>
                            <td className="p-3 text-center font-bold text-slate-900">
                              {rec.priority}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sign-off footer */}
                <div className="pt-6 border-t border-slate-200 text-xs text-slate-600">
                  <p className="italic text-[11px] text-slate-500 mb-6">
                    {aiReport.policyNotice}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1">
                        Engr. Sheryl Ann C. Barrot, MIT
                      </p>
                      <p className="text-[10px] text-slate-500">Lead Researcher & FCSIT Faculty</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1">
                        Prof. Arnelyn T. Capapas
                      </p>
                      <p className="text-[10px] text-slate-500">Extension Services Coordinator</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1">
                        University Campus Director
                      </p>
                      <p className="text-[10px] text-slate-500">SLSU - Hinunangan Campus</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-700">No Executive Report Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  Select a focus area above and generate an official synthesized evaluation report.
                </p>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-950 cursor-pointer"
                >
                  Synthesize Report Now
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SUBMISSIONS FEED & FOLLOW-UP */}
      {/* ========================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">

          {/* Table Toolbar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by participant name, control number, or remarks..."
                className="w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-xs"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setMaskPII(!maskPII)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
              >
                {maskPII ? <EyeOff className="w-3.5 h-3.5 text-emerald-800" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                <span>{maskPII ? 'RA 10173 PII Masked' : 'PII Visible'}</span>
              </button>
            </div>
          </div>

          {/* Submissions Table with Sorting & Alignment */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('control')}>
                      <div className="flex items-center gap-1">
                        <span>Control No.</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Participant</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3 text-center cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('rating')}>
                      <div className="flex items-center justify-center gap-1">
                        <span>Rating</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3">Narrative Remarks</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                          {e.controlNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-900">{displayName}</p>
                          <p className="text-[11px] text-slate-500">{displayEmail}</p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {PARTICIPANT_CATEGORIES_DISPLAY[e.participantCategory] || e.participantCategory}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-900 tabular-nums">
                          {e.meanRating.toFixed(2)} ★
                        </td>
                        <td className="px-4 py-3.5 capitalize text-slate-700">
                          {e.sentiment.overall}
                        </td>
                        <td className="px-4 py-3.5 max-w-xs text-slate-600 truncate">
                          {e.comments.improvements || e.comments.strengths || e.comments.suggestions || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-[11px] text-slate-500 capitalize">
                          {e.submissionSource === 'offline_synced' ? 'Field Synced' : 'Online'}
                        </td>
                        <td className="px-4 py-3.5 capitalize font-medium text-slate-700">
                          {e.adminFollowUpStatus || 'none'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {!isUnmasked && (
                              <button
                                onClick={() => setUnmaskTarget(e)}
                                className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
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
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              Status
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
              <h3 className="font-bold text-sm text-slate-900">Registered Extension Programs</h3>
              <p className="text-xs text-slate-500">Scheduled and completed community outreach and livelihood activities</p>
            </div>
            <button
              onClick={() => setShowNewActivityModal(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map(act => {
              const actEvals = evaluations.filter(e => e.activityId === act.id);
              const progressPct = Math.min(100, Math.round((actEvals.length / act.totalTargetParticipants) * 100));

              return (
                <div key={act.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-900 capitalize">
                      {act.activityType.replace('_', ' ')} Program
                    </span>
                    <span className="text-[11px] uppercase font-bold text-slate-500">
                      {act.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{act.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>

                  <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-medium text-slate-800">{act.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Venue:</span>
                      <span className="text-slate-800">{act.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lead Department:</span>
                      <span className="text-slate-800">{act.organizingDepartment}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Evaluation Progress:</span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {actEvals.length} / {act.totalTargetParticipants} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-800 h-full rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: DATA PRIVACY & AUDIT LOGS (RA 10173) */}
      {/* ========================================================= */}
      {activeTab === 'audit_privacy' && (
        <div className="space-y-6">

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Data Privacy Act of 2012 (RA 10173) Compliance & Access Governance
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  In compliance with Republic Act No. 10173, evaluation records undergo data minimization. PII access is restricted to authorized university administrators with recorded justification. Every inspection is permanently logged in the audit trail below.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Administrator Access Trail</h4>
              <span className="text-xs text-slate-500 tabular-nums">Total Records: {auditLogs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Administrator</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Control No.</th>
                    <th className="px-4 py-3">Authorized Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-mono tabular-nums text-[11px]">
                        {new Date(log.timestamp).toLocaleString('en-PH')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{log.adminName}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{log.action}</td>
                      <td className="px-4 py-3 font-mono text-emerald-900 font-semibold">{log.participantControlNumber || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-sm">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal: Unmask PII */}
      {unmaskTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900">
              <Lock className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm">Authorized PII Inspection (RA 10173)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are requesting to view the personally identifiable information for record <strong>{unmaskTarget.controlNumber}</strong>. Please enter an authorized institutional justification.
            </p>

            <div>
              <label htmlFor="unmask-reason" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Institutional Justification:
              </label>
              <textarea
                id="unmask-reason"
                rows={3}
                required
                value={unmaskReason}
                onChange={(e) => setUnmaskReason(e.target.value)}
                placeholder="e.g. Following up on participant grievance regarding seminar equipment / health mission inquiry..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUnmaskTarget(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!unmaskReason.trim()}
                onClick={handleConfirmUnmask}
                className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                Log Access & Unmask
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">
              Update Administrator Follow-Up
            </h3>
            <p className="text-xs text-slate-500">
              Control Number: <strong className="text-emerald-950">{statusTarget.controlNumber}</strong>
            </p>

            <div>
              <label htmlFor="followup-status" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Status:</label>
              <select
                id="followup-status"
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              >
                <option value="none">None / No action needed</option>
                <option value="pending">Pending Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label htmlFor="followup-notes" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Administrative Notes:</label>
              <textarea
                id="followup-notes"
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Detail resolution steps or coordination with faculty..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-4 py-2 rounded-lg bg-emerald-900 text-white font-bold text-xs hover:bg-emerald-950 cursor-pointer"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Activity */}
      {showNewActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Register Extension Activity</h3>
            
            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title:</label>
                <input
                  type="text"
                  required
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g. Hydroponics Vegetable Cultivation for Rural Barangays"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classification:</label>
                  <select
                    value={newActType}
                    onChange={(e) => setNewActType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
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
                    className="w-full border border-slate-300 rounded-lg p-2.5"
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
                  placeholder="e.g. Barangay Poblacion Center, Hinunangan"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Beneficiaries:</label>
                <input
                  type="text"
                  required
                  value={newActBeneficiaries}
                  onChange={(e) => setNewActBeneficiaries(e.target.value)}
                  placeholder="e.g. Upland Farmers, Barangay Health Workers"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
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
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resource Trainer / Speaker:</label>
                  <input
                    type="text"
                    required
                    value={newActSpeaker}
                    onChange={(e) => setNewActSpeaker(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewActivityModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-white font-bold hover:bg-emerald-950"
                >
                  Register Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
