import { axiosRequest } from '@/src/store/authStore';
import type { 
  JobApplication, 
  JobApplicationCreateRequest, 
  JobApplicationUpdateRequest,
  JobApplicationQueryParams,
  ApplicationStatus
} from '../types/jobApplication';
import type { ApiResponse, PagedResponse } from '../types/job';

export const createApplication = async (payload: JobApplicationCreateRequest): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/JobApplication', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getApplicationById = async (id: number): Promise<JobApplication> => {
  const res = await axiosRequest.get<ApiResponse<JobApplication>>(`/JobApplication/${id}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const updateApplication = async (id: number, payload: JobApplicationUpdateRequest): Promise<string> => {
  const res = await axiosRequest.put<ApiResponse<string>>(`/JobApplication/${id}`, payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const deleteApplication = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/JobApplication/${id}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getApplicationsPaged = async (params: JobApplicationQueryParams): Promise<PagedResponse<JobApplication>> => {
  const res = await axiosRequest.get<PagedResponse<JobApplication>>('/JobApplication/paged', { params });
  return res.data;
};

export const getApplicationsByUser = async (userId: number): Promise<JobApplication[]> => {
  const res = await axiosRequest.get<ApiResponse<JobApplication[]>>(`/JobApplication/by-user/${userId}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getApplicationsByJob = async (jobId: number): Promise<JobApplication[]> => {
  const res = await axiosRequest.get<ApiResponse<JobApplication[]>>(`/JobApplication/by-job/${jobId}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const updateApplicationStatus = async (id: number, status: ApplicationStatus): Promise<string> => {
  const res = await axiosRequest.patch<ApiResponse<string>>(`/JobApplication/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  });
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};
