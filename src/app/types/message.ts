// ─── Message Types (from Swagger) ───────────────────────────

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface SendMessagePayload {
  conversationId: number;
  content: string;
}
