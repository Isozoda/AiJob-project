import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProfile,
  getProfileById,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
} from '@/src/app/services/profileService';
import type { CreateProfilePayload, UpdateProfilePayload } from '@/src/app/types/profile';

// ─── QUERY KEYS ─────────────────────────────────────────────
export const profileKeys = {
  byId: (id: number) => ['profile', id] as const,
  byUserId: (userId: number) => ['profile', 'user', userId] as const,
  me: ['profile', 'me'] as const,
};

// ─── QUERIES ────────────────────────────────────────────────

/** Get profile by profile ID */
export const useProfileById = (id: number) =>
  useQuery({
    queryKey: profileKeys.byId(id),
    queryFn: () => getProfileById(id),
    enabled: !!id,
  });

/** Get profile by user ID */
export const useProfileByUserId = (userId: number) =>
  useQuery({
    queryKey: profileKeys.byUserId(userId),
    queryFn: () => getProfileByUserId(userId),
    enabled: !!userId,
  });

// ─── MUTATIONS ──────────────────────────────────────────────

/** Create profile */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProfilePayload) => createProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/** Update profile */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProfilePayload }) =>
      updateProfile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/** Delete profile */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
