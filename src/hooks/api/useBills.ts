import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { toast } from 'sonner'

export function useSearchBills(params: {
  query?: string
  type: 'bills' | 'legislators' | 'both'
  filters?: any
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => apiClient.searchBillsLegislators(params),
    enabled: !!params.query || Object.keys(params.filters || {}).length > 0
  })
}

export function useTrackItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemType, itemId, notes }: {
      itemType: 'bill' | 'legislator'
      itemId: string
      notes?: string
    }) => apiClient.trackItem(itemType, itemId, notes),
    onSuccess: (_, variables) => {
      toast.success(`Started tracking ${variables.itemType}`)
      queryClient.invalidateQueries({ queryKey: ['tracked-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to track item: ${error.message}`)
    }
  })
}

export function useUntrackItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemType, itemId }: {
      itemType: 'bill' | 'legislator'
      itemId: string
    }) => apiClient.untrackItem(itemType, itemId),
    onSuccess: (_, variables) => {
      toast.success(`Stopped tracking ${variables.itemType}`)
      queryClient.invalidateQueries({ queryKey: ['tracked-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to untrack item: ${error.message}`)
    }
  })
}

export function useManageNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemType, itemId, notes, action }: {
      itemType: 'bill' | 'legislator'
      itemId: string
      notes: string
      action: 'create' | 'update' | 'delete'
    }) => apiClient.manageNotes(itemType, itemId, notes, action),
    onSuccess: () => {
      toast.success('Notes updated')
      queryClient.invalidateQueries({ queryKey: ['tracked-items'] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to update notes: ${error.message}`)
    }
  })
}

export function useGenerateAIContent() {
  return useMutation({
    mutationFn: (data: {
      campaign_id?: number
      bill_id?: string
      content_type: string
      prompt?: string
      is_public?: boolean
    }) => apiClient.generateAIContent(data as any),
    onSuccess: () => {
      toast.success('AI content generated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate content: ${error.message}`)
    }
  })
}