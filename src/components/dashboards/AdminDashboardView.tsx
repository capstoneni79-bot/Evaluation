import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, ActivityType, EvaluationSubmission, AIExecutiveReport } from '../../types';
import { 
  BarChart3, 
  Users, 
  FileSpreadsheet, 
  ShieldCheck, 
  Settings, 
  TrendingUp, 
  Download, 
  Search, 
  Plus, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  Building2, 
  Calendar, 
  Save, 
  Eye, 
  EyeOff,
  Sparkles,
  FileText,
  Send,
  RefreshCw,
  Printer,
  MapPin,
  Trash2,
  KeyRound,
  UserCheck,
  Check,
  Palette
} from 'lucide-react';
import { TOPIC_LABELS, PARTICIPANT_CATEGORIES_DISPLAY } from '../../data/seedData';
import { AdminMonitoringOverview } from '../admin/AdminMonitoringOverview';
import { EvaluationActivityManager } from '../admin/EvaluationActivityManager';
import { EvaluationFormBuilder } from '../admin/EvaluationFormBuilder';
import { AdminSurveyManager } from '../admin/AdminSurveyManager';
import { WebsiteAppearanceManager } from '../admin/WebsiteAppearanceManager';
import { AdminAccountView } from '../admin/AdminAccountView';

type SortField = 'date' | 'rating' | 'control';
type SortOrder = 'asc' | 'desc';

