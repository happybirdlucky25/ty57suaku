import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function ConnectionTest() {
  const [status, setStatus] = useState<string>('Testing...')
  const [envVars, setEnvVars] = useState<string[]>([])

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('bills').select('bill_id').limit(1)
        
        if (error) throw error
        
        setStatus(data ? 'Connected! ✅' : 'Connected but no bills found')
        
        // Check environment variables (safely)
        const vars = [
          'VITE_SUPABASE_URL',
          'SUPABASE_PROJECT_ID',
          'ENABLE_AI_FEATURES',
          'ENABLE_REALTIME'
        ]
        
        setEnvVars(vars.filter(v => import.meta.env[v]))
        
      } catch (err) {
        setStatus(`Error: ${err instanceof Error ? err.message : String(err)} ❌`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Connection Status</h2>
      <p className="mb-4">{status}</p>
      <div>
        <h3 className="font-semibold mb-2">Environment Variables Found:</h3>
        <ul className="list-disc pl-5">
          {envVars.map(v => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
