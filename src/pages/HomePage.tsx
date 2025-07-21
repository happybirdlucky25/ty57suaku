import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function HomePage() {
  const { userRole, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Track Congressional Action
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Stay informed on bills and legislators that matter to you. Get AI-powered summaries and build advocacy campaigns.
        </p>
        
        {!isAuthenticated && (
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Button size="lg">Get Started Free</Button>
            <Button variant="ghost" size="lg">Learn More</Button>
          </div>
        )}
      </div>

      {/* Search Section */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Bills & Legislators
          </CardTitle>
          <CardDescription>
            Find congressional bills and representatives by name, topic, or bill number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for bills, legislators, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Track Bills & Legislators</CardTitle>
            <CardDescription>
              Follow the legislation and representatives that matter to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={userRole !== 'anonymous' ? 'success' : 'secondary'}>
              {userRole !== 'anonymous' ? 'Available' : 'Sign up required'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Summaries</CardTitle>
            <CardDescription>
              Get clear, digestible summaries of complex legislation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Public Feature</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Workspaces</CardTitle>
            <CardDescription>
              Build advocacy campaigns and collaborate with your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={userRole === 'paid' ? 'success' : 'warning'}>
              {userRole === 'paid' ? 'Available' : 'Pro Feature'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action for Free Users */}
      {userRole === 'free' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900">
                Unlock Advanced Features
              </h3>
              <p className="mt-2 text-blue-700">
                Upgrade to Pro to create campaigns, generate custom reports, and collaborate with your team.
              </p>
              <Button className="mt-4" variant="primary">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}