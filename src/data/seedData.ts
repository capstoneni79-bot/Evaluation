import { Activity, ActivityType, QuestionDefinition } from '../types';

export const CORE_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'satisfaction',
    label: 'Overall Satisfaction',
    description: 'Overall, how satisfied are you with this SLSU extension activity?',
    category: 'core'
  },
  {
    id: 'objectives',
    label: 'Attainment of Objectives',
    description: 'The stated goals, syllabus, and objectives of the activity were clearly met.',
    category: 'core'
  },
  {
    id: 'relevance',
    label: 'Relevance and Practical Utility',
    description: 'The competencies learned are directly applicable to my livelihood, work, or daily life.',
    category: 'core'
  },
  {
    id: 'facilities',
    label: 'Venue, Facilities & Physical Setup',
    description: 'The venue, lighting, ventilation, and technical setup were conducive to participation.',
    category: 'core'
  },
  {
    id: 'timeManagement',
    label: 'Time Management & Program Flow',
    description: 'The activity adhered to schedule, managed pacing well, and concluded reasonably on time.',
    category: 'core'
  },
  {
    id: 'organization',
    label: 'Overall Organization & Management',
    description: 'The SLSU Extension Committee coordinated and assisted participants professionally.',
    category: 'core'
  }
];

export const ACTIVITY_SPECIFIC_QUESTIONS: Record<ActivityType, QuestionDefinition[]> = {
  training: [
    {
      id: 'trainerMastery',
      label: 'Trainer Subject Mastery & Communication',
      description: 'The trainer demonstrated exceptional knowledge of the topic and explained complex concepts clearly in the vernacular.',
      category: 'specific'
    },
    {
      id: 'learningMaterials',
      label: 'Adequacy of Learning Materials',
      description: 'The handouts, step-by-step guides, or digital modules were easy to follow and useful for review.',
      category: 'specific'
    },
    {
      id: 'practicalApplication',
      label: 'Hands-on Skill Practice & Exercises',
      description: 'Ample time and guidance were provided for hands-on drills and direct practical skill execution.',
      category: 'specific'
    }
  ],
  livelihood: [
    {
      id: 'livelihoodViability',
      label: 'Economic Viability for Income Generation',
      description: 'The livelihood enterprise presented has strong economic potential to augment my family income.',
      category: 'specific'
    },
    {
      id: 'starterKitQuality',
      label: 'Quality of Starter Kits & Inputs',
      description: 'The starter materials, seed stocks, or raw inputs distributed were complete, high quality, and usable.',
      category: 'specific'
    },
    {
      id: 'confidenceInSustaining',
      label: 'Confidence in Independent Adoption',
      description: 'I feel competent and confident to maintain and scale this livelihood project in my community.',
      category: 'specific'
    }
  ],
  seminar: [
    {
      id: 'speakerEngagement',
      label: 'Speaker Engagement & Delivery',
      description: 'The resource speaker captured participant interest and delivered dynamic, understandable insights.',
      category: 'specific'
    },
    {
      id: 'topicTimeliness',
      label: 'Timeliness & Local Relevance of Topics',
      description: 'The subjects discussed directly addressed emerging challenges confronting our community.',
      category: 'specific'
    },
    {
      id: 'openForumResponsiveness',
      label: 'Open Forum & Q&A Discussion',
      description: 'Questions and localized concerns raised during the open forum were answered constructively.',
      category: 'specific'
    }
  ],
  outreach: [
    {
      id: 'needsAddressed',
      label: 'Responsiveness to Urgent Community Needs',
      description: 'The outreach assistance directly addressed critical health, social, or welfare needs of our barangay.',
      category: 'specific'
    },
    {
      id: 'volunteerCourtesy',
      label: 'Courtesy, Care & Professionalism of Staff',
      description: 'The university faculty, staff, and student volunteers treated all beneficiaries with utmost dignity and warmth.',
      category: 'specific'
    },
    {
      id: 'serviceAccessibility',
      label: 'Fairness & Accessibility of Service Distribution',
      description: 'The flow of consultation, distribution, and assistance was organized, humane, and fair to all.',
      category: 'specific'
    }
  ],
  community_service: [
    {
      id: 'communityImpact',
      label: 'Direct Ecological & Social Impact',
      description: 'The service drive generated immediate, visible positive benefits for our locality and environment.',
      category: 'specific'
    },
    {
      id: 'safetyLogistics',
      label: 'Safety Measures & Field Coordination',
      description: 'Health, safety precautions, and site coordination were properly observed during field activities.',
      category: 'specific'
    },
    {
      id: 'civicMotivation',
      label: 'Motivation for Continuous Community Action',
      description: 'Participating in this program strengthened my civic responsibility and desire to support SLSU initiatives.',
      category: 'specific'
    }
  ]
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-2026-001',
    title: 'Digital Literacy & E-Commerce Training for Rural Agri-Entrepreneurs',
    activityType: 'training',
    description: 'Empowering local farmers and MSME food processors in Hinunangan to market native coconut products and rice varieties online through social commerce and e-wallets.',
    date: '2026-03-12',
    venue: 'SLSU-Hinunangan ICT Laboratory & Audio-Visual Hall',
    targetBeneficiaries: 'Local Farmers, Fisherfolk Cooperatives, Rural MSMEs',
    organizingDepartment: 'Faculty of Computer Studies and Information Technology (FCSIT)',
    leadCoordinator: 'Engr. Sheryl Ann C. Barrot, MIT',
    trainerOrSpeaker: 'Prof. Arnelyn T. Capapas & IT Extension Team',
    status: 'completed',
    totalTargetParticipants: 45,
    evaluatedParticipants: 2,
    averageRating: 4.56
  },
  {
    id: 'act-2026-002',
    title: 'Sustainable Seaweed & Mud Crab Livelihood Culture Demonstration',
    activityType: 'livelihood',
    description: 'Hands-on livelihood module providing coastal households in Hinunangan Bay with mud crab fattening pens and resilient seaweed seed stocks.',
    date: '2026-03-24',
    venue: 'Barangay Ingan Coastal Community Center, Hinunangan',
    targetBeneficiaries: 'Coastal Fisherfolk Families & Women Producers',
    organizingDepartment: 'Office of Extension and Community Services',
    leadCoordinator: 'Rencilyn P. Tabugon',
    trainerOrSpeaker: 'Aquaculture Specialist Dina Mae M. Tibar',
    status: 'completed',
    totalTargetParticipants: 35,
    evaluatedParticipants: 2,
    averageRating: 4.34
  },
  {
    id: 'act-2026-003',
    title: 'Seminar on Climate Resilience & Disaster Risk Preparedness for Barangays',
    activityType: 'seminar',
    description: 'Community symposium addressing coastal storm surge preparedness, rainwater harvesting, and solar early-warning communication tools.',
    date: '2026-04-05',
    venue: 'Hinunangan Municipal Gymnasium',
    targetBeneficiaries: 'Barangay Disaster Risk Reduction Councils & Youth Leaders',
    organizingDepartment: 'FCSIT Extension Division & SLSU DRRM Unit',
    leadCoordinator: 'Prof. Arnelyn T. Capapas',
    trainerOrSpeaker: 'PDRRMO Specialist & Environmental Science Faculty',
    status: 'completed',
    totalTargetParticipants: 60,
    evaluatedParticipants: 1,
    averageRating: 5.0
  },
  {
    id: 'act-2026-004',
    title: 'Community Health Outreach & Computerized Medical Records Assistance',
    activityType: 'outreach',
    description: 'Interdisciplinary medical mission and digital health profiling for senior citizens and indigent households in upland Hinunangan.',
    date: '2026-04-18',
    venue: 'Barangay Banghud Health Outpost, Hinunangan',
    targetBeneficiaries: 'Upland Residents, Senior Citizens, Barangay Health Workers',
    organizingDepartment: 'College of Allied Health & FCSIT Extension Unit',
    leadCoordinator: 'Dina Mae M. Tibar',
    trainerOrSpeaker: 'University Physician & IT Volunteer Corps',
    status: 'completed',
    totalTargetParticipants: 80,
    evaluatedParticipants: 1,
    averageRating: 4.67
  },
  {
    id: 'act-2026-005',
    title: 'Community Service: Mangrove Reforestation & Coastal Cleanup Drive',
    activityType: 'community_service',
    description: 'Youth-led ecological restoration and mangrove propagule planting along Hinunangan Marine Protected Sanctuary.',
    date: '2026-05-02',
    venue: 'Hinunangan Mangrove Marine Protected Sanctuary',
    targetBeneficiaries: 'Coastal Communities, Sangguniang Kabataan, Local Fisherfolk',
    organizingDepartment: 'SLSU Supreme Student Council & Extension Services',
    leadCoordinator: 'Rencilyn P. Tabugon',
    trainerOrSpeaker: 'CENRO Officer & Marine Biology Specialists',
    status: 'active',
    totalTargetParticipants: 50,
    evaluatedParticipants: 0,
    averageRating: 0
  }
];

export const TOPIC_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  facilities: { label: 'Facilities & Internet/Venue', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: 'Building' },
  speaker_mastery: { label: 'Trainer & Speaker Mastery', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: 'UserCheck' },
  learning_materials: { label: 'Learning Materials & Handouts', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: 'BookOpen' },
  logistics: { label: 'Logistics, Snacks & Kits', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: 'Package' },
  time_management: { label: 'Time Management & Pacing', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: 'Clock' },
  community_needs: { label: 'Community Needs & Impact', color: 'bg-teal-100 text-teal-800 border-teal-300', icon: 'HeartHandshake' },
  organization: { label: 'Event Coordination & Staff', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: 'CheckCircle' }
};

export const PARTICIPANT_CATEGORIES_DISPLAY: Record<string, string> = {
  farmer_fisherfolk: 'Farmers & Fisherfolk',
  women_cooperative: 'Women Association / Cooperative',
  youth_student: 'Youth & Students',
  lgu_official: 'Barangay / LGU Officials',
  msme_owner: 'Micro & Small Business (MSME)',
  community_member: 'General Community Resident'
};
