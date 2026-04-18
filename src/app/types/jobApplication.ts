export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Interview';

export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface JobApplicationCreateRequest {
  jobId: number;
  userId: number;
}

export interface JobApplicationUpdateRequest {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface JobApplicationQueryParams {
  Status?: ApplicationStatus;
  JobId?: number;
  UserId?: number;
  PageNumber?: number;
  PageSize?: number;
}
