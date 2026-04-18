export type JobType = 'FullTime' | 'PartTime' | 'Remote' | 'Hybrid';
export type ExperienceLevel = 'Junior' | 'Middle' | 'Senior';

export interface Job {
  id: number;
  organizationId: number;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
  createdAt: string;
}

export interface JobCreateRequest {
  organizationId: number;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  experienceRequired: number;
  categoryId: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  description: string[];
  data: T;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface JobQueryParams {
  Title?: string;
  Location?: string;
  SalaryMin?: number;
  SalaryMax?: number;
  JobType?: JobType;
  ExperienceLevel?: ExperienceLevel;
  OrganizationId?: number;
  CategoryId?: number;
  PageNumber?: number;
  PageSize?: number;
}
