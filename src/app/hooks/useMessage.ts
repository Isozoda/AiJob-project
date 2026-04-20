import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
} from "@/src/app/services/messageService";

import type { SendMessagePayload } from "@/src/app/types/message";

export const messageKeys = {
  byConversation: (id: number) => ["messages", id] as const,
};

/** Get messages by conversation */
export const useConversationMessages = (
  conversationId: number,
  enabled = true,
) =>
  useQuery({
    queryKey: messageKeys.byConversation(conversationId),
    queryFn: () => getMessagesByConversation(conversationId),
    enabled,
    refetchInterval: 5000, // auto-refresh every 5s for real-time feel
  });

/** Send a message */
export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: messageKeys.byConversation(variables.conversationId),
      });
    },
  });
};

/** Delete a message */
export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMessage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
