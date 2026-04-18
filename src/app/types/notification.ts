export type NotificationType = "JobMatched" | string;

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: number;
  isRead: boolean;
  createdAt: string;
}

export interface PagedNotificationResponse {
  items: Notification[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
