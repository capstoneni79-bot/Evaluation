export type ActivityType = 'training' | 'livelihood' | 'seminar' | 'outreach' | 'community_service';

export interface Activity {
  id: string;
  title: string;
  activityType: ActivityType;
  description: string;
  date: string;
  venue: string;
  targetBeneficiaries: string;
  organizingDepartment: string;
  leadCoordinator: string;
  trainerOrSpeaker: string;
  status: 'active' | 'completed' | 'upcoming';
  totalTargetParticipants: number;
  evaluatedParticipants?: number;
  averageRating?: number;
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

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  resourceId: string;
  participantControlNumber?: string;
  reason: string;
  ipAddress?: string;
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
