import { axiosRequest } from '@/src/store/authStore';
import type { 
  Job, 
  JobCreateRequest, 
  ApiResponse, 
  PagedResponse, 
  JobQueryParams 
} from '../types/job';

export const createJob = async (payload: JobCreateRequest): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/Job', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getJobs = async (): Promise<Job[]> => {
  const res = await axiosRequest.get<ApiResponse<Job[]>>('/Job');
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getMyJobs = async (): Promise<Job[]> => {
  const res = await axiosRequest.get<ApiResponse<Job[]>>('/Job/mine');
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await axiosRequest.get<any>(`/Job/${id}`);
  if (res.data?.data) {
    return res.data.data;
  }
  return res.data;
};

export const updateJob = async (id: number, payload: JobCreateRequest): Promise<string> => {
  const res = await axiosRequest.put<ApiResponse<string>>(`/Job/${id}`, payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const deleteJob = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Job/${id}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getJobsPaged = async (params: JobQueryParams): Promise<PagedResponse<Job>> => {
  const res = await axiosRequest.get<PagedResponse<Job>>('/Job/paged', { params });
  return res.data;
};

export const getJobsByOrganization = async (organizationId: number): Promise<Job[]> => {
  const res = await axiosRequest.get<any>(`/Job/by-organization/${organizationId}`);
  if (res.data?.data) {
    return res.data.data;
  }
  return Array.isArray(res.data) ? res.data : [];
};

export const searchJobs = async (title: string): Promise<Job[]> => {
  const res = await axiosRequest.get<ApiResponse<Job[]>>('/Job/search', { params: { title } });
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};
