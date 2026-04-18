import { axiosRequest } from '@/src/store/authStore';
import type {
  Post,
  PostComment,
  LikeResponse,
  CreatePostPayload,
  CreateCommentPayload,
  ApiResponse,
} from '@/src/app/types/post';

// ─── POST SERVICE ───────────────────────────────────────────
// All API calls for the Post endpoints from Swagger

/** GET /api/Post — Get all posts */
export const getAllPosts = async (): Promise<Post[]> => {
  const res = await axiosRequest.get<ApiResponse<Post[]>>('/Post');
  return res.data.data;
};

/** GET /api/Post/feed — Get feed posts (with like/repost info) */
export const getFeedPosts = async (): Promise<Post[]> => {
  const res = await axiosRequest.get<ApiResponse<Post[]>>('/Post/feed');
  return res.data.data;
};

/** GET /api/Post/{id} — Get a single post by ID */
export const getPostById = async (id: number): Promise<Post> => {
  const res = await axiosRequest.get<ApiResponse<Post>>(`/Post/${id}`);
  return res.data.data;
};

/** POST /api/Post — Create a new post */
export const createPost = async (payload: CreatePostPayload): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>('/Post', payload);
  return res.data.data;
};

/** PUT /api/Post/{id} — Update a post */
export const updatePost = async (id: number, payload: CreatePostPayload): Promise<string> => {
  const res = await axiosRequest.put<ApiResponse<string>>(`/Post/${id}`, payload);
  return res.data.data;
};

/** DELETE /api/Post/{id} — Delete a post */
export const deletePost = async (id: number): Promise<string> => {
  const res = await axiosRequest.delete<ApiResponse<string>>(`/Post/${id}`);
  return res.data.data;
};

/** POST /api/Post/{postId}/like — Toggle like on a post */
export const toggleLikePost = async (postId: number): Promise<LikeResponse> => {
  const res = await axiosRequest.post<ApiResponse<LikeResponse>>(`/Post/${postId}/like`);
  return res.data.data;
};

/** POST /api/Post/{postId}/repost — Repost a post */
export const repostPost = async (postId: number): Promise<string> => {
  const res = await axiosRequest.post<ApiResponse<string>>(`/Post/${postId}/repost`);
  return res.data.data;
};

/** GET /api/Post/{postId}/comments — Get comments of a post */
export const getPostComments = async (postId: number): Promise<PostComment[]> => {
  const res = await axiosRequest.get<ApiResponse<PostComment[]>>(`/Post/${postId}/comments`);
  return res.data.data;
};

/** POST /api/Post/{postId}/comments — Add comment to a post */
export const addPostComment = async (
  postId: number,
  payload: CreateCommentPayload
): Promise<PostComment> => {
  const res = await axiosRequest.post<ApiResponse<PostComment>>(
    `/Post/${postId}/comments`,
    payload
  );
  return res.data.data;
};
