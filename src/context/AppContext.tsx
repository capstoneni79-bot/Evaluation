import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Activity, 
  EvaluationSubmission, 
  AuditLog, 
  ActivityType, 
  UserRole, 
  UserAccount,
  EvaluationForm,
  Survey,
  SurveyResponse,
  WebsiteTheme,
  TypographySettings,
  SystemMetrics
} from '../types';
import { INITIAL_ACTIVITIES } from '../data/seedData';
import { ToastMessage } from '../components/ui/Toast';

export interface SystemSettings {
  institutionName: string;
  campusCode: string;
  leadDepartment: string;
  minimumTurnoutTargetPct: number;
  targetSatisfactionMean: number;
  autoSyncOnReconnect: boolean;
  enableDataPrivacyMasking: boolean;
  accreditationCycle: string;
  academicYear: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, UserAccount> = {
  admin: {
    id: 'user-001',
    name: 'Dr. Jane C. Monfort',
    email: 'admin@slsu.edu.ph',
    role: 'admin',
    department: 'Office of the Campus Director & Quality Assurance',
    title: 'Director of Extension Services',
    status: 'active',
    lastLogin: '2026-05-10T08:30:00Z'
  },
  participant: {
    id: 'user-005',
    name: 'Vicente B. Alipoyo',
    email: 'vicente.alipoyo@gmail.com',
    role: 'participant',
    department: 'Hinunangan Rural Farmers Association',
    title: 'Agri-Cooperative Participant',
    status: 'active',
    lastLogin: '2026-05-12T11:45:00Z'
  }
};

export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  baseFontSize: 1.0,        // 16px
  pageTitleSize: 1.5,       // 24px
  sectionHeadingSize: 1.125, // 18px
  bodyTextSize: 0.875,      // 14px
  labelSize: 0.75,          // 12px
  buttonTextSize: 0.75,     // 12px
  tableTextSize: 0.75,      // 12px
  navTextSize: 0.875,       // 14px
  metricNumberSize: 1.875,  // 30px
  smallTextSize: 0.6875,    // 11px
  pageTitleColor: '#0f172a',
  sectionHeadingColor: '#1e293b',
  bodyTextColor: '#334155',
  mutedTextColor: '#64748b',
  labelTextColor: '#475569'
};

export const DEFAULT_THEME: WebsiteTheme = {
  siteName: 'Southern Leyte State University',
  siteTagline: 'Extension Services Evaluation System & Decision Support',
  logoText: 'SLSU-Hinunangan',
  primaryColor: '#022c22', // emerald-950
  secondaryColor: '#065f46', // emerald-800
  accentColor: '#d97706', // amber-600
  pageBgColor: '#f8fafc', // slate-50
  cardBgColor: '#ffffff',
  sidebarBgColor: '#ffffff',
  sidebarTextColor: '#1e293b',
  sidebarLogoColor: '#d97706',
  sidebarLogoBg: '#022c22',
  sidebarLogoTextColor: '#1e293b',
  sidebarLogoType: 'icon',
  sidebarLogoUrl: '',
  sidebarLogoIcon: 'building',
  sidebarLogoShape: 'rounded',
  sidebarLogoHistory: [
    {
      id: 'logo-hist-001',
      sourceType: 'preset',
      value: 'building',
      name: 'SLSU Institutional Campus Landmark',
      timestamp: '2026-05-10T08:00:00Z'
    },
    {
      id: 'logo-hist-002',
      sourceType: 'preset',
      value: 'shield',
      name: 'AACCUP Quality Assurance Shield',
      timestamp: '2026-05-08T14:30:00Z'
    },
    {
      id: 'logo-hist-003',
      sourceType: 'preset',
      value: 'graduation',
      name: 'Academic Graduation Faculty Emblem',
      timestamp: '2026-05-05T09:15:00Z'
    }
  ],
  sidebarActiveItemBg: '#022c22',
  sidebarActiveItemText: '#ffffff',
  sidebarBorderColor: '#e2e8f0',
  headerBgColor: '#022c22',
  headerTextColor: '#ffffff',
  buttonPrimaryBg: '#064e3b',
  buttonPrimaryText: '#ffffff',
  linkTextColor: '#065f46',
  fontColorTitle: '#0f172a',
  fontColorHeading: '#1e293b',
  fontColorBody: '#334155',
  fontColorMuted: '#64748b',
  fontColorLabel: '#475569',
  successColor: '#059669',
  warningColor: '#d97706',
  errorColor: '#dc2626',
  themeMode: 'light',
  typography: DEFAULT_TYPOGRAPHY
};

