export interface AiAskRequest {
  prompt: string;
}

export interface AiAskResponse {
  statusCode: number;
  description: string[];
  data: string;
}

export interface AnalyzeCvRequest {
  userId: number;
  cvText?: string;
  cvFileUrl?: string;
  applyToProfile: boolean;
  syncSkills: boolean;
}

export interface AnalyzeCvResponse {
  statusCode: number;
  description: string[];
  data: {
    fullName: string;
    firstName: string;
    lastName: string;
    professionalSummary: string;
    experienceYears: number;
    skills: string[];
    education: string[];
    recommendedRoles: string[];
    notes: string[];
    missingOrWeakSections: string[];
    howToImprove: string[];
    helpfulResources: string[];
    sourceTextPreview: string;
  };
}

export interface SkillGapResponse {
  statusCode: number;
  description: string[];
  data: {
    matchScore: number;
    fitSummary: string;
    strengths: string[];
    missingSkills: string[];
    nextSteps: string[];
  };
}

export interface DraftCoverLetterRequest {
  userId: number;
  jobId: number;
  tone: string;
  extraContext: string;
}

export interface DraftMessageRequest {
  userId: number;
  jobId: number;
  recipientName: string;
  purpose: string;
  tone: string;
  extraContext: string;
}

export interface AiTextResponse {
  statusCode: number;
  description: string[];
  data: {
    subject: string;
    content: string;
  };
}

export interface ImproveJobRequest {
  jobId: number;
  title: string;
  description: string;
  location: string;
  experienceRequired: number;
  applyToJob: boolean;
}

export interface ImproveJobResponse {
  statusCode: number;
  description: string[];
  data: {
    improvedTitle: string;
    improvedDescription: string;
    suggestedSkills: string[];
    suggestedResponsibilities: string[];
    suggestedBenefits: string[];
  };
}
