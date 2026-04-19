import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllPosts,
  getFeedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  repostPost,
  getPostComments,
  addPostComment,
} from '@/src/app/services/postService';
import type { Post, CreatePostPayload, CreateCommentPayload } from '@/src/app/types/post';

// ─── QUERY KEYS ─────────────────────────────────────────────
export const postKeys = {
  all: ['posts'] as const,
  feed: ['posts', 'feed'] as const,
  detail: (id: number) => ['posts', id] as const,
  comments: (postId: number) => ['posts', postId, 'comments'] as const,
};

// ─── QUERIES ────────────────────────────────────────────────

/** Fetch all posts */
export const useAllPosts = () =>
  useQuery({
    queryKey: postKeys.all,
    queryFn: getAllPosts,
  });

/** Fetch feed posts */
export const useFeedPosts = () =>
  useQuery({
    queryKey: postKeys.feed,
    queryFn: getFeedPosts,
  });

/** Fetch a single post by ID */
export const usePostById = (id: number) =>
  useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  });

/** Fetch comments of a post */
export const usePostComments = (postId: number, enabled = true) =>
  useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => getPostComments(postId),
    enabled,
  });

// ─── MUTATIONS ──────────────────────────────────────────────

/** Create a new post */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
  });
};

/** Update a post */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreatePostPayload }) =>
      updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

/** Delete a post */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
  });
};

/**
 * Toggle like — with OPTIMISTIC UPDATE
 * UI updates instantly, then syncs with server
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => toggleLikePost(postId),

    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      await queryClient.cancelQueries({ queryKey: postKeys.feed });

      const previousAllPosts = queryClient.getQueryData<Post[]>(postKeys.all);
      const previousFeedPosts = queryClient.getQueryData<Post[]>(postKeys.feed);

      const updatePost = (old: Post[] | undefined) =>
        old?.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByMe: !post.likedByMe,
                likeCount: post.likedByMe
                  ? Math.max(0, (post.likeCount ?? 1) - 1)
                  : (post.likeCount ?? 0) + 1,
              }
            : post
        );

      queryClient.setQueryData<Post[]>(postKeys.all, updatePost);
      queryClient.setQueryData<Post[]>(postKeys.feed, updatePost);

      return { previousAllPosts, previousFeedPosts };
    },

    onError: (_err, _postId, context) => {
      if (context?.previousAllPosts) {
        queryClient.setQueryData(postKeys.all, context.previousAllPosts);
      }
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(postKeys.feed, context.previousFeedPosts);
      }
    },

    onSuccess: (data) => {
      // Direct update from server response for absolute accuracy
      const updateWithServerData = (old: Post[] | undefined) =>
        old?.map((post) =>
          post.id === data.postId
            ? { ...post, likedByMe: data.likedByMe, likeCount: data.likeCount }
            : post
        );

      queryClient.setQueryData<Post[]>(postKeys.all, updateWithServerData);
      queryClient.setQueryData<Post[]>(postKeys.feed, updateWithServerData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
  });
};

/** Repost */
export const useRepost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => repostPost(postId),
    onSuccess: () => {
      // Invalidate all related lists
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    }
  });
};

/** Add comment — with optimistic insert */
export const useAddComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => addPostComment(postId, payload),
    onSuccess: () => {
      // Refresh comments for this post
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      
      // Update global feeds to refresh comment counts
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    }
  });
};
