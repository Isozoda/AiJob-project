import { create } from 'zustand';

interface PostUIState {
  showCreateModal: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  activeCommentPostId: number | null;
  toggleComments: (postId: number) => void;
  closeComments: () => void;
}

export const usePostStore = create<PostUIState>((set, get) => ({
  // Create Modal
  showCreateModal: false,
  openCreateModal: () => set({ showCreateModal: true }),
  closeCreateModal: () => set({ showCreateModal: false }),

  // Active Comment Section
  activeCommentPostId: null,
  toggleComments: (postId: number) =>
    set({
      activeCommentPostId: get().activeCommentPostId === postId ? null : postId,
    }),
  closeComments: () => set({ activeCommentPostId: null }),
}));
