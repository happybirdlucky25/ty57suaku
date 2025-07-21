import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, FileText, User, Heart } from 'lucide-react'
import { mockDataService } from '../services/mockData'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import type { Bill, Person } from '../types/database'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [bills, setBills] = useState<Bill[]>([])
  const [legislators, setLegislators] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'bills' | 'legislators' | 'committees'>('all')
  const [trackingBill, setTrackingBill] = useState<string | null>(null)
  const [trackingLegislator, setTrackingLegislator] = useState<string | null>(null)

  // Load initial results on page load if there's a search param
  useEffect(() => {
    const initialSearch = searchParams.get('search')
    const filterType = searchParams.get('type')
    
    if (initialSearch) {
      setSearchQuery(initialSearch)
      handleSearch(initialSearch)
    }
    
    if (filterType === 'bills') {
      setActiveFilter('bills')
    } else if (filterType === 'legislators') {
      setActiveFilter('legislators')
    }
  }, [searchParams])

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return
    
    setIsLoading(true)
    try {
      const results = await mockDataService.search(searchTerm)
      setBills(results.bills)
      setLegislators(results.legislators)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrackBill = async (billId: string) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setTrackingBill(billId)
    try {
      await mockDataService.trackBill(user.id, billId)
      // Show success feedback
      console.log(`Bill ${billId} tracked successfully`)
    } catch (error) {
      console.error('Failed to track bill:', error)
    } finally {
      setTrackingBill(null)
    }
  }

  const handleTrackLegislator = async (legislatorId: string) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setTrackingLegislator(legislatorId)
    try {
      await mockDataService.trackLegislator(user.id, legislatorId)
      // Show success feedback
      console.log(`Legislator ${legislatorId} tracked successfully`)
    } catch (error) {
      console.error('Failed to track legislator:', error)
    } finally {
      setTrackingLegislator(null)
    }
  }

  const handleViewBill = (billId: string) => {
    navigate(`/bill/${billId}`)
  }

  const handleViewLegislator = (legislatorId: string) => {
    navigate(`/legislator/${legislatorId}`)
  }

  const getFilteredResults = () => {
    switch (activeFilter) {
      case 'bills':
        return { bills, legislators: [] }
      case 'legislators':
        return { bills: [], legislators }
      default:
        return { bills, legislators }
    }
  }

  const filteredResults = getFilteredResults()
  const totalResults = filteredResults.bills.length + filteredResults.legislators.length

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
            <Button onClick={() => handleSearch()} loading={isLoading}>
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
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              All ({bills.length + legislators.length})
            </Button>
            <Button 
              variant={activeFilter === 'bills' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveFilter('bills')}
            >
              Bills ({bills.length})
            </Button>
            <Button 
              variant={activeFilter === 'legislators' ? 'primary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveFilter('legislators')}
            >
              Legislators ({legislators.length})
            </Button>
            <Button variant="ghost" size="sm" disabled>
              Committees (0)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {totalResults > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({totalResults})
          </h2>
          
          {/* Bills Results */}
          {filteredResults.bills.map((bill) => (
            <Card key={bill.bill_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{bill.bill_number}</CardTitle>
                      <h3 className="text-base font-medium text-gray-900 mt-1">{bill.title}</h3>
                      <CardDescription className="mt-1 line-clamp-2">
                        {bill.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {bill.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleTrackBill(bill.bill_id)}
                      loading={trackingBill === bill.bill_id}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {trackingBill === bill.bill_id ? 'Tracking...' : 'Track Bill'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => navigate('/login')}>
                      Sign in to Track
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleViewBill(bill.bill_id)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Legislators Results */}
          {filteredResults.legislators.map((legislator) => (
            <Card key={legislator.people_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{legislator.full_name}</CardTitle>
                      <CardDescription className="mt-1">
                        {legislator.party} - {legislator.state} {legislator.chamber}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="default">
                    {legislator.chamber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleTrackLegislator(legislator.people_id)}
                      loading={trackingLegislator === legislator.people_id}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {trackingLegislator === legislator.people_id ? 'Tracking...' : 'Track Legislator'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => navigate('/login')}>
                      Sign in to Track
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleViewLegislator(legislator.people_id)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {totalResults === 0 && searchQuery && !isLoading && (
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
      {totalResults === 0 && !searchQuery && (
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