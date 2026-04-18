import { axiosRequest } from '@/src/store/authStore';
import type { Notification, PagedNotificationResponse } from '@/src/app/types/notification';
import type { ApiResponse } from '@/src/app/types/post';

/** POST /api/Notification */
export const createNotification = async (payload: { userId: number; type: string; title: string; message: string; relatedId: number }): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/Notification', payload);
  return res.data.data;
};

/** GET /api/Notification/{id} */
export const getNotificationById = async (id: number): Promise<Notification> => {
  const res = await axiosRequest.get<ApiResponse<Notification>>(`/Notification/${id}`);
  return res.data.data;
};

/** GET /api/Notification/paged */
export const getPagedNotifications = async (userId?: number, pageNumber: number = 1, pageSize: number = 10): Promise<PagedNotificationResponse> => {
  const params: any = { PageNumber: pageNumber, PageSize: pageSize };
  if (userId !== undefined) {
    params.userId = userId;
  }
  const res = await axiosRequest.get<PagedNotificationResponse>('/Notification/paged', { params });
  return res.data;
};

/** GET /api/Notification/by-user/{userId} */
export const getNotificationsByUser = async (userId: number): Promise<Notification[]> => {
  const res = await axiosRequest.get<ApiResponse<Notification[]>>(`/Notification/by-user/${userId}`);
  return res.data.data;
};

/** PATCH /api/Notification/{id}/read */
export const markNotificationAsRead = async (id: number): Promise<string> => {
  const res = await axiosRequest.patch<ApiResponse<string>>(`/Notification/${id}/read`);
  return res.data.data;
};

/** DELETE /api/Notification/{id} */
export const deleteNotification = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Notification/${id}`);
  return res.data.data;
};
