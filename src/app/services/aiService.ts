import { axiosRequest } from '@/src/store/authStore';
import type {
  AiAskRequest,
  AiAskResponse,
  AnalyzeCvRequest,
  AnalyzeCvResponse,
  DraftCoverLetterRequest,
  DraftMessageRequest,
  AiTextResponse,
  ImproveJobRequest,
  ImproveJobResponse,
  SkillGapResponse
} from '../types/ai';

export const aiAsk = async (payload: AiAskRequest): Promise<string> => {
  const res = await axiosRequest.post<AiAskResponse>('/Ai/ask', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const analyzeCv = async (payload: AnalyzeCvRequest): Promise<AnalyzeCvResponse['data']> => {
  const res = await axiosRequest.post<AnalyzeCvResponse>('/Ai/analyze-cv', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const getSkillGap = async (userId: number, jobId: number): Promise<SkillGapResponse['data']> => {
  const res = await axiosRequest.get<SkillGapResponse>(`/Ai/skill-gap/${userId}/${jobId}`);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const draftCoverLetter = async (payload: DraftCoverLetterRequest): Promise<AiTextResponse['data']> => {
  const res = await axiosRequest.post<AiTextResponse>('/Ai/draft-cover-letter', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const draftMessage = async (payload: DraftMessageRequest): Promise<AiTextResponse['data']> => {
  const res = await axiosRequest.post<AiTextResponse>('/Ai/draft-message', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};

export const improveJob = async (payload: ImproveJobRequest): Promise<ImproveJobResponse['data']> => {
  const res = await axiosRequest.post<ImproveJobResponse>('/Ai/improve-job', payload);
  if (res.data.statusCode !== 0) {
    throw { response: { data: res.data } };
  }
  return res.data.data;
};
