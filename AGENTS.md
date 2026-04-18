# AiJob - AI Agent Instructions

## Project Overview

**AiJob** is a full-stack AI-powered job matching platform built with **Next.js 16.2.3** and **React 19.2.4**. The frontend connects to an external backend API (`http://157.180.29.248:8090`) to facilitate job searching, applications, profiles, messaging, and AI-assisted features.

### Key Technologies
- **Next.js 16.2.3** (App Router) - Frontend framework with API rewrites
- **React 19.2.4** - UI library
- **TanStack React Query 5** - Server state management with 5-min stale time
- **Zustand** - Client state management (auth, posts)
- **Tailwind CSS 4** - Styling framework
- **React Hook Form + Zod** - Form validation
- **Axios** - HTTP client with token-based auth
- **TypeScript** - Strict mode enabled

**⚠️ IMPORTANT**: Next.js 16.2.3 has breaking changes. Always check current Next.js docs, not training data.

## Project Structure

```
src/app/
├── pages/           # Route pages (Next.js App Router)
│  ├── jobs/        # Job listings and details
│  ├── profile/     # User profiles
│  ├── message/     # Messaging
│  ├── applications/ # Job applications
│  └── [other features...]
├── services/       # API service layer (jobService, postService, etc.)
├── hooks/          # React Query hooks with explicit key factories
├── types/          # TypeScript interfaces (job.ts, post.ts, profile.ts, etc.)
├── config/         # Configuration (queryClient provider)
└── store/          # Zustand stores (authStore, postStore)
src/components/     # Shared UI components (Header, Footer, JobCard)
components/ui/     # Base UI components (button.tsx)
lib/utils.ts        # Utility functions (cn from clsx + tailwind-merge)
```

## Development Workflow

**Commands:**
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## Architecture & Patterns

### 1. **API Layer (Services)**
Location: `src/app/services/`

All API calls go through service functions that:
- Use `axiosRequest` from authStore (pre-configured with auth token)
- Accept typed parameters, return typed data
- Check `statusCode !== 0` and throw on errors
- Prefix paths with `/` (e.g., `/Job`, `/Post`)

**Example pattern:**
```typescript
export const getJobById = async (id: number): Promise<Job> => {
  const res = await axiosRequest.get<any>(`/Job/${id}`);
  if (res.data?.data) return res.data.data;
  return res.data;
};
```

### 2. **React Query Integration**
Location: `src/app/hooks/`

**Query Key Factory Pattern** (required):
```typescript
const postKeys = {
  all: ['posts'] as const,
  feed: ['posts', 'feed'] as const,
  detail: (id: number) => ['posts', id] as const,
};
```

**Default Query Settings** (in queryClient):
- `staleTime`: 5 minutes (300s)
- `retry`: 1
- `refetchOnWindowFocus`: false

Use `useQuery` for reads, `useMutation` for writes, `useQueryClient` to invalidate caches.

### 3. **State Management**
- **React Query**: Server state (jobs, posts, profiles)
- **Zustand** (authStore, postStore): Client state (auth token, UI toggles)
- **localStorage**: Auth token persistence

### 4. **Authentication**
Location: `src/store/authStore.ts`

- Token stored in localStorage as `store_token`
- Axios interceptor adds `Authorization: Bearer {token}` to all requests
- Helper: `getToken()`, `saveToken(token)`, `getUserIdFromToken()`

### 5. **Type Organization**
Location: `src/app/types/`

Domain-driven types:
- `job.ts`: Job, JobCreateRequest, JobQueryParams, etc.
- `post.ts`: Post, CreatePostPayload, etc.
- `profile.ts`: Profile, ProfileUpdatePayload, etc.
- Response wrapper: `ApiResponse<T>`, `PagedResponse<T>`

### 6. **Forms & Validation**
- Use React Hook Form with Zod for schema validation
- Example: `useForm<JobCreateRequest>()` with `zodResolver`

## Common Development Tasks

### Adding a New Feature (e.g., new page for "Listings")

1. **Create types** → `src/app/types/listing.ts`
2. **Create service** → `src/app/services/listingService.ts` (with API calls)
3. **Create hook** → `src/app/hooks/useListing.ts` (with query keys)
4. **Create page** → `src/app/pages/listings/page.tsx` (use hook)
5. **Add component** → `src/components/ListingCard.tsx` if reusable
6. **Update Header** if new navigation needed

### Fetching Data on a Page

```typescript
import { useJobById } from '@/src/app/hooks/useJob';

export default function JobDetail({ params }: { params: { id: string } }) {
  const { data: job, isLoading, error } = useJobById(Number(params.id));
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading job</div>;
  
  return <div>{job?.title}</div>;
}
```

### Creating/Updating Data

```typescript
import { useCreateJob } from '@/src/app/hooks/useJob';

export default function CreateJobForm() {
  const mutation = useCreateJob();
  
  const onSubmit = async (data: JobCreateRequest) => {
    mutation.mutate(data, {
      onSuccess: () => toast.success('Job created'),
      onError: () => toast.error('Failed to create job'),
    });
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

## Key Conventions

1. **Component Names**: PascalCase (Header.tsx, JobCard.tsx)
2. **Utility Functions**: camelCase with type exports (getToken, saveToken)
3. **Query Keys**: Nested object with `all`, `feed`, `detail()` pattern
4. **Error Handling**: Check `statusCode !== 0` in services, throw errors for React Query
5. **Types**: Organize by domain in `types/` folder
6. **API Paths**: Always prefix with `/` in services (handled by baseURL)

## Important Notes

- Backend API at `http://157.180.29.248:8090` — API rewrites configured in `next.config.ts`
- Uploads accessible via `/uploads/` (also rewired)
- All responses wrapped in `ApiResponse<T>` structure with `statusCode`
- Client components use `"use client"` directive (React 19)
- TypeScript strict mode enabled — all types must be explicit

## Links to Key Files

- [next.config.ts](next.config.ts) — API rewrites configuration
- [tsconfig.json](tsconfig.json) — TypeScript config with `@/*` alias
- [src/app/config/queryClient.tsx](src/app/config/queryClient.tsx) — React Query setup
- [src/store/authStore.ts](src/store/authStore.ts) — Auth & axios configuration
