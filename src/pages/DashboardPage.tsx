import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Newsfeed } from '../components/Newsfeed'
import { FileText, Users, TrendingUp, Bell } from 'lucide-react'

export function DashboardPage() {
  const { user, userRole } = useAuth()
  const navigate = useNavigate()

  const handleSearchBills = () => {
    navigate('/search?type=bills')
  }

  const handleFindLegislators = () => {
    navigate('/search?type=legislators')
  }

  const handleCreateCampaign = () => {
    navigate('/campaigns')
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No bills tracked yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Legislators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No legislators tracked</p>
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
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No campaigns created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">All caught up!</p>
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