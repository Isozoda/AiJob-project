export type OrganizationType = 'Startup' | 'Enterprise' | 'Agency' | 'NonProfit' | 'Other';

export interface Organization {
  id: number;
  name: string;
  description: string;
  type: OrganizationType | string;
  location: string;
  logoUrl: string;
}

export interface OrganizationCreateRequest {
  name: string;
  description: string;
  type: string;
  location: string;
  logoUrl: string;
}

export interface OrganizationQueryParams {
  Name?: string;
  PageNumber?: number;
  PageSize?: number;
}
