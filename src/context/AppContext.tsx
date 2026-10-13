import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, EvaluationSubmission, AuditLog, ActivityType } from '../types';
import { INITIAL_ACTIVITIES } from '../data/seedData';

type UserRole = 'participant' | 'coordinator' | 'super_admin';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activities: Activity[];
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  evaluations: EvaluationSubmission[];
  offlineQueue: EvaluationSubmission[];
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  auditLogs: AuditLog[];
  maskPII: boolean;
  setMaskPII: (mask: boolean) => void;
  isLoading: boolean;
  
  // Actions
  submitEvaluation: (evaluationData: Partial<EvaluationSubmission>) => Promise<{ success: boolean; evaluation?: EvaluationSubmission; error?: string }>;
  syncOfflineQueue: () => Promise<{ success: boolean; count: number; error?: string }>;
  createActivity: (activityData: Partial<Activity>) => Promise<Activity>;
  logAuditAction: (action: string, resourceId: string, reason: string, controlNumber?: string) => Promise<void>;
  updateFollowUpStatus: (evalId: string, status: 'none' | 'pending' | 'in_progress' | 'resolved', notes: string) => Promise<void>;
  
  // UI Modal states
  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;
  showSyncModal: boolean;
  setShowSyncModal: (show: boolean) => void;
  lastSubmittedEvaluation: EvaluationSubmission | null;
  setLastSubmittedEvaluation: (evalItem: EvaluationSubmission | null) => void;
  exportDataAsCSV: (includePII?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_QUEUE_KEY = 'slsu_ext_offline_queue_v1';
const LOCAL_STORAGE_EVALS_KEY = 'slsu_ext_evals_cache_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('participant');
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(INITIAL_ACTIVITIES[0].id);
  const [evaluations, setEvaluations] = useState<EvaluationSubmission[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<EvaluationSubmission[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [maskPII, setMaskPII] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal triggers
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [lastSubmittedEvaluation, setLastSubmittedEvaluation] = useState<EvaluationSubmission | null>(null);

  // Load initial data from backend API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch activities
      const actRes = await fetch('/api/activities');
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData);
      }

      // 2. Fetch evaluations
      const evalRes = await fetch('/api/evaluations');
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        setEvaluations(evalData);
        localStorage.setItem(LOCAL_STORAGE_EVALS_KEY, JSON.stringify(evalData));
      }

      // 3. Fetch audit logs
      const logRes = await fetch('/api/audit-logs');
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData);
      }
    } catch (err) {
      console.warn('Network request failed, falling back to local storage cache:', err);
      const cachedEvals = localStorage.getItem(LOCAL_STORAGE_EVALS_KEY);
      if (cachedEvals) {
        try {
          setEvaluations(JSON.parse(cachedEvals));
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  // On mount, load cached queue and refresh from server
  useEffect(() => {
    const savedQueue = localStorage.getItem(LOCAL_STORAGE_QUEUE_KEY);
    if (savedQueue) {
      try {
        setOfflineQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Failed to parse offline queue', e);
      }
    }
    refreshData();
  }, []);

  // Save offline queue whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_QUEUE_KEY, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Submit evaluation (supports online direct or offline local queue)
  const submitEvaluation = async (evaluationData: Partial<EvaluationSubmission>): Promise<{ success: boolean; evaluation?: EvaluationSubmission; error?: string }> => {
    // Check duplicate in current evaluations
    const dup = evaluations.find(
      e => e.activityId === evaluationData.activityId &&
        (e.participantEmail.toLowerCase() === evaluationData.participantEmail?.toLowerCase() ||
         (evaluationData.participantPhone && e.participantPhone === evaluationData.participantPhone))
    );
    if (dup) {
      return {
        success: false,
        error: `Duplicate Submission: You have already submitted an evaluation for this activity under Control No: ${dup.controlNumber}`
      };
    }

    // Check duplicate in offline queue
    const queueDup = offlineQueue.find(
      e => e.activityId === evaluationData.activityId &&
        e.participantEmail.toLowerCase() === evaluationData.participantEmail?.toLowerCase()
    );
    if (queueDup) {
      return {
        success: false,
        error: `Duplicate Submission: An offline evaluation for this email is currently pending synchronization.`
      };
    }

    const controlNumber = evaluationData.controlNumber || `SLSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build the record
    const coreVals = Object.values(evaluationData.coreRatings || {}) as number[];
    const specVals = Object.values(evaluationData.specificRatings || {}) as number[];
    const allRatings = [...coreVals, ...specVals];
    const meanRating = allRatings.length > 0
      ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
      : 4.5;

    const fullEvaluation: EvaluationSubmission = {
      id: `eval-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      activityId: evaluationData.activityId!,
      participantName: evaluationData.participantName!,
      participantEmail: evaluationData.participantEmail!,
      participantPhone: evaluationData.participantPhone || '',
      participantCategory: evaluationData.participantCategory || 'community_member',
      controlNumber,
      verificationMethod: evaluationData.verificationMethod || 'student_id',
      coreRatings: evaluationData.coreRatings as any,
      specificRatings: evaluationData.specificRatings || {},
      meanRating,
      comments: {
        strengths: evaluationData.comments?.strengths || '',
        improvements: evaluationData.comments?.improvements || '',
        suggestions: evaluationData.comments?.suggestions || ''
      },
      sentiment: evaluationData.sentiment || {
        overall: meanRating >= 4 ? 'positive' : meanRating >= 3 ? 'neutral' : 'negative',
        score: (meanRating - 3) / 2,
        topics: ['speaker_mastery', 'facilities'],
        concernUrgency: 'low'
      },
      submissionSource: isOfflineMode ? 'offline_synced' : 'online',
      submittedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop / Laptop',
      verified: true,
      consentAccepted: true,
      adminFollowUpStatus: 'none'
    };

    if (isOfflineMode) {
      // Store in offline queue
      setOfflineQueue(prev => [fullEvaluation, ...prev]);
      setLastSubmittedEvaluation(fullEvaluation);
      return { success: true, evaluation: fullEvaluation };
    }

    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullEvaluation)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Submission failed' };
      }

      const created = await response.json();
      setEvaluations(prev => [created, ...prev]);
      setLastSubmittedEvaluation(created);
      
      // Update activity evaluated count in local view
      setActivities(prev => prev.map(a => {
        if (a.id === created.activityId) {
          const newCount = (a.evaluatedParticipants || 0) + 1;
          return { ...a, evaluatedParticipants: newCount };
        }
        return a;
      }));

      return { success: true, evaluation: created };
    } catch (netErr) {
      // Automatic fallback to offline queue on network error
      console.warn('Network offline during submission, queueing locally:', netErr);
      const offlineRecord: EvaluationSubmission = {
        ...fullEvaluation,
        submissionSource: 'offline_synced'
      };
      setOfflineQueue(prev => [offlineRecord, ...prev]);
      setLastSubmittedEvaluation(offlineRecord);
      return { success: true, evaluation: offlineRecord };
    }
  };

  // Sync all evaluations in offline queue to server
  const syncOfflineQueue = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    if (offlineQueue.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: offlineQueue })
      });

      if (!response.ok) {
        throw new Error('Sync server endpoint returned an error');
      }

      const resData = await response.json();
      // Clear synced items
      setOfflineQueue([]);
      localStorage.removeItem(LOCAL_STORAGE_QUEUE_KEY);
      
      // Refresh all state from server
      await refreshData();

      return { success: true, count: resData.syncedCount };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Failed to sync offline queue' };
    }
  };

  // Create new activity
  const createActivity = async (activityData: Partial<Activity>): Promise<Activity> => {
    const payload = {
      title: activityData.title,
      activityType: activityData.activityType,
      description: activityData.description,
      date: activityData.date,
      venue: activityData.venue,
      targetBeneficiaries: activityData.targetBeneficiaries,
      organizingDepartment: activityData.organizingDepartment,
      leadCoordinator: activityData.leadCoordinator,
      trainerOrSpeaker: activityData.trainerOrSpeaker,
      status: activityData.status || 'active',
      totalTargetParticipants: activityData.totalTargetParticipants || 40
    };

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setActivities(prev => [created, ...prev]);
        setSelectedActivityId(created.id);
        return created;
      }
    } catch (e) {
      console.warn('Offline activity creation fallback', e);
    }

    const fallbackAct: Activity = {
      id: `act-${Date.now()}`,
      title: activityData.title || 'New Activity',
      activityType: (activityData.activityType || 'training') as ActivityType,
      description: activityData.description || '',
      date: activityData.date || new Date().toISOString().split('T')[0],
      venue: activityData.venue || 'SLSU-Hinunangan',
      targetBeneficiaries: activityData.targetBeneficiaries || 'Beneficiaries',
      organizingDepartment: activityData.organizingDepartment || 'FCSIT',
      leadCoordinator: activityData.leadCoordinator || 'Lead Coordinator',
      trainerOrSpeaker: activityData.trainerOrSpeaker || 'Speaker',
      status: 'active',
      totalTargetParticipants: activityData.totalTargetParticipants || 30,
      evaluatedParticipants: 0,
      averageRating: 0
    };
    setActivities(prev => [fallbackAct, ...prev]);
    setSelectedActivityId(fallbackAct.id);
    return fallbackAct;
  };

  // Record audit log entry
  const logAuditAction = async (action: string, resourceId: string, reason: string, controlNumber?: string) => {
    const adminName = role === 'super_admin' ? 'University Extension Director' : 'Extension Coordinator (FCSIT)';
    const newLogItem: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName,
      action,
      resourceId,
      participantControlNumber: controlNumber,
      reason
    };

    setAuditLogs(prev => [newLogItem, ...prev]);

    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLogItem)
      });
    } catch (err) {
      console.warn('Failed to post audit log to server:', err);
    }
  };

  // Update follow-up status for serious participant feedback
  const updateFollowUpStatus = async (evalId: string, status: 'none' | 'pending' | 'in_progress' | 'resolved', notes: string) => {
    try {
      const res = await fetch(`/api/evaluations/${evalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          adminName: role === 'super_admin' ? 'Super Admin' : 'Extension Coordinator'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setEvaluations(prev => prev.map(e => e.id === evalId ? updated : e));
      }
    } catch {
      // Local fallback
      setEvaluations(prev => prev.map(e => {
        if (e.id === evalId) {
          return { ...e, adminFollowUpStatus: status, adminNotes: notes };
        }
        return e;
      }));
    }
  };

  // Export data as CSV with RA 10173 data minimization choice
  const exportDataAsCSV = (includePII: boolean = false) => {
    const headers = [
      'Control Number',
      'Activity ID',
      'Participant Category',
      'Verification Method',
      'Overall Mean Rating',
      'Satisfaction',
      'Objectives',
      'Relevance',
      'Facilities',
      'Time Management',
      'Organization',
      'Strengths Comment',
      'Improvement Areas Comment',
      'Suggestions Comment',
      'Sentiment',
      'Identified Topics',
      'Source',
      'Submission Timestamp',
      ...(includePII ? ['Participant Name', 'Participant Email', 'Phone'] : ['Name (Masked)', 'Email (Masked)'])
    ];

    const rows = evaluations.map(e => {
      const topicsStr = (e.sentiment.topics || []).join('; ');
      const piiFields = includePII
        ? [e.participantName, e.participantEmail, e.participantPhone || '']
        : [
            `${e.participantName.charAt(0)}*** ${e.participantName.split(' ')[1] ? e.participantName.split(' ')[1].charAt(0) + '***' : ''}`,
            `${e.participantEmail.charAt(0)}***@${e.participantEmail.split('@')[1] || 'domain.com'}`
          ];

      return [
        e.controlNumber,
        e.activityId,
        e.participantCategory,
        e.verificationMethod,
        e.meanRating,
        e.coreRatings.satisfaction,
        e.coreRatings.objectives,
        e.coreRatings.relevance,
        e.coreRatings.facilities,
        e.coreRatings.timeManagement,
        e.coreRatings.organization,
        `"${(e.comments.strengths || '').replace(/"/g, '""')}"`,
        `"${(e.comments.improvements || '').replace(/"/g, '""')}"`,
        `"${(e.comments.suggestions || '').replace(/"/g, '""')}"`,
        e.sentiment.overall,
        `"${topicsStr}"`,
        e.submissionSource,
        e.submittedAt,
        ...piiFields
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SLSU_Extension_Evaluations_${includePII ? 'AUTHORIZED_FULL' : 'ANONYMIZED'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Audit log if PII was exported
    if (includePII) {
      logAuditAction(
        'CONTROLLED_EXPORT_WITH_PII',
        'evaluations_dataset',
        'Authorized export with full participant identifiers for university administration archiving.'
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activities,
        selectedActivityId,
        setSelectedActivityId,
        evaluations,
        offlineQueue,
        isOfflineMode,
        setIsOfflineMode,
        auditLogs,
        maskPII,
        setMaskPII,
        isLoading,
        submitEvaluation,
        syncOfflineQueue,
        createActivity,
        logAuditAction,
        updateFollowUpStatus,
        showAboutModal,
        setShowAboutModal,
        showSyncModal,
        setShowSyncModal,
        lastSubmittedEvaluation,
        setLastSubmittedEvaluation,
        exportDataAsCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
