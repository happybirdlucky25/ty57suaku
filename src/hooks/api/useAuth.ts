import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { toast } from 'sonner'

export function useCreateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      full_name?: string
      title?: string
      company?: string
      phone?: string
    }) => apiClient.createUserProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`)
    }
  })
}

export function useCheckPermissions() {
  return useMutation({
    mutationFn: ({ action, resourceId }: { action: string; resourceId?: string }) =>
      apiClient.checkUserPermissions(action, resourceId)
  })
}