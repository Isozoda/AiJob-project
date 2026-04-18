import { axiosRequest } from '@/src/store/authStore';
import type {
  Profile,
  CreateProfilePayload,
  UpdateProfilePayload,
} from '@/src/app/types/profile';
import type { ApiResponse } from '@/src/app/types/post';

// ─── PROFILE SERVICE ────────────────────────────────────────

/** POST /api/Profile — Create profile */
export const createProfile = async (payload: CreateProfilePayload): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/Profile', payload);
  return res.data.data;
};

/** GET /api/Profile/{id} — Get profile by profile ID */
export const getProfileById = async (id: number): Promise<Profile> => {
  const res = await axiosRequest.get<ApiResponse<Profile>>(`/Profile/${id}`);
  return res.data.data;
};

/** GET /api/Profile/by-user/{userId} — Get profile by user ID */
export const getProfileByUserId = async (userId: number): Promise<Profile> => {
  const res = await axiosRequest.get<ApiResponse<Profile>>(`/Profile/by-user/${userId}`);
  return res.data.data;
};

/** PUT /api/Profile/{id} — Update profile */
export const updateProfile = async (id: number, payload: UpdateProfilePayload): Promise<string> => {
  const res = await axiosRequest.put<ApiResponse<string>>(`/Profile/${id}`, payload);
  return res.data.data;
};

/** DELETE /api/Profile/{id} — Delete profile */
export const deleteProfile = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Profile/${id}`);
  return res.data.data;
};
