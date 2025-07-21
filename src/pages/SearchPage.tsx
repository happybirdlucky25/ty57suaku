import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, FileText, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      // TODO: Implement actual search functionality
      // For now, show placeholder results
      setTimeout(() => {
        setSearchResults([
          {
            id: '1',
            type: 'bill',
            title: 'Example Bill HR-1234',
            description: 'This is an example bill that would appear in search results...',
            status: 'In Committee'
          },
          {
            id: '2',
            type: 'legislator',
            title: 'Sen. Example Name',
            description: 'Senator from Example State, serves on Finance Committee...',
            status: 'Active'
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Search failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Search Bills & Legislators
        </h1>
        <p className="mt-2 text-gray-600">
          Find congressional bills and representatives by name, topic, or bill number
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for bills, legislators, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} loading={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="ghost" size="sm">Bills</Button>
            <Button variant="ghost" size="sm">Legislators</Button>
            <Button variant="ghost" size="sm">Committees</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({searchResults.length})
          </h2>
          
          {searchResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {result.type === 'bill' ? (
                      <FileText className="h-5 w-5 text-blue-600" />
                    ) : (
                      <User className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {result.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={result.type === 'bill' ? 'secondary' : 'default'}>
                    {result.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    Track {result.type === 'bill' ? 'Bill' : 'Legislator'}
                  </Button>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && searchQuery && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-500">
              Try searching for a different term or check your spelling
            </p>
          </CardContent>
        </Card>
      )}

      {/* Getting Started */}
      {searchResults.length === 0 && !searchQuery && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Start Your Search</h3>
            <p className="mt-2 text-gray-500">
              Enter a bill number, legislator name, or topic to get started
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm text-gray-600">
              <span>Try: "HR-1234"</span>
              <span>•</span>
              <span>"Climate Change"</span>
              <span>•</span>
              <span>"John Smith"</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}