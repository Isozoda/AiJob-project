import { axiosRequest } from '@/src/store/authStore';
import type { 
  Organization, 
  OrganizationCreateRequest, 
  OrganizationQueryParams 
} from '../types/organization';
import type { ApiResponse, PagedResponse } from '../types/job';

export const createOrganization = async (payload: OrganizationCreateRequest): Promise<Organization> => {
  const res = await axiosRequest.post<ApiResponse<Organization>>('/Organization', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  const res = await axiosRequest.get<ApiResponse<Organization[]>>('/Organization');
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getMyOrganizations = async (): Promise<Organization[]> => {
  const res = await axiosRequest.get<ApiResponse<Organization[]>>('/Organization/mine');
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
  const res = await axiosRequest.get<any>(`/Organization/${id}`);
  // Handle cases where the response might be wrapped in ApiResponse or returned directly
  if (res.data?.data) {
    return res.data.data;
  }
  return res.data;
};

export const updateOrganization = async (id: number, payload: OrganizationCreateRequest): Promise<string> => {
  const res = await axiosRequest.put<ApiResponse<string>>(`/Organization/${id}`, payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const deleteOrganization = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Organization/${id}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getOrganizationsPaged = async (params: OrganizationQueryParams): Promise<PagedResponse<Organization>> => {
  const res = await axiosRequest.get<PagedResponse<Organization>>('/Organization/paged', { params });
  return res.data;
};

export const searchOrganizations = async (name: string): Promise<Organization[]> => {
  const res = await axiosRequest.get<ApiResponse<Organization[]>>('/Organization/search', { params: { name } });
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};
