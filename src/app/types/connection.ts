// ─── Connection Types (from Swagger) ────────────────────────

export type ConnectionStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface Connection {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  createdAt: string;
}

export interface RespondPayload {
  status: ConnectionStatus;
}

export interface SendByEmailPayload {
  email: string;
}
