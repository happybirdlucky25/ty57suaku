import { supabase } from '../lib/supabase'
import type { Bill, TrackedBill, ApiResponse } from '../types/database'

export const billsApi = {
  // Get all bills with optional search
  async getBills(search?: string, limit = 20, offset = 0): Promise<ApiResponse<Bill[]>> {
    try {
      let query = supabase
        .from('bills')
        .select('*')
        .order('status_date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,bill_number.ilike.%${search}%`)
      }

      const { data, error } = await query
      return { data: data || [], error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get single bill by ID
  async getBill(billId: string): Promise<ApiResponse<Bill>> {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('bill_id', billId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get user's tracked bills
  async getTrackedBills(): Promise<ApiResponse<(TrackedBill & { bills: Bill })[]>> {
    try {
      const { data, error } = await supabase
        .from('tracked_bills')
        .select(`
          *,
          bills (*)
        `)
        .order('tracked_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Track a bill
  async trackBill(billId: string, notes?: string): Promise<ApiResponse<TrackedBill>> {
    try {
      const { data, error } = await supabase
        .from('tracked_bills')
        .insert([{ bill_id: billId, notes }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Untrack a bill
  async untrackBill(billId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('tracked_bills')
        .delete()
        .eq('bill_id', billId)

      return { data: !error, error }
    } catch (error) {
      return { data: false, error: error as Error }
    }
  },

  // Update tracking notes
  async updateTrackingNotes(billId: string, notes: string): Promise<ApiResponse<TrackedBill>> {
    try {
      const { data, error } = await supabase
        .from('tracked_bills')
        .update({ notes })
        .eq('bill_id', billId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}