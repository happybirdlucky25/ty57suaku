// Core database types for ShadowCongress
export interface Bill {
  bill_id: string
  bill_number?: string
  title?: string
  description?: string
  status?: string
  status_date?: string
  change_hash?: string
}

export interface Campaign {
  id: number
  user_id: string
  name: string
  description?: string
  created_at: string
  lead_id?: string
}

export interface UserContact {
  id: string
  owner_id: string
  full_name: string
  email?: string
  phone?: string
  title?: string
  organization?: string
  notes?: string
  created_at: string
}

export interface TrackedBill {
  user_id: string
  bill_id: string
  tracked_at: string
  notes?: string
}

export interface TrackedLegislator {
  user_id: string
  legislator_id: string
  tracked_at: string
  notes?: string
}

export interface Person {
  people_id: string
  full_name?: string
  party?: string
  chamber?: string
  state?: string
}

export interface UserProfile {
  user_id: string
  full_name?: string
  title?: string
  company?: string
  phone?: string
  updated_at: string
}

export interface BillReport {
  id: string
  bill_id: string
  report_type: string
  content: any
  requested_by?: string
  requested_at: string
  completed_at?: string
  is_public: boolean
}

export interface CampaignDocument {
  id: string
  campaign_id?: number
  title: string
  content?: any
  updated_by?: string
  updated_at: string
}

// API response types
export type ApiResponse<T> = {
  data: T | null
  error: Error | null
}

export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  limit: number
}