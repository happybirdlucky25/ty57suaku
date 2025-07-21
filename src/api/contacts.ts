import { supabase } from '../lib/supabase'
import type { UserContact, ApiResponse } from '../types/database'

export const contactsApi = {
  // Get all contacts for current user
  async getContacts(): Promise<ApiResponse<UserContact[]>> {
    try {
      const { data, error } = await supabase
        .from('user_contacts')
        .select('*')
        .order('full_name', { ascending: true })

      return { data: data || [], error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get single contact by ID
  async getContact(id: string): Promise<ApiResponse<UserContact>> {
    try {
      const { data, error } = await supabase
        .from('user_contacts')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Create new contact
  async createContact(contact: Omit<UserContact, 'id' | 'created_at' | 'owner_id'>): Promise<ApiResponse<UserContact>> {
    try {
      const { data, error } = await supabase
        .from('user_contacts')
        .insert([contact])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update contact
  async updateContact(id: string, updates: Partial<UserContact>): Promise<ApiResponse<UserContact>> {
    try {
      const { data, error } = await supabase
        .from('user_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete contact
  async deleteContact(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('user_contacts')
        .delete()
        .eq('id', id)

      return { data: !error, error }
    } catch (error) {
      return { data: false, error: error as Error }
    }
  },

  // Search contacts
  async searchContacts(query: string): Promise<ApiResponse<UserContact[]>> {
    try {
      const { data, error } = await supabase
        .from('user_contacts')
        .select('*')
        .or(`full_name.ilike.%${query}%,organization.ilike.%${query}%,email.ilike.%${query}%`)
        .order('full_name', { ascending: true })

      return { data: data || [], error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}