interface AppContextType {
  // Authentication & Role
  currentUser: UserAccount;
  role: UserRole;
  users: UserAccount[];
  switchDemoAccount: (targetRole: UserRole) => void;
  loginWithEmail: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole, status?: 'active' | 'inactive') => Promise<void>;
  createUserAccount: (accountData: Partial<UserAccount>) => Promise<UserAccount | null>;
  deleteUserAccount: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;

  // Navigation & View Layout
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Domain Data: Activities
  activities: Activity[];
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  createActivity: (activityData: Partial<Activity>) => Promise<Activity>;
  updateActivity: (id: string, activityData: Partial<Activity>) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<boolean>;
  duplicateActivity: (id: string) => Promise<Activity>;

  // Domain Data: Forms Builder
  forms: EvaluationForm[];
  createForm: (formData: Partial<EvaluationForm>) => Promise<EvaluationForm>;
  updateForm: (id: string, formData: Partial<EvaluationForm>) => Promise<EvaluationForm>;
  deleteForm: (id: string) => Promise<boolean>;
  duplicateForm: (id: string) => Promise<EvaluationForm>;

  // Domain Data: Surveys
  surveys: Survey[];
  createSurvey: (surveyData: Partial<Survey>) => Promise<Survey>;
  updateSurvey: (id: string, surveyData: Partial<Survey>) => Promise<Survey>;
  deleteSurvey: (id: string) => Promise<boolean>;
  submitSurveyResponse: (surveyId: string, answers: Record<string, any>, name?: string, email?: string) => Promise<boolean>;

  // Domain Data: Website Theme Customization
  theme: WebsiteTheme;
  updateTheme: (newTheme: Partial<WebsiteTheme>, showToast?: boolean) => Promise<void>;
  resetTheme: () => Promise<void>;

  // Domain Data: Evaluations & Sync
  evaluations: EvaluationSubmission[];
  offlineQueue: EvaluationSubmission[];
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  auditLogs: AuditLog[];
  maskPII: boolean;
  setMaskPII: (mask: boolean) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  systemMetrics: SystemMetrics | null;
  refreshMetrics: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  isLoading: boolean;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Actions
  submitEvaluation: (evaluationData: Partial<EvaluationSubmission>) => Promise<{ success: boolean; evaluation?: EvaluationSubmission; error?: string }>;
  syncOfflineQueue: () => Promise<{ success: boolean; count: number; error?: string }>;
  logAuditAction: (action: string, resourceId: string, reason: string, controlNumber?: string) => Promise<void>;
  updateFollowUpStatus: (evalId: string, status: 'none' | 'pending' | 'in_progress' | 'resolved', notes: string) => Promise<void>;
  
  // UI Modal states
  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;
  showSyncModal: boolean;
  setShowSyncModal: (show: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  lastSubmittedEvaluation: EvaluationSubmission | null;
  setLastSubmittedEvaluation: (evalItem: EvaluationSubmission | null) => void;
  exportDataAsCSV: (includePII?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_QUEUE_KEY = 'slsu_ext_offline_queue_v1';
const LOCAL_STORAGE_EVALS_KEY = 'slsu_ext_evals_cache_v1';
const LOCAL_STORAGE_USER_KEY = 'slsu_ext_current_user_v1';
const LOCAL_STORAGE_THEME_KEY = 'slsu_ext_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Demo Accounts
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEMO_ACCOUNTS.admin; // Default to Admin on initial landing
  });

  const role = currentUser.role;

  // Navigation layout state
  const [currentView, setCurrentView] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Users roster for Admin role management
  const [users, setUsers] = useState<UserAccount[]>([
    DEMO_ACCOUNTS.admin,
    DEMO_ACCOUNTS.participant
  ]);

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    institutionName: 'Southern Leyte State University - Hinunangan Campus',
    campusCode: 'SLSU-HIN',
    leadDepartment: 'Faculty of Computer Studies and Information Technology (FCSIT)',
    minimumTurnoutTargetPct: 80,
    targetSatisfactionMean: 4.00,
    autoSyncOnReconnect: true,
    enableDataPrivacyMasking: true,
    accreditationCycle: 'AACCUP Level III Re-Accreditation (May 2026)',
    academicYear: '2025-2026'
  });

  // Website Theme Customization
  const [theme, setTheme] = useState<WebsiteTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_THEME;
  });

  // Data collections
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(INITIAL_ACTIVITIES[0].id);
  const [forms, setForms] = useState<EvaluationForm[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationSubmission[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<EvaluationSubmission[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [maskPII, setMaskPII] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal triggers
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [lastSubmittedEvaluation, setLastSubmittedEvaluation] = useState<EvaluationSubmission | null>(null);

  // Apply theme and typography design tokens to CSS variables on DOM
  const applyThemeToDOM = (t: WebsiteTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', t.primaryColor);
    root.style.setProperty('--brand-secondary', t.secondaryColor);
    root.style.setProperty('--brand-accent', t.accentColor);
    root.style.setProperty('--bg-page', t.pageBgColor);
    root.style.setProperty('--bg-card', t.cardBgColor);
    root.style.setProperty('--bg-sidebar', t.sidebarBgColor);
    root.style.setProperty('--text-sidebar', t.sidebarTextColor);
    root.style.setProperty('--sidebar-logo-color', t.sidebarLogoColor || t.accentColor);
    root.style.setProperty('--sidebar-logo-bg', t.sidebarLogoBg || t.primaryColor);
    root.style.setProperty('--sidebar-logo-text', t.sidebarLogoTextColor || t.sidebarTextColor);
    root.style.setProperty('--sidebar-active-bg', t.sidebarActiveItemBg || t.primaryColor);
    root.style.setProperty('--sidebar-active-text', t.sidebarActiveItemText || '#ffffff');
    root.style.setProperty('--sidebar-border', t.sidebarBorderColor || '#e2e8f0');
    root.style.setProperty('--bg-header', t.headerBgColor);
    root.style.setProperty('--text-header', t.headerTextColor);
    root.style.setProperty('--btn-primary-bg', t.buttonPrimaryBg);
    root.style.setProperty('--btn-primary-text', t.buttonPrimaryText);
    root.style.setProperty('--color-link', t.linkTextColor);

    // Typography variables
    const typo = t.typography || DEFAULT_TYPOGRAPHY;
    root.style.setProperty('--font-size-base', `${typo.baseFontSize}rem`);
    root.style.setProperty('--font-size-title', `${typo.pageTitleSize}rem`);
    root.style.setProperty('--font-size-heading', `${typo.sectionHeadingSize}rem`);
    root.style.setProperty('--font-size-body', `${typo.bodyTextSize}rem`);
    root.style.setProperty('--font-size-label', `${typo.labelSize}rem`);
    root.style.setProperty('--font-size-button', `${typo.buttonTextSize}rem`);
    root.style.setProperty('--font-size-table', `${typo.tableTextSize}rem`);
    root.style.setProperty('--font-size-nav', `${typo.navTextSize}rem`);
    root.style.setProperty('--font-size-stat', `${typo.metricNumberSize}rem`);
    root.style.setProperty('--font-size-small', `${typo.smallTextSize}rem`);

    // Font color tokens
    const titleColor = typo.pageTitleColor || t.fontColorTitle || '#0f172a';
    const headingColor = typo.sectionHeadingColor || t.fontColorHeading || '#1e293b';
    const bodyColor = typo.bodyTextColor || t.fontColorBody || '#334155';
    const mutedColor = typo.mutedTextColor || t.fontColorMuted || '#64748b';
    const labelColor = typo.labelTextColor || t.fontColorLabel || '#475569';
    root.style.setProperty('--font-color-title', titleColor);
    root.style.setProperty('--font-color-heading', headingColor);
    root.style.setProperty('--font-color-body', bodyColor);
    root.style.setProperty('--font-color-muted', mutedColor);
    root.style.setProperty('--font-color-label', labelColor);

    // Proportional root scale: adjusts all Tailwind rem values across entire app safely
    const clampedBasePx = Math.max(12, Math.min(22, typo.baseFontSize * 16));
    root.style.fontSize = `${clampedBasePx}px`;
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    setToasts(prev => {
      const isDuplicate = prev.some(
        t => t.title === toast.title && t.description === toast.description
      );
      if (isDuplicate) return prev;
      const id = `toast-${Date.now()}-${Math.random()}`;
      return [...prev.slice(-2), { ...toast, id }];
    });
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch demo account
  const switchDemoAccount = (targetRole: UserRole) => {
    const target = DEMO_ACCOUNTS[targetRole] || DEMO_ACCOUNTS.admin;
    setCurrentUser(target);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(target));
    setCurrentView('overview');
    addToast({
      type: 'info',
      title: `Switched to Demo Role: ${targetRole.toUpperCase()}`,
      description: `Signed in as ${target.name} (${target.title})`
    });
  };

  // Login with email
  const loginWithEmail = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        setCurrentView('overview');
        addToast({
          type: 'success',
          title: 'Sign In Successful',
          description: `Welcome, ${data.user.name}`
        });
        return true;
      } else {
        const err = await res.json();
        addToast({
          type: 'error',
          title: 'Sign In Failed',
          description: err.error || 'Invalid credentials'
        });
        return false;
      }
    } catch {
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found));
        setCurrentView('overview');
        addToast({
          type: 'success',
          title: 'Sign In Successful',
          description: `Welcome, ${found.name}`
        });
        return true;
      }
      return false;
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(DEMO_ACCOUNTS.participant);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setCurrentView('overview');
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'Switched to participant portal'
    });
  };

  // User management
  const updateUserRole = async (userId: string, newRole: UserRole, status: 'active' | 'inactive' = 'active') => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, status })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? updated : u));
        addToast({
          type: 'success',
          title: 'User Updated',
          description: `${updated.name} updated successfully.`
        });
      }
    } catch {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, status } : u));
    }
  };

  const createUserAccount = async (accountData: Partial<UserAccount>): Promise<UserAccount | null> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      if (res.ok) {
        const created = await res.json();
        setUsers(prev => [...prev, created]);
        addToast({
          type: 'success',
          title: 'Account Created',
          description: `${created.name} (${created.role})`
        });
        return created;
      }
    } catch {}
    return null;
  };

  const deleteUserAccount = async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        addToast({ type: 'info', title: 'User Removed', description: 'Account deleted.' });
        return true;
      }
    } catch {}
    setUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  const resetUserPassword = async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${userId}/reset`, { method: 'POST' });
      if (res.ok) {
        addToast({ type: 'success', title: 'Reset Link Dispatched', description: 'Temporary credential reset token issued.' });
        return true;
      }
    } catch {}
    return false;
  };

  // Activity management
  const createActivity = async (activityData: Partial<Activity>): Promise<Activity> => {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    });
    const created = await res.json();
    setActivities(prev => [created, ...prev]);
    return created;
  };

  const updateActivity = async (id: string, activityData: Partial<Activity>): Promise<Activity> => {
    const res = await fetch(`/api/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    });
    const updated = await res.json();
    setActivities(prev => prev.map(a => a.id === id ? updated : a));
    addToast({ type: 'success', title: 'Activity Updated', description: `Saved changes to "${updated.title}".` });
    return updated;
  };

  const deleteActivity = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setActivities(prev => prev.filter(a => a.id !== id));
      addToast({ type: 'info', title: 'Activity Archived', description: 'Activity moved to archives.' });
      return true;
    }
    return false;
  };

  const duplicateActivity = async (id: string): Promise<Activity> => {
    const res = await fetch(`/api/activities/${id}/duplicate`, { method: 'POST' });
    const cloned = await res.json();
    setActivities(prev => [cloned, ...prev]);
    addToast({ type: 'success', title: 'Activity Duplicated', description: `Created cohort clone "${cloned.title}".` });
    return cloned;
  };

  // Evaluation Form Builder
  const createForm = async (formData: Partial<EvaluationForm>): Promise<EvaluationForm> => {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const created = await res.json();
    setForms(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Evaluation Form Created', description: `Rubric "${created.title}" ready.` });
    return created;
  };

  const updateForm = async (id: string, formData: Partial<EvaluationForm>): Promise<EvaluationForm> => {
    const res = await fetch(`/api/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const updated = await res.json();
    setForms(prev => prev.map(f => f.id === id ? updated : f));
    addToast({ type: 'success', title: 'Form Rubric Updated', description: `Updated questions in "${updated.title}".` });
    return updated;
  };

  const deleteForm = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setForms(prev => prev.filter(f => f.id !== id));
      addToast({ type: 'info', title: 'Form Deleted', description: 'Evaluation form removed.' });
      return true;
    }
    return false;
  };

  const duplicateForm = async (id: string): Promise<EvaluationForm> => {
    const res = await fetch(`/api/forms/${id}/duplicate`, { method: 'POST' });
    const cloned = await res.json();
    setForms(prev => [cloned, ...prev]);
    addToast({ type: 'success', title: 'Form Cloned', description: `Created new draft template "${cloned.title}".` });
    return cloned;
  };

  // Survey Management
  const createSurvey = async (surveyData: Partial<Survey>): Promise<Survey> => {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    });
    const created = await res.json();
    setSurveys(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Survey Created', description: `Stakeholder survey "${created.title}" registered.` });
    return created;
  };

  const updateSurvey = async (id: string, surveyData: Partial<Survey>): Promise<Survey> => {
    const res = await fetch(`/api/surveys/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    });
    const updated = await res.json();
    setSurveys(prev => prev.map(s => s.id === id ? updated : s));
    addToast({ type: 'success', title: 'Survey Updated', description: `Saved changes to "${updated.title}".` });
    return updated;
  };

  const deleteSurvey = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSurveys(prev => prev.filter(s => s.id !== id));
      addToast({ type: 'info', title: 'Survey Archived', description: 'Survey removed from active list.' });
      return true;
    }
    return false;
  };

  const submitSurveyResponse = async (surveyId: string, answers: Record<string, any>, name?: string, email?: string): Promise<boolean> => {
    const res = await fetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, respondentName: name, respondentEmail: email })
    });
    if (res.ok) {
      addToast({ type: 'success', title: 'Survey Submitted', description: 'Thank you for your valuable feedback.' });
      refreshMetrics();
      return true;
    }
    return false;
  };

  // Website Theme Customization
  const updateTheme = async (newTheme: Partial<WebsiteTheme>, showToast = false) => {
    try {
      const merged = { ...theme, ...newTheme };
      setTheme(merged);
      applyThemeToDOM(merged);
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': role
        },
        body: JSON.stringify(merged)
      });
      if (res.ok && showToast) {
        addToast({
          type: 'success',
          title: 'Theme Customization Published',
          description: 'Global colors and branding updated across the website.'
        });
      }
    } catch {
      if (showToast) {
        addToast({ type: 'info', title: 'Theme Updated', description: 'Saved locally in browser session.' });
      }
    }
  };

  const resetTheme = async () => {
    try {
      setTheme(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
      await fetch('/api/theme/reset', { 
        method: 'POST',
        headers: { 'x-user-role': role }
      });
      addToast({
        type: 'info',
        title: 'Theme Reset to Default',
        description: 'Restored original SLSU Forest Green & Gold institutional palette.'
      });
    } catch {}
  };

  // System Settings
  const updateSystemSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSystemSettings(data);
        addToast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Institutional accreditation configurations updated.'
        });
      }
    } catch {
      setSystemSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  // Refresh metrics
  const refreshMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setSystemMetrics(data);
      }
    } catch {}
  };

  // Load all initial data from backend API
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [actRes, evalRes, formsRes, surveysRes, themeRes, metricsRes, usersRes, logsRes, settingsRes] = await Promise.allSettled([
        fetch('/api/activities'),
        fetch('/api/evaluations'),
        fetch('/api/forms'),
        fetch('/api/surveys'),
        fetch('/api/theme'),
        fetch('/api/admin/metrics'),
        fetch('/api/users'),
        fetch('/api/audit-logs'),
        fetch('/api/settings')
      ]);

      if (actRes.status === 'fulfilled' && actRes.value.ok) {
        setActivities(await actRes.value.json());
      }
      if (evalRes.status === 'fulfilled' && evalRes.value.ok) {
        const evalData = await evalRes.value.json();
        setEvaluations(evalData);
        localStorage.setItem(LOCAL_STORAGE_EVALS_KEY, JSON.stringify(evalData));
      }
      if (formsRes.status === 'fulfilled' && formsRes.value.ok) {
        setForms(await formsRes.value.json());
      }
      if (surveysRes.status === 'fulfilled' && surveysRes.value.ok) {
        setSurveys(await surveysRes.value.json());
      }
      if (themeRes.status === 'fulfilled' && themeRes.value.ok) {
        const tData = await themeRes.value.json();
        setTheme(tData);
        applyThemeToDOM(tData);
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
        setSystemMetrics(await metricsRes.value.json());
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        setUsers(await usersRes.value.json());
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.ok) {
        setAuditLogs(await logsRes.value.json());
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
        setSystemSettings(await settingsRes.value.json());
      }
    } catch (err) {
      console.warn('Network request failed, using cache:', err);
      const cachedEvals = localStorage.getItem(LOCAL_STORAGE_EVALS_KEY);
      if (cachedEvals) {
        try { setEvaluations(JSON.parse(cachedEvals)); } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedQueue = localStorage.getItem(LOCAL_STORAGE_QUEUE_KEY);
    if (savedQueue) {
      try { setOfflineQueue(JSON.parse(savedQueue)); } catch {}
    }
    refreshAllData();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_QUEUE_KEY, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Submit evaluation
  const submitEvaluation = async (evaluationData: Partial<EvaluationSubmission>): Promise<{ success: boolean; evaluation?: EvaluationSubmission; error?: string }> => {
    if (isOfflineMode) {
      const offlineRecord: EvaluationSubmission = {
        id: `offline-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        activityId: evaluationData.activityId || activities[0].id,
        participantName: evaluationData.participantName || 'Anonymous Participant',
        participantEmail: evaluationData.participantEmail || '',
        participantPhone: evaluationData.participantPhone,
        participantCategory: evaluationData.participantCategory || 'community_member',
        controlNumber: evaluationData.controlNumber || `SLSU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        verificationMethod: evaluationData.verificationMethod || 'student_id',
        coreRatings: evaluationData.coreRatings || {
          satisfaction: 5,
          objectives: 5,
          relevance: 5,
          facilities: 5,
          timeManagement: 5,
          organization: 5
        },
        specificRatings: evaluationData.specificRatings || {},
        meanRating: evaluationData.meanRating || 5,
        comments: evaluationData.comments || { strengths: '', improvements: '', suggestions: '' },
        sentiment: evaluationData.sentiment || {
          overall: 'positive',
          score: 0.8,
          topics: ['community_needs'],
          concernUrgency: 'low'
        },
        submissionSource: 'offline_synced',
        submittedAt: new Date().toISOString(),
        deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Offline Terminal',
        verified: true,
        consentAccepted: evaluationData.consentAccepted ?? true
      };

      setOfflineQueue(prev => [...prev, offlineRecord]);
      setEvaluations(prev => [offlineRecord, ...prev]);
      setLastSubmittedEvaluation(offlineRecord);
      addToast({
        type: 'info',
        title: 'Stored in Offline Field Queue',
        description: `Control No: ${offlineRecord.controlNumber}. Ready for local reconciliation.`
      });
      return { success: true, evaluation: offlineRecord };
    }

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.message || 'Submission failed' };
      }

      const createdEvaluation: EvaluationSubmission = await res.json();
      setEvaluations(prev => [createdEvaluation, ...prev]);
      setLastSubmittedEvaluation(createdEvaluation);
      refreshMetrics();
      addToast({
        type: 'success',
        title: 'Evaluation Successfully Recorded',
        description: `Control No: ${createdEvaluation.controlNumber}. Verified under RA 10173.`
      });
      return { success: true, evaluation: createdEvaluation };
    } catch {
      return { success: false, error: 'Network error submitting evaluation' };
    }
  };

  const syncOfflineQueue = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    if (offlineQueue.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluations: offlineQueue })
      });

      if (res.ok) {
        const data = await res.json();
        setOfflineQueue([]);
        localStorage.removeItem(LOCAL_STORAGE_QUEUE_KEY);
        refreshAllData();
        addToast({
          type: 'success',
          title: 'Reconciliation Complete',
          description: `Successfully synced ${data.syncedCount} field evaluation records.`
        });
        return { success: true, count: data.syncedCount };
      }
      return { success: false, count: 0, error: 'Sync endpoint returned error.' };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message };
    }
  };

  const logAuditAction = async (action: string, resourceId: string, reason: string, controlNumber?: string) => {
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          resourceId,
          reason,
          participantControlNumber: controlNumber,
          adminName: currentUser.name
        })
      });
      if (res.ok) {
        const newLog = await res.json();
        setAuditLogs(prev => [newLog, ...prev]);
      }
    } catch {
      const fallbackLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: currentUser.name,
        action,
        resourceId,
        participantControlNumber: controlNumber,
        reason
      };
      setAuditLogs(prev => [fallbackLog, ...prev]);
    }
  };

  const updateFollowUpStatus = async (evalId: string, status: 'none' | 'pending' | 'in_progress' | 'resolved', notes: string) => {
    try {
      const res = await fetch(`/api/evaluations/${evalId}/follow-up`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        setEvaluations(prev => prev.map(e => e.id === evalId ? { ...e, adminFollowUpStatus: status, adminNotes: notes } : e));
      }
    } catch {
      setEvaluations(prev => prev.map(e => e.id === evalId ? { ...e, adminFollowUpStatus: status, adminNotes: notes } : e));
    }
  };

  const exportDataAsCSV = (includePII: boolean = false) => {
    if (includePII) {
      logAuditAction(
        'FULL_PII_CSV_EXPORT',
        'evaluations_dataset',
        'Authorized administrative bulk export for AACCUP Level III accreditation review.'
      );
    }

    const headers = [
      'Control Number',
      'Activity ID',
      'Date Submitted',
      'Sector',
      'Participant Name',
      'Email',
      'Phone',
      'Overall Mean Score',
      'Sentiment',
      'Key Strengths',
      'Improvements Needed',
      'Verification Method',
      'Submission Source'
    ];

    const rows = evaluations.map(e => {
      const name = includePII ? e.participantName : `${e.participantName.charAt(0)}***`;
      const email = includePII ? e.participantEmail : `${e.participantEmail.charAt(0)}***@slsu.edu.ph`;
      const phone = includePII ? (e.participantPhone || '') : '***-***-****';

      return [
        `"${e.controlNumber}"`,
        `"${e.activityId}"`,
        `"${e.submittedAt}"`,
        `"${e.participantCategory}"`,
        `"${name}"`,
        `"${email}"`,
        `"${phone}"`,
        `"${e.meanRating}"`,
        `"${e.sentiment.overall}"`,
        `"${(e.comments.strengths || '').replace(/"/g, '""')}"`,
        `"${(e.comments.improvements || '').replace(/"/g, '""')}"`,
        `"${e.verificationMethod}"`,
        `"${e.submissionSource}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SLSU_Evaluations_${includePII ? 'AUTHORIZED_FULL' : 'ANONYMIZED'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      type: 'info',
      title: 'Dataset Exported',
      description: `Downloaded ${evaluations.length} evaluation records.`
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        users,
        switchDemoAccount,
        loginWithEmail,
        logout,
        updateUserRole,
        createUserAccount,
        deleteUserAccount,
        resetUserPassword,

        currentView,
        setCurrentView,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,

        activities,
        selectedActivityId,
        setSelectedActivityId,
        createActivity,
        updateActivity,
        deleteActivity,
        duplicateActivity,

        forms,
        createForm,
        updateForm,
        deleteForm,
        duplicateForm,

        surveys,
        createSurvey,
        updateSurvey,
        deleteSurvey,
        submitSurveyResponse,

        theme,
        updateTheme,
        resetTheme,

        evaluations,
        offlineQueue,
        isOfflineMode,
        setIsOfflineMode,
        auditLogs,
        maskPII,
        setMaskPII,
        systemSettings,
        updateSystemSettings,
        systemMetrics,
        refreshMetrics,
        refreshAllData,
        isLoading,

        toasts,
        addToast,
        dismissToast,

        submitEvaluation,
        syncOfflineQueue,
        logAuditAction,
        updateFollowUpStatus,

        showAboutModal,
        setShowAboutModal,
        showSyncModal,
        setShowSyncModal,
        showLoginModal,
        setShowLoginModal,
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
