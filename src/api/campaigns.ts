import { supabase } from '../lib/supabase'
import { Campaign, ApiResponse } from '../types/database'

export const campaignsApi = {
  // Get all campaigns for current user
  async getUserCampaigns(): Promise<ApiResponse<Campaign[]>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get single campaign by ID
  async getCampaign(id: number): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Create new campaign
  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'user_id'>): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([campaign])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update campaign
  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete campaign
  async deleteCampaign(id: number): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id)

      return { data: !error, error }
    } catch (error) {
      return { data: false, error: error as Error }
    }
  }
}