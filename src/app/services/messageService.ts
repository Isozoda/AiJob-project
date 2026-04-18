import { axiosRequest } from '@/src/store/authStore';
import type { Message, SendMessagePayload } from '@/src/app/types/message';
import type { ApiResponse } from '@/src/app/types/post';

// ─── MESSAGE SERVICE ────────────────────────────────────────

/** POST /api/Message — Send a message */
export const sendMessage = async (payload: SendMessagePayload): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/Message', payload);
  return res.data.data;
};

/** GET /api/Message/{id} — Get message by ID */
export const getMessageById = async (id: number): Promise<Message> => {
  const res = await axiosRequest.get<ApiResponse<Message>>(`/Message/${id}`);
  return res.data.data;
};

/** DELETE /api/Message/{id} — Delete message */
export const deleteMessage = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Message/${id}`);
  return res.data.data;
};

/** GET /api/Message/by-conversation/{conversationId} — Get messages */
export const getMessagesByConversation = async (conversationId: number): Promise<Message[]> => {
  const res = await axiosRequest.get<ApiResponse<Message[]>>(`/Message/by-conversation/${conversationId}`);
  return res.data.data;
};
