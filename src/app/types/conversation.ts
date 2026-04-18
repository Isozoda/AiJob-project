export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  unreadCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
}
