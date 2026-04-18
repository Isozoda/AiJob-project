// ─── Profile Types (from Swagger) ───────────────────────────

export interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  headline: string;
  about: string;
  location: string;
  photoUrl: string;
  backgroundPhotoUrl: string;
  birthDate: string;
  createdAt: string;
}

export interface CreateProfilePayload {
  userId: number;
  firstName: string;
  lastName: string;
  headline: string;
  about: string;
  location: string;
  photoUrl: string;
  backgroundPhotoUrl: string;
  birthDate: string;
}

export interface UpdateProfilePayload {
  id: number;
  firstName: string;
  lastName: string;
  headline: string;
  about: string;
  location: string;
  photoUrl: string;
  backgroundPhotoUrl: string;
}
