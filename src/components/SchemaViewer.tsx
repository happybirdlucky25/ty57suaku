import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface Table {
  table_name: string;
  columns: Column[];
}

export function SchemaViewer() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSchema() {
      try {
        // First get all tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
        
        if (tablesError) throw tablesError

        if (tablesData) {
          // Then get columns for each table
          const tablesWithColumns = await Promise.all(
            tablesData.map(async (table) => {
              const { data: columnsData, error: columnsError } = await supabase
                .from('information_schema.columns')
                .select('column_name, data_type, is_nullable')
                .eq('table_schema', 'public')
                .eq('table_name', table.table_name)

              if (columnsError) throw columnsError

              return {
                table_name: table.table_name,
                columns: columnsData || []
              }
            })
          )
          setTables(tablesWithColumns)
        }
      } catch (err) {
        console.error('Error fetching schema:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch schema')
      }
    }

    fetchSchema()
  }, [])

  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Database Schema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Tables</h3>
          <ul className="space-y-1">
            {tables.map((table) => (
              <li 
                key={table.table_name}
                className={`cursor-pointer p-2 rounded ${selectedTable === table.table_name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedTable(table.table_name)}
              >
                {table.table_name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedTable && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Columns for {selectedTable}</h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Column</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Nullable</th>
                  </tr>
                </thead>
                <tbody>
                  {tables
                    .find(t => t.table_name === selectedTable)
                    ?.columns.map((column) => (
                      <tr key={column.column_name}>
                        <td className="pr-4">{column.column_name}</td>
                        <td className="pr-4">{column.data_type}</td>
                        <td>{column.is_nullable === 'YES' ? '✓' : '✗'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
