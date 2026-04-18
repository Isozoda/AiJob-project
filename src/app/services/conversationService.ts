import { axiosRequest } from '@/src/store/authStore';
import type { ApiResponse } from '@/src/app/types/post';
import type { Conversation } from '@/src/app/types/conversation';

// ─── CONVERSATION SERVICE ────────────────────────────────────────

/** POST /api/Conversation — Create or get conversation */
export const createConversation = async (otherUserId: number): Promise<Conversation> => {
  const res = await axiosRequest.post<ApiResponse<Conversation>>('/Conversation', { otherUserId });
  return res.data.data;
};

/** GET /api/Conversation — Get my conversations */
export const getMyConversations = async (): Promise<Conversation[]> => {
  const res = await axiosRequest.get<ApiResponse<Conversation[]>>('/Conversation');
  return res.data.data;
};

/** GET /api/Conversation/{id} — Get conversation by ID */
export const getConversationById = async (id: number): Promise<Conversation> => {
  const res = await axiosRequest.get<ApiResponse<Conversation>>(`/Conversation/${id}`);
  return res.data.data;
};

/** DELETE /api/Conversation/{id} — Delete conversation */
export const deleteConversation = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Conversation/${id}`);
  return res.data.data;
};
