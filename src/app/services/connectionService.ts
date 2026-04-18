import { axiosRequest } from '@/src/store/authStore';
import type { Connection, RespondPayload, SendByEmailPayload } from '@/src/app/types/connection';
import type { ApiResponse } from '@/src/app/types/post';

// ─── CONNECTION SERVICE ─────────────────────────────────────

/** POST /api/Connection/send/{addresseeId} — Send connection request */
export const sendConnectionRequest = async (addresseeId: number): Promise<void> => {
  await axiosRequest.post(`/Connection/send/${addresseeId}`);
};

/** POST /api/Connection/send-by-email — Send connection by email */
export const sendConnectionByEmail = async (payload: SendByEmailPayload): Promise<void> => {
  await axiosRequest.post('/Connection/send-by-email', payload);
};

/** PUT /api/Connection/{connectionId}/respond — Accept/Reject */
export const respondToConnection = async (connectionId: number, payload: RespondPayload): Promise<void> => {
  await axiosRequest.put(`/Connection/${connectionId}/respond`, payload);
};

/** GET /api/Connection/{id} — Get connection by ID */
export const getConnectionById = async (id: number): Promise<Connection> => {
  const res = await axiosRequest.get(`/Connection/${id}`);
  return res.data.data ?? res.data;
};

/** GET /api/Connection/my — Get my accepted connections */
export const getMyConnections = async (): Promise<Connection[]> => {
  const res = await axiosRequest.get<ApiResponse<Connection[]>>('/Connection/my');
  return res.data.data;
};

/** GET /api/Connection/pending — Get pending connection requests */
export const getPendingConnections = async (): Promise<Connection[]> => {
  const res = await axiosRequest.get<ApiResponse<Connection[]>>('/Connection/pending');
  return res.data.data;
};

/** GET /api/Connection/all — Get all connections */
export const getAllConnections = async (): Promise<Connection[]> => {
  const res = await axiosRequest.get<ApiResponse<Connection[]>>('/Connection/all');
  return res.data.data;
};

/** DELETE /api/Connection/{connectionId} — Remove connection */
export const deleteConnection = async (connectionId: number): Promise<void> => {
  await axiosRequest.delete(`/Connection/${connectionId}`);
};
