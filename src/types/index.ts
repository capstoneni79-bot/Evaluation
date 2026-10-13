export type ActivityType = 'training' | 'livelihood' | 'seminar' | 'outreach' | 'community_service';

export type UserRole = 'admin' | 'participant';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  title?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
}

export type ActivityStatus = 'active' | 'completed' | 'upcoming' | 'draft' | 'archived';

export interface Activity {
  id: string;
  title: string;
  activityType: ActivityType;
  description: string;
  instructions?: string;
  date: string;
  startDate?: string;
  deadline?: string;
  venue: string;
  targetBeneficiaries: string;
  organizingDepartment: string;
  leadCoordinator: string;
  trainerOrSpeaker: string;
  status: ActivityStatus;
  totalTargetParticipants: number;
  evaluatedParticipants?: number;
  averageRating?: number;
  assignedFormId?: string;
  createdAt?: string;
}

export type ParticipantCategory =
  | 'farmer_fisherfolk'
  | 'women_cooperative'
  | 'youth_student'
  | 'lgu_official'
  | 'msme_owner'
  | 'community_member';

export interface EvaluationSubmission {
  id: string;
  activityId: string;
  formId?: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  participantCategory: ParticipantCategory;
  controlNumber: string;
  verificationMethod: 'student_id' | 'qr_code' | 'sms_code' | 'signed_attendance' | 'offline_form';
  coreRatings: {
    satisfaction: number;
    objectives: number;
    relevance: number;
    facilities: number;
    timeManagement: number;
    organization: number;
  };
  specificRatings: Record<string, number>;
  customAnswers?: Record<string, any>;
  meanRating: number;
  comments: {
    strengths: string;
    improvements: string;
    suggestions: string;
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;
    topics: string[];
    concernUrgency: 'low' | 'medium' | 'high' | 'critical';
  };
  submissionSource: 'online' | 'offline_synced';
  submittedAt: string;
  syncedAt?: string;
  deviceInfo: string;
  verified: boolean;
  consentAccepted: boolean;
  adminFollowUpStatus?: 'none' | 'pending' | 'in_progress' | 'resolved';
  adminNotes?: string;
}

// Evaluation Form Builder Types
export type QuestionType =
  | 'rating_scale'
  | 'star_rating'
  | 'single_choice'
  | 'multiple_choice'
  | 'dropdown'
  | 'short_text'
  | 'long_text';

export interface FormQuestion {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  weight?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
}

export interface EvaluationForm {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  targetActivityType?: ActivityType | 'all';
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}

// Survey Management Types
export interface SurveyQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'rating_scale' | 'single_choice' | 'multiple_choice' | 'text';
  required: boolean;
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentName?: string;
  respondentEmail?: string;
  isAnonymous: boolean;
  answers: Record<string, any>;
  submittedAt: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  status: 'draft' | 'published' | 'closed';
  isAnonymous: boolean;
  targetAudience: string;
  startDate: string;
  endDate: string;
  questions: SurveyQuestion[];
  responsesCount?: number;
  createdAt: string;
}

// Website Theme & Customization Types
export interface TypographySettings {
  baseFontSize: number; // in rem (e.g. 1.0)
  pageTitleSize: number; // in rem (e.g. 1.5)
  sectionHeadingSize: number; // in rem (e.g. 1.125)
  bodyTextSize: number; // in rem (e.g. 0.875)
  labelSize: number; // in rem (e.g. 0.75)
  buttonTextSize: number; // in rem (e.g. 0.75)
  tableTextSize: number; // in rem (e.g. 0.75)
  navTextSize: number; // in rem (e.g. 0.875)
  metricNumberSize: number; // in rem (e.g. 1.875)
  smallTextSize: number; // in rem (e.g. 0.6875)
  // Font Color Customization
  pageTitleColor?: string; // Main page title & hero header text color
  sectionHeadingColor?: string; // Section header, subheadings, and card titles
  bodyTextColor?: string; // Primary body text, descriptions, table rows
  mutedTextColor?: string; // Subtitles, captions, helper text, timestamps
  labelTextColor?: string; // Form input labels, table column headers, status tags
}

export interface LogoHistoryItem {
  id: string;
  sourceType: 'file' | 'url' | 'preset';
  value: string;
  name: string;
  timestamp: string;
  previewUrl?: string;
  sizeBytes?: number;
}

export interface WebsiteTheme {
  siteName: string;
  siteTagline: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pageBgColor: string;
  cardBgColor: string;
  sidebarBgColor: string;
  sidebarTextColor: string;
  sidebarLogoColor?: string;
  sidebarLogoBg?: string;
  sidebarLogoTextColor?: string;
  sidebarLogoType?: 'icon' | 'image';
  sidebarLogoUrl?: string;
  sidebarLogoIcon?: 'building' | 'graduation' | 'award' | 'shield' | 'landmark' | 'book' | 'sparkles';
  sidebarLogoShape?: 'rounded' | 'circle' | 'square';
  sidebarLogoHistory?: LogoHistoryItem[];
  sidebarActiveItemBg?: string;
  sidebarActiveItemText?: string;
  sidebarBorderColor?: string;
  headerBgColor: string;
  headerTextColor: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  linkTextColor: string;
  fontColorTitle?: string;
  fontColorHeading?: string;
  fontColorBody?: string;
  fontColorMuted?: string;
  fontColorLabel?: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  themeMode: 'light' | 'dark' | 'system';
  typography?: TypographySettings;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  resourceId: string;
  participantControlNumber?: string;
  reason: string;
  ipAddress?: string;
  status?: 'success' | 'failed';
}

export interface KPIItem {
  metric: string;
  value: string;
  status: 'Excellent' | 'Good' | 'Needs Attention';
  benchmark: string;
}

export interface AIActionableRecommendation {
  category: 'Logistics & Facilities' | 'Curriculum & Content' | 'Trainer Capability' | 'Community Partnership';
  recommendation: string;
  expectedImpact: string;
  responsibleUnit: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AIExecutiveReport {
  reportTitle: string;
  generatedDate: string;
  executiveSummary: string;
  keyPerformanceIndicators: KPIItem[];
  recurringStrengths: {
    topic: string;
    summary: string;
    sentimentRatio: string;
  }[];
  criticalWeaknesses: {
    topic: string;
    summary: string;
    severity: 'Low' | 'Medium' | 'High';
  }[];
  aiActionableRecommendations: AIActionableRecommendation[];
  evidenceQuotes: {
    quote: string;
    theme: string;
  }[];
  policyNotice: string;
}

export interface QuestionDefinition {
  id: string;
  label: string;
  description?: string;
  category: 'core' | 'specific';
}

export interface SystemMetrics {
  totalUsers: number;
  adminUsers: number;
  participantUsers: number;
  totalActivities: number;
  activeActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  draftActivities: number;
  totalSurveys: number;
  publishedSurveys: number;
  totalSurveyResponses: number;
  totalEvaluations: number;
  overallSatisfactionMean: number;
  turnoutCompletionRate: number;
  totalAuditEvents: number;
  recentActivityFeed: {
    id: string;
    action: string;
    target: string;
    actor: string;
    timestamp: string;
  }[];
}
