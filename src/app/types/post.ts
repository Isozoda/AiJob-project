// ─── Post Types (from Swagger) ─────────────────────────────

export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  repostOfPostId: number | null;
  repostSourceUserId?: number;
  likeCount?: number;
  likedByMe?: boolean;
  repostCount?: number;
  commentCount?: number;
}

export interface PostComment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface LikeResponse {
  postId: number;
  likeCount: number;
  likedByMe: boolean;
}

export interface CreatePostPayload {
  content: string;
  imageUrl: string | null;
}

export interface CreateCommentPayload {
  content: string;
}

// Generic API response from .NET backend
export interface ApiResponse<T> {
  statusCode: number;
  description: string[];
  data: T;
}