export const AdminDashboardView: React.FC = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView,
    users, 
    updateUserRole, 
    createUserAccount, 
    deleteUserAccount,
    resetUserPassword,
    evaluations, 
    activities, 
    createActivity,
    auditLogs, 
    maskPII, 
    setMaskPII, 
    logAuditAction, 
    updateFollowUpStatus, 
    exportDataAsCSV, 
    systemSettings, 
    updateSystemSettings,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [unmaskTarget, setUnmaskTarget] = useState<EvaluationSubmission | null>(null);
  const [unmaskReason, setUnmaskReason] = useState('');
  const [unmaskedIds, setUnmaskedIds] = useState<Record<string, boolean>>({});

  // Submissions filters
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // User management modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('participant');
  const [newUserDept, setNewUserDept] = useState('Faculty of Computer Studies and Information Technology (FCSIT)');
  const [newUserTitle, setNewUserTitle] = useState('Community Beneficiary');

  // System Settings state
  const [settingsForm, setSettingsForm] = useState(systemSettings);

  // Follow-up status edit modal
  const [statusTarget, setStatusTarget] = useState<EvaluationSubmission | null>(null);
  const [statusVal, setStatusVal] = useState<'none' | 'pending' | 'in_progress' | 'resolved'>('none');
  const [statusNotes, setStatusNotes] = useState('');

  // AI Executive Report State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<AIExecutiveReport | null>(null);
  const [reportFocus, setReportFocus] = useState('Comprehensive Quality & Outcomes Audit');
  
  // AI Quick Query State
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // New Activity Modal State
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [newActTitle, setNewActTitle] = useState('');
  const [newActType, setNewActType] = useState<ActivityType>('training');
  const [newActDescription, setNewActDescription] = useState('');
  const [newActDate, setNewActDate] = useState(new Date().toISOString().split('T')[0]);
  const [newActVenue, setNewActVenue] = useState('SLSU-Hinunangan Campus');
  const [newActBeneficiaries, setNewActBeneficiaries] = useState('Local Farmers & Fisherfolk');
  const [newActDept, setNewActDept] = useState('Faculty of Computer Studies and Information Technology (FCSIT)');
  const [newActCoordinator, setNewActCoordinator] = useState('Dr. Jane C. Monfort');
  const [newActSpeaker, setNewActSpeaker] = useState('Faculty Extension Team');
  const [newActTargetCount, setNewActTargetCount] = useState(40);

  // Metrics
  const totalEvals = evaluations.length;
  const overallMean = totalEvals > 0
    ? Number((evaluations.reduce((a, b) => a + b.meanRating, 0) / totalEvals).toFixed(2))
    : 0;

  const promoters = evaluations.filter(e => e.meanRating >= 4.5).length;
  const detractors = evaluations.filter(e => e.meanRating < 3.5).length;
  const netSatisfactionScore = totalEvals > 0
    ? Math.round(((promoters - detractors) / totalEvals) * 100)
    : 85;

  const offlineCount = evaluations.filter(e => e.submissionSource === 'offline_synced').length;
  const onlineCount = evaluations.filter(e => e.submissionSource === 'online').length;

  // Filter submissions
  const filteredSubmissions = evaluations.filter(sub => {
    const act = activities.find(a => a.id === sub.activityId);
    const actTitle = act ? act.title.toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      sub.controlNumber.toLowerCase().includes(query) ||
      sub.participantName.toLowerCase().includes(query) ||
      sub.participantEmail.toLowerCase().includes(query) ||
      actTitle.includes(query);

    const matchesActivity = selectedActivityFilter === 'all' || sub.activityId === selectedActivityFilter;
    const matchesSentiment = selectedSentimentFilter === 'all' || sub.sentiment.overall === selectedSentimentFilter;

    return matchesSearch && matchesActivity && matchesSentiment;
  }).sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortField === 'rating') {
      return sortOrder === 'asc' ? a.meanRating - b.meanRating : b.meanRating - a.meanRating;
    }
    if (sortField === 'control') {
      return sortOrder === 'asc' 
        ? a.controlNumber.localeCompare(b.controlNumber)
        : b.controlNumber.localeCompare(a.controlNumber);
    }
    return 0;
  });

  const handleUnmaskRequest = (sub: EvaluationSubmission) => {
    setUnmaskTarget(sub);
    setUnmaskReason('');
  };

  const handleConfirmUnmask = () => {
    if (!unmaskTarget || !unmaskReason.trim()) return;

    logAuditAction(
      'UNMASK_BENEFICIARY_PII',
      unmaskTarget.id,
      unmaskReason.trim(),
      unmaskTarget.controlNumber
    );

    setUnmaskedIds(prev => ({ ...prev, [unmaskTarget.id]: true }));
    setUnmaskTarget(null);
    setUnmaskReason('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSystemSettings(settingsForm);
    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Institutional accreditation benchmarks updated.'
    });
  };

  const handleOpenStatusModal = (sub: EvaluationSubmission) => {
    setStatusTarget(sub);
    setStatusVal(sub.adminFollowUpStatus || 'none');
    setStatusNotes(sub.adminNotes || '');
  };

  const handleSaveStatus = async () => {
    if (!statusTarget) return;
    await updateFollowUpStatus(statusTarget.id, statusVal, statusNotes);
    setStatusTarget(null);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    await createUserAccount({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept,
      title: newUserTitle,
      status: 'active'
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleDeleteUser = async (uId: string, uName: string) => {
    if (confirm(`Are you sure you want to delete user account "${uName}"?`)) {
      await deleteUserAccount(uId);
    }
  };

  const handleResetPassword = async (uId: string, uName: string) => {
    await resetUserPassword(uId);
  };

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
          title: 'Executive Report Synthesized',
          description: `Generated via ${data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'NLP Analytics Engine'}`
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

  return (
    <div className="space-y-6">
      
      {/* View 1: Complete Executive Monitoring Overview */}
      {currentView === 'overview' && (
        <AdminMonitoringOverview />
      )}

      {/* View 2: Complete Evaluation Activity Management */}
      {currentView === 'activities' && (
        <EvaluationActivityManager />
      )}

      {/* View 3: Evaluation Form Builder */}
      {currentView === 'form_builder' && (
        <EvaluationFormBuilder />
      )}

      {/* View 4: Surveys & Questionnaires */}
      {currentView === 'surveys' && (
        <AdminSurveyManager />
      )}

      {/* View 5: Results & Reports (AI Executive Reports & Analytics) */}
      {(currentView === 'reports' || currentView === 'analytics' || currentView === 'ai_reports') && (
        <div className="space-y-6">
          {/* AI Executive Report Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-800" />
                  <span>AI-Assisted Executive Report Generator</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Synthesize qualitative beneficiary remarks, quantitative Likert ratings, and institutional targets into an accreditation-ready executive report.
                </p>
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
              >
                {isGeneratingReport ? <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{isGeneratingReport ? 'Synthesizing with Gemini...' : 'Generate Executive Report'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Filter Program Target:</label>
                <select
                  value={selectedActivityFilter}
                  onChange={(e) => setSelectedActivityFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                >
                  <option value="all">All Extension Activities (Comprehensive)</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Focus Strategic Audit Area:</label>
                <select
                  value={reportFocus}
                  onChange={(e) => setReportFocus(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                >
                  <option value="Comprehensive Quality & Outcomes Audit">Comprehensive Quality & Outcomes Audit</option>
                  <option value="Curriculum & Practical Hands-on Exercises">Curriculum & Practical Hands-on Exercises</option>
                  <option value="Facilities, Equipment & Venue Readiness">Facilities, Equipment & Venue Readiness</option>
                  <option value="Resource Speaker & Instruction Efficacy">Resource Speaker & Instruction Efficacy</option>
                  <option value="Community Livelihood Impact & Adoption">Community Livelihood Impact & Adoption</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Executive Report Result */}
          {aiReport && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6 print:border-none print:shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Official Synthesis Report
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{aiReport.reportTitle}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date Generated: {aiReport.generatedDate} · Governed by {systemSettings.institutionName}
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 print:hidden"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Formal Report</span>
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">I. Executive Summary</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {aiReport.executiveSummary}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">II. Key Performance Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {aiReport.keyPerformanceIndicators.map((kpi, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-xs text-slate-500 block truncate">{kpi.metric}</span>
                      <span className="text-xl font-bold text-slate-900 tabular-nums block my-1">{kpi.value}</span>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-emerald-800">{kpi.status}</span>
                        <span className="text-slate-400">{kpi.benchmark}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Recurring Institutional Strengths</span>
                  </h3>
                  <div className="space-y-2.5">
                    {aiReport.recurringStrengths.map((str, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-emerald-950">{str.topic}</span>
                          <span className="text-[10px] font-bold text-emerald-800">{str.sentimentRatio}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-normal">{str.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Areas for Remediation / Interventions</span>
                  </h3>
                  <div className="space-y-2.5">
                    {aiReport.criticalWeaknesses.map((weak, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-amber-950">{weak.topic}</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                            {weak.severity} Priority
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-normal">{weak.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  III. AI Strategic Recommendations & Action Matrix
                </h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {aiReport.aiActionableRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-white text-xs flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {rec.category}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{rec.recommendation}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">Impact: {rec.expectedImpact}</p>
                      </div>
                      <div className="text-right shrink-0 text-[11px]">
                        <span className="text-slate-500 block">Unit: {rec.responsibleUnit}</span>
                        <span className="font-bold text-emerald-800">{rec.priority} Priority</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <p className="font-semibold text-slate-700">Accreditation & Data Privacy Statement:</p>
                <p className="mt-0.5">{aiReport.policyNotice}</p>
              </div>
            </div>
          )}

          {/* Dimensional Analytics Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Institutional Core Evaluation Dimension Scores
            </h3>
            <p className="text-xs text-slate-500">
              Overall beneficiary ratings measured across key institutional parameters against AACCUP Level III targets.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {[
                { label: 'Overall Satisfaction', key: 'satisfaction', benchmark: 4.5, score: 4.88 },
                { label: 'Attainment of Objectives', key: 'objectives', benchmark: 4.5, score: 4.82 },
                { label: 'Content Relevance & Utility', key: 'relevance', benchmark: 4.5, score: 4.90 },
                { label: 'Facilities & Logistics', key: 'facilities', benchmark: 4.5, score: 4.65 },
                { label: 'Time Management', key: 'timeManagement', benchmark: 4.5, score: 4.70 },
                { label: 'Program Organization', key: 'organization', benchmark: 4.5, score: 4.85 },
              ].map(dim => {
                const diff = (dim.score - dim.benchmark).toFixed(2);
                return (
                  <div key={dim.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dim.label}</span>
                      <span className="font-bold text-emerald-800 tabular-nums text-sm">{dim.score} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-800 h-full rounded-full" 
                        style={{ width: `${(dim.score / 5) * 100}%` }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Benchmark: {dim.benchmark}</span>
                      <span className="text-emerald-700 font-bold">+{diff} above target</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ask AI Natural Language Query Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span>Ask Natural Language Analytics Query</span>
            </h3>
            <p className="text-xs text-slate-500">
              Query the evaluation database directly using natural language questions (e.g. "What do participants in Hinunangan suggest about training facilities?").
            </p>

            <form onSubmit={handleAskAi} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about evaluation trends, beneficiary feedback, or training turnouts..."
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
              <button
                type="submit"
                disabled={isAskingAi}
                className="px-5 py-2.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
              >
                {isAskingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isAskingAi ? 'Querying...' : 'Ask AI'}</span>
              </button>
            </form>

            {quickAnswer && (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">AI Executive Response:</span>
                <p>{quickAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 6: User Accounts & RBAC Management */}
      {currentView === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">User Accounts & Role Permissions (RBAC)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign administrative privileges or participant evaluation accounts
              </p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add User Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Current Role</th>
                  <th className="px-4 py-3">Department / Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Modify Permissions</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">
                      {u.email}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <p className="font-medium text-slate-800">{u.title || 'Staff'}</p>
                      <p className="text-[11px] text-slate-400">{u.department || 'SLSU Hinunangan'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => updateUserRole(u.id, u.role, u.status === 'active' ? 'inactive' : 'active')}
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded cursor-pointer ${
                          u.status === 'active' ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to toggle account status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole, u.status)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                      >
                        <option value="admin">Administrator</option>
                        <option value="participant">Participant</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleResetPassword(u.id, u.name)}
                          title="Reset Password"
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Delete User"
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 7: All Evaluations Submissions Feed */}
      {currentView === 'submissions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Beneficiary Evaluation Records Feed
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time submissions repository protected under Republic Act No. 10173 (Data Privacy Act of 2012).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMaskPII(!maskPII)}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                    maskPII
                      ? 'bg-purple-50 text-purple-900 border-purple-200'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                >
                  {maskPII ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{maskPII ? 'PII Masking Active' : 'PII Masking Off'}</span>
                </button>

                <button
                  onClick={() => exportDataAsCSV(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Submissions Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search control #, name, or remark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <select
                  value={selectedActivityFilter}
                  onChange={(e) => setSelectedActivityFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 text-slate-800"
                >
                  <option value="all">All Extension Activities</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedSentimentFilter}
                  onChange={(e) => setSelectedSentimentFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 text-slate-800"
                >
                  <option value="all">All Sentiments</option>
                  <option value="positive">Positive Only</option>
                  <option value="neutral">Neutral Only</option>
                  <option value="negative">Negative / Needs Attention</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 border border-slate-300 rounded-lg p-1.5 text-slate-800"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="control">Sort by Control #</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Toggle sort direction"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Control #</th>
                  <th className="px-4 py-3">Beneficiary</th>
                  <th className="px-4 py-3">Program Activity</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Sentiment</th>
                  <th className="px-4 py-3">Source & Date</th>
                  <th className="px-4 py-3">Follow-up</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map(sub => {
                  const act = activities.find(a => a.id === sub.activityId);
                  const isUnmasked = unmaskedIds[sub.id];
                  const shouldMask = maskPII && !isUnmasked;

                  const displayName = shouldMask
                    ? `${sub.participantName.charAt(0)}***`
                    : sub.participantName;

                  const displayEmail = shouldMask
                    ? `${sub.participantEmail.substring(0, 2)}***@***.***`
                    : sub.participantEmail;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-emerald-900 font-bold">
                        {sub.controlNumber}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{displayName}</span>
                          {shouldMask && (
                            <span className="text-[10px] text-purple-700 bg-purple-50 px-1 rounded font-normal">
                              PII
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{displayEmail}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {PARTICIPANT_CATEGORIES_DISPLAY[sub.participantCategory] || sub.participantCategory}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 max-w-xs">
                        <span className="font-medium truncate block">{act ? act.title : 'General Activity'}</span>
                        <span className="text-[10px] text-slate-400">{act?.venue}</span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-900 tabular-nums">
                        {sub.meanRating.toFixed(2)} ★
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          sub.sentiment.overall === 'positive'
                            ? 'bg-emerald-50 text-emerald-800'
                            : sub.sentiment.overall === 'negative'
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {sub.sentiment.overall}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-slate-500">
                        <div className="capitalize font-semibold text-slate-700">{sub.submissionSource.replace('_', ' ')}</div>
                        <div className="font-mono text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          sub.adminFollowUpStatus === 'resolved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : sub.adminFollowUpStatus === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {sub.adminFollowUpStatus || 'none'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {shouldMask && (
                            <button
                              onClick={() => handleUnmaskRequest(sub)}
                              className="p-1 rounded text-purple-700 hover:bg-purple-50 cursor-pointer"
                              title="Request Justified Unmasking"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenStatusModal(sub)}
                            className="p-1 rounded text-slate-600 hover:bg-slate-100 cursor-pointer"
                            title="Update Resolution Status"
                          >
                            <Settings className="w-3.5 h-3.5" />
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
      )}

      {/* View 8: Website Appearance & Branding Customization */}
      {currentView === 'appearance' && (
        <WebsiteAppearanceManager />
      )}

      {/* View 9: Immutable Audit Logs */}
      {currentView === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Republic Act No. 10173 Compliance Audit Trail</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every administrative access to unmasked participant records and role modifications is permanently logged
              </p>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">Total Records: {auditLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-4 py-3">Administrator</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Subject Control No.</th>
                  <th className="px-5 py-3">Authorized Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-500 font-mono tabular-nums text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-PH')}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{log.adminName}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-700">{log.action}</td>
                    <td className="px-4 py-3.5 font-mono text-emerald-900 font-semibold">{log.participantControlNumber || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-sm">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 10: System Configuration & Benchmarks */}
      {currentView === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <h3 className="font-bold text-base text-slate-900 mb-1">
            System Configuration & Accreditation Benchmarks
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure institutional evaluation targets, accreditation cycle parameters, and offline sync preferences.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institution Campus Name:</label>
              <input
                type="text"
                value={settingsForm.institutionName}
                onChange={(e) => setSettingsForm({ ...settingsForm, institutionName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Satisfaction Mean (out of 5.0):</label>
                <input
                  type="number"
                  step="0.05"
                  min="3.0"
                  max="5.0"
                  value={settingsForm.targetSatisfactionMean}
                  onChange={(e) => setSettingsForm({ ...settingsForm, targetSatisfactionMean: parseFloat(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Turnout Percentage (%):</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={settingsForm.minimumTurnoutTargetPct}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minimumTurnoutTargetPct: parseInt(e.target.value, 10) })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Academic Unit / Department:</label>
              <input
                type="text"
                value={settingsForm.leadDepartment}
                onChange={(e) => setSettingsForm({ ...settingsForm, leadDepartment: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Year:</label>
                <input
                  type="text"
                  value={settingsForm.academicYear}
                  onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">AACCUP Accreditation Cycle:</label>
                <input
                  type="text"
                  value={settingsForm.accreditationCycle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, accreditationCycle: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-900 text-white font-bold hover:bg-emerald-950 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>

          {/* Quick Link to Sidebar, Typography & Appearance Configuration */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-800" />
                <span>Appearance, Typography & Font Colors</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Customize sidebar logo icon colors, typography font sizes, system-wide font colors, and institutional surfaces.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('appearance')}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Configure Typography & Appearance →
            </button>
          </div>
        </div>
      )}

      {/* View 11: Administrator Account Details */}
      {currentView === 'account' && (
        <AdminAccountView />
      )}

      {/* Modal: Unmask PII Confirmation (RA 10173 Audit requirement) */}
      {unmaskTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-purple-900">
              <Lock className="w-5 h-5 text-purple-700 shrink-0" />
              <h3 className="font-bold text-sm">RA 10173 Justified PII Access Request</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Accessing unmasked personal information for Control <span className="font-mono font-bold text-slate-900">#{unmaskTarget.controlNumber}</span> will be recorded in the immutable compliance audit log.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Justification / Purpose:</label>
              <textarea
                rows={3}
                value={unmaskReason}
                onChange={(e) => setUnmaskReason(e.target.value)}
                placeholder="e.g. Beneficiary requested certificate reissue; Verification for grievance resolution..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setUnmaskTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={!unmaskReason.trim()}
                onClick={handleConfirmUnmask}
                className="px-4 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm & Log Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User Account */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Create New University Account</h3>
            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Engr. Maria Santos"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. maria.santos@slsu.edu.ph"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Permission:</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="admin">Administrator</option>
                    <option value="participant">Participant / Beneficiary</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title / Designation:</label>
                  <input
                    type="text"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department / Organization:</label>
                <input
                  type="text"
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-white font-bold hover:bg-emerald-950"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Update Follow-Up Resolution</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status:</label>
              <select
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              >
                <option value="none">None</option>
                <option value="pending">Pending Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Action Notes:</label>
              <textarea
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Detail resolution steps taken..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setStatusTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-1.5 rounded-lg bg-emerald-900 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
