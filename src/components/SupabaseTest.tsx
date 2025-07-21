import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function SupabaseTest() {
  const [testMessage, setTestMessage] = useState('Testing connection...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data: _data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setTestMessage('Successfully connected to Supabase!')
        console.log('Supabase connection successful')
      } catch (err) {
        console.error('Error testing Supabase connection:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      {testMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {testMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          Error: {error}
        </div>
      )}
    </div>
  )
}
