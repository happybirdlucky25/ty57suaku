import { supabase } from '../lib/supabase'

export class ApiClient {
  private baseURL: string
  
  constructor() {
    this.baseURL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  }

  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : ''
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${this.baseURL}/${endpoint}`, {
      headers,
      ...options
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication & User Management
  async createUserProfile(data: {
    full_name?: string
    title?: string
    company?: string
    phone?: string
  }) {
    return this.request('create-user-profile', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async checkUserPermissions(action: string, resourceId?: string) {
    return this.request('check-user-permissions', {
      method: 'POST',
      body: JSON.stringify({ action, resource_id: resourceId })
    })
  }

  // Bill & Legislator Tracking
  async trackItem(itemType: 'bill' | 'legislator', itemId: string, notes?: string) {
    return this.request('track-item', {
      method: 'POST',
      body: JSON.stringify({ item_type: itemType, item_id: itemId, notes })
    })
  }

  async untrackItem(itemType: 'bill' | 'legislator', itemId: string) {
    return this.request('untrack-item', {
      method: 'POST',
      body: JSON.stringify({ item_type: itemType, item_id: itemId })
    })
  }

  async manageNotes(itemType: 'bill' | 'legislator', itemId: string, notes: string, action: 'create' | 'update' | 'delete') {
    return this.request('manage-notes', {
      method: 'POST',
      body: JSON.stringify({ item_type: itemType, item_id: itemId, notes, action })
    })
  }

  async searchBillsLegislators(params: {
    query?: string
    type: 'bills' | 'legislators' | 'both'
    filters?: {
      status?: string[]
      state?: string[]
      party?: string[]
      chamber?: string[]
    }
    page?: number
    limit?: number
  }) {
    return this.request('search-bills-legislators', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  }

  // Campaign Management
  async createCampaign(data: { name: string; description?: string }) {
    return this.request('create-campaign', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async manageCampaignItems(data: {
    campaign_id: number
    action: 'add' | 'remove'
    item_type: 'bill' | 'legislator' | 'contact'
    item_ids: string[]
  }) {
    return this.request('manage-campaign-items', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async manageTeamMembers(data: {
    campaign_id: number
    action: 'add' | 'remove' | 'update_role'
    user_email?: string
    user_id?: string
    role?: 'manager' | 'editor' | 'viewer'
  }) {
    return this.request('manage-team-members', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Document & Content Management
  async manageCampaignDocuments(data: {
    action: 'create' | 'update' | 'delete' | 'get'
    campaign_id: number
    document_id?: string
    title?: string
    content?: any
    document_type?: string
  }) {
    return this.request('manage-campaign-documents', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async generateAIContent(data: {
    campaign_id?: number
    bill_id?: string
    content_type: 'bill_summary' | 'campaign_memo' | 'talking_points' | 'compliance_review' | 'impact_analysis'
    prompt?: string
    is_public?: boolean
  }) {
    return this.request('generate-ai-content', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Notifications & Feed
  async generateUserFeed(params: {
    page?: number
    limit?: number
    feed_types?: string[]
  } = {}) {
    return this.request('generate-user-feed', {
      method: 'POST',
      body: JSON.stringify(params)
    })
  }

  async sendNotifications(data: {
    user_ids?: string[]
    campaign_id?: number
    notification_type: 'bill_update' | 'ai_report_ready' | 'campaign_share' | 'team_invite' | 'system_message'
    title: string
    message: string
    data?: any
    send_email?: boolean
    send_in_app?: boolean
  }) {
    return this.request('send-notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Legacy edge functions
  async analyzeBill(billId: string, analysisType: 'summary' | 'impact' | 'compliance') {
    return this.request('analyze-bill', {
      method: 'POST',
      body: JSON.stringify({ billId, analysisType })
    })
  }

  async updateCampaign(data: {
    campaignId: number
    updates: {
      name?: string
      description?: string
      billIds?: string[]
      legislatorIds?: string[]
    }
  }) {
    return this.request('update-campaign', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const apiClient = new ApiClient()