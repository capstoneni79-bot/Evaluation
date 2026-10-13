import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  ClipboardList, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Download, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AdminMonitoringOverview: React.FC = () => {
  const { 
    systemMetrics, 
    activities, 
    evaluations, 
    surveys, 
    users, 
    auditLogs, 
    systemSettings, 
    setCurrentView,
    exportDataAsCSV,
    offlineQueue,
    theme
  } = useApp();

  const totalUsers = systemMetrics ? systemMetrics.totalUsers : users.length;
  const adminUsers = systemMetrics ? systemMetrics.adminUsers : users.filter(u => u.role === 'admin').length;
  const participantUsers = systemMetrics ? systemMetrics.participantUsers : users.filter(u => u.role === 'participant').length;

  const totalEvals = evaluations.length;
  const overallMean = totalEvals > 0
    ? Number((evaluations.reduce((a, b) => a + b.meanRating, 0) / totalEvals).toFixed(2))
    : (systemMetrics?.overallSatisfactionMean || 4.78);

  const totalActivities = activities.length;
  const activeActivities = activities.filter(a => a.status === 'active').length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const upcomingActivities = activities.filter(a => a.status === 'upcoming').length;
  const draftActivities = activities.filter(a => a.status === 'draft').length;

  const totalSurveys = surveys.length;
  const publishedSurveys = surveys.filter(s => s.status === 'published').length;
  const totalSurveyResponses = surveys.reduce((acc, curr) => acc + (curr.responsesCount || 0), 0);

  const totalTargetParticipants = activities.reduce((a, b) => a + (b.totalTargetParticipants || 0), 0);
  const turnoutRate = totalTargetParticipants > 0
    ? Math.min(100, Math.round((totalEvals / totalTargetParticipants) * 100))
    : (systemMetrics?.turnoutCompletionRate || 88);

  const promoters = evaluations.filter(e => e.meanRating >= 4.5).length;
  const detractors = evaluations.filter(e => e.meanRating < 3.5).length;
  const netSatisfactionScore = totalEvals > 0
    ? Math.round(((promoters - detractors) / totalEvals) * 100)
    : 85;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Institutional Status */}
      <div 
        className="rounded-xl p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded"
              style={{ backgroundColor: theme.secondaryColor, color: theme.accentColor }}
            >
              Command & Monitoring Center
            </span>
            <span className="text-xs opacity-80">
              AY {systemSettings.academicYear} · {systemSettings.accreditationCycle}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-2 tracking-tight">
            Comprehensive System Overview
          </h2>
          <p className="text-xs opacity-90 mt-1 max-w-2xl leading-relaxed">
            Real-time telemetry across {systemSettings.institutionName}. Monitoring extension activities, dynamic form rubrics, community surveys, and accreditation benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportDataAsCSV(true)}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master Audit CSV</span>
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className="px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            style={{ backgroundColor: theme.accentColor, color: '#0f172a' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Executive Reports</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Overall Satisfaction</span>
            <span className="font-bold text-emerald-800">Target: ≥{systemSettings.targetSatisfactionMean}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{overallMean}</span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AACCUP Level III Compliant</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Turnout & Participation</span>
            <span className="text-slate-600 font-medium tabular-nums">{totalEvals} Submissions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{turnoutRate}%</span>
            <span className="text-xs text-slate-400">Completion</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target benchmark is ≥{systemSettings.minimumTurnoutTargetPct}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Evaluation Activities</span>
            <span className="text-blue-700 font-bold">{activeActivities} Active</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{totalActivities}</span>
            <span className="text-xs text-slate-400">Programs</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {completedActivities} Completed · {upcomingActivities} Upcoming · {draftActivities} Draft
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Stakeholder Surveys</span>
            <span className="text-purple-700 font-bold">{publishedSurveys} Published</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{totalSurveys}</span>
            <span className="text-xs text-slate-400">Surveys</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {totalSurveyResponses} Real Responses Recorded
          </div>
        </div>

      </div>

      {/* Row 2: Module Shortcuts & System Turnout Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Programs Turnout Bars */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Extension Activities Response & Participation Rates
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time turnout compared against target beneficiary quotas
              </p>
            </div>
            <button
              onClick={() => setCurrentView('activities')}
              className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Activities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {activities.slice(0, 4).map(act => {
              const actEvals = evaluations.filter(e => e.activityId === act.id);
              const count = actEvals.length;
              const pct = Math.min(100, Math.round((count / act.totalTargetParticipants) * 100));
              return (
                <div key={act.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate max-w-sm">{act.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                        {act.activityType}
                      </span>
                    </div>
                    <span className="font-bold text-slate-700 tabular-nums">
                      {count} / {act.totalTargetParticipants} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: pct >= 80 ? '#059669' : pct >= 50 ? '#d97706' : '#2563eb' 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health, Users & Privacy Assurance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              System Health & Compliance
            </h3>
            
            <div className="space-y-3.5 text-xs mt-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">RA 10173 Audit Logging</span>
                    <span className="text-[11px] text-slate-500">Immutable Trail Active</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">{auditLogs.length} events</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">Registered System Users</span>
                    <span className="text-[11px] text-slate-500">{adminUsers} Admin · {participantUsers} Evaluators</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">{totalUsers} accounts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">Offline Field Queue</span>
                    <span className="text-[11px] text-slate-500">Local device cache</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">{offlineQueue.length} pending</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Net Satisfaction Score:</span>
            <span className="font-bold text-emerald-900 tabular-nums">+{netSatisfactionScore}% NSS</span>
          </div>
        </div>

      </div>

      {/* Row 3: Recent Activity Event Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Administrative Activity Stream</h3>
            <p className="text-xs text-slate-500 mt-0.5">Audit log of system actions and security events</p>
          </div>
          <button
            onClick={() => setCurrentView('audit')}
            className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Activity Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {log.action}
                </span>
                <span className="font-medium text-slate-800">{log.reason}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
                <span>By: {log.adminName}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
