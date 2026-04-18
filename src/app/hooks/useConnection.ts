import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendConnectionRequest,
  respondToConnection,
  getMyConnections,
  getPendingConnections,
  getAllConnections,
  deleteConnection,
} from '@/src/app/services/connectionService';
import type { RespondPayload } from '@/src/app/types/connection';

export const connectionKeys = {
  my: ['connections', 'my'] as const,
  pending: ['connections', 'pending'] as const,
  all: ['connections', 'all'] as const,
};

/** My accepted connections */
export const useMyConnections = () =>
  useQuery({ queryKey: connectionKeys.my, queryFn: getMyConnections });

/** Pending connection requests */
export const usePendingConnections = () =>
  useQuery({ queryKey: connectionKeys.pending, queryFn: getPendingConnections });

/** All connections */
export const useAllConnections = () =>
  useQuery({ queryKey: connectionKeys.all, queryFn: getAllConnections });

/** Send connection request */
export const useSendConnection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (addresseeId: number) => sendConnectionRequest(addresseeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

/** Respond (Accept / Reject) */
export const useRespondConnection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ connectionId, payload }: { connectionId: number; payload: RespondPayload }) =>
      respondToConnection(connectionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

/** Delete connection */
export const useDeleteConnection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: number) => deleteConnection(connectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
