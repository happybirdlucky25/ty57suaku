import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { mockDataService } from '../services/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Newsfeed } from '../components/Newsfeed'
import { FileText, Users, TrendingUp, Bell, Eye } from 'lucide-react'

export function DashboardPage() {
  const { user, userRole } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    trackedBillsCount: 0,
    trackedLegislatorsCount: 0,
    activeCampaignsCount: 0,
    notificationsCount: 0
  })
  const [recentBills, setRecentBills] = useState<any[]>([])
  const [recentLegislators, setRecentLegislators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const [dashboardStats, trackedBills, trackedLegislators] = await Promise.all([
          mockDataService.getDashboardStats(user.id),
          mockDataService.getTrackedBills(user.id),
          mockDataService.getTrackedLegislators(user.id)
        ])

        setStats(dashboardStats)
        setRecentBills(trackedBills.slice(0, 3)) // Show 3 most recent
        setRecentLegislators(trackedLegislators.slice(0, 3)) // Show 3 most recent
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const handleSearchBills = () => {
    navigate('/search?type=bills')
  }

  const handleFindLegislators = () => {
    navigate('/search?type=legislators')
  }

  const handleCreateCampaign = () => {
    navigate('/campaigns')
  }

  const handleViewBill = (billId: string) => {
    navigate(`/bill/${billId}`)
  }

  const handleViewLegislator = (legislatorId: string) => {
    navigate(`/legislator/${legislatorId}`)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tracked items and campaigns.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.trackedBillsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.trackedBillsCount === 0 ? 'No bills tracked yet' : `${stats.trackedBillsCount} bill${stats.trackedBillsCount !== 1 ? 's' : ''} tracked`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Legislators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.trackedLegislatorsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.trackedLegislatorsCount === 0 ? 'No legislators tracked' : `${stats.trackedLegislatorsCount} legislator${stats.trackedLegislatorsCount !== 1 ? 's' : ''} tracked`}
            </p>
          </CardContent>
        </Card>

        {userRole === 'paid' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.activeCampaignsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCampaignsCount === 0 ? 'No campaigns created' : `${stats.activeCampaignsCount} active campaign${stats.activeCampaignsCount !== 1 ? 's' : ''}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.notificationsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.notificationsCount === 0 ? 'All caught up!' : `${stats.notificationsCount} new notification${stats.notificationsCount !== 1 ? 's' : ''}`}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started by tracking bills and legislators you care about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleSearchBills}>
              Search Bills
            </Button>
            <Button variant="secondary" onClick={handleFindLegislators}>
              Find Legislators
            </Button>
            {userRole === 'paid' && (
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {(recentBills.length > 0 || recentLegislators.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bills */}
          {recentBills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recently Tracked Bills</span>
                  <Button variant="ghost" size="sm" onClick={handleSearchBills}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBills.map((item) => (
                    <div key={item.bill_id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.bill.bill_number}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.bill.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.bill.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Tracked {new Date(item.tracked_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewBill(item.bill_id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Legislators */}
          {recentLegislators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recently Tracked Legislators</span>
                  <Button variant="ghost" size="sm" onClick={handleFindLegislators}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLegislators.map((item) => (
                    <div key={item.legislator_id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.legislator.full_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.legislator.party} - {item.legislator.state} {item.legislator.chamber}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.legislator.chamber}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Tracked {new Date(item.tracked_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLegislator(item.legislator_id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Newsfeed */}
      <Newsfeed />

      {/* Upgrade Prompt for Free Users */}
      {userRole === 'free' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">Upgrade to Pro</CardTitle>
                <CardDescription className="text-blue-700">
                  Unlock campaigns, AI reports, and team collaboration
                </CardDescription>
              </div>
              <Badge variant="warning">Free Plan</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Pro Features</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